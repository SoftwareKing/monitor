package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.exception.SnmpException;
import dnt.monitor.engine.snmp.SnmpVisitor;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.support.DefaultGeneralMap;
import org.apache.commons.lang.StringUtils;
import org.snmp4j.*;
import org.snmp4j.event.ResponseEvent;
import org.snmp4j.mp.SnmpConstants;
import org.snmp4j.smi.OID;
import org.snmp4j.smi.Variable;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.util.DefaultPDUFactory;
import org.snmp4j.util.RetrievalEvent;
import org.snmp4j.util.TreeEvent;
import org.snmp4j.util.TreeUtils;

import java.io.IOException;
import java.util.List;

import static dnt.monitor.service.ErrorCodes.*;
import static org.snmp4j.smi.SMIConstants.*;

/**
 * <h1>最简单的Snmp访问对象</h1>
 *
 * @author Jay Xiong
 */
class SimpleSnmpVisitor implements SnmpVisitor {
    protected Target target;
    protected Snmp snmp;

    public SimpleSnmpVisitor(Target target, Snmp snmp) {
        this.target = target;
        this.snmp = snmp;
    }

    @Override
    public Object get(String oid) throws SnmpException {
        return get(oid, target.getTimeout());
    }

    @Override
    public Object get(String oid, long timeout) throws SnmpException {
        long originTimeout = target.getTimeout();
        int originRetries = target.getRetries();
        try {
            target.setTimeout(timeout);
            target.setRetries(0);
            PDU pdu = createPDU(target, oid);
            ResponseEvent responseEvent = snmp.get(pdu, target);
            checkResponse(responseEvent, target);
            Variable variable = responseEvent.getResponse().getVariable(new OID(oid));
            return toObject(oid, variable);
        } catch (IOException e) {
            throw new SnmpException(PROBE_SAMPLE_ERROR,
                                     "Can't get " + oid + " from " + target, e);
        } finally {
            target.setTimeout(originTimeout);
            target.setRetries(originRetries);
        }
    }

    @Override
    public GeneralMap<String, Object> gets(String... oids) throws SnmpException {
        GeneralMap<String, Object> result = new DefaultGeneralMap<String, Object>();
        ResponseEvent responseEvent;
        for (String oid : oids) {
            PDU pdu = createPDU(target, oid);
            try {
                responseEvent = snmp.get(pdu, target);
            } catch (IOException e) {
                throw new SnmpException(PROBE_SAMPLE_ERROR,
                                         "Can't gets " + oid + " from " + target, e);
            }
            checkResponse(responseEvent, target);
            Variable variable = responseEvent.getResponse().getVariable(new OID(oid));
            Object value = toObject(oid, variable);
            result.put(oid, value);
        }
        return result;
    }

    @Override
    public GeneralMap<String, Object> bulk(String... oids) throws SnmpException {
        List<VariableBinding> vbs = bulk(oids, 0);
        GeneralMap<String, Object> result = new DefaultGeneralMap<String, Object>();
        for (VariableBinding vb : vbs) {
            String oid = vb.getOid().toString();
            Object value = toObject(oid, vb.getVariable());
            result.put(oid, value);
        }
        return result;
    }

    @Override
    public GeneralMap<String, Object> walk(String oid) throws SnmpException {
        TreeUtils treeUtils = new TreeUtils(snmp, new DefaultPDUFactory());
        List<TreeEvent> subtree = treeUtils.getSubtree(target, new OID(oid));
        return treeMap(subtree);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Legacy Support for depended Probes
    //   ONLY next and bulk are used
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    public VariableBinding next(String oid) throws SnmpException {
        ResponseEvent responseEvent;
        PDU pdu = createPDU(target, oid);
        try {
            responseEvent = snmp.getNext(pdu, target);
        } catch (IOException e) {
            throw new SnmpException(PROBE_SAMPLE_ERROR,
                                     "Can't getNext " + oid + " from " + target, e);
        }
        checkResponse(responseEvent, target);
        return responseEvent.getResponse().getVariableBindings().get(0);
    }

    public List<VariableBinding> bulk(String[] oids, int maxRepetitions) throws SnmpException {
        ResponseEvent responseEvent;
        PDU pdu = createPDU(target, oids);
        pdu.setNonRepeaters(oids.length);
        pdu.setMaxRepetitions(maxRepetitions);
        try {
            responseEvent = snmp.getBulk(pdu, target);
        } catch (IOException e) {
            throw new SnmpException(PROBE_SAMPLE_ERROR,
                                     "Can't getBulk " + StringUtils.join(oids) + " from " + target, e);
        }
        checkResponse(responseEvent, target);
        //noinspection unchecked
        return (List<VariableBinding>) responseEvent.getResponse().getVariableBindings();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Inner Implementations
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    public PDU createPDU(Target target, String... oids) {
        PDU pdu = createPDU(target);
        for (String oid : oids) {
            pdu.add(new VariableBinding(new OID(oid)));
        }
        return pdu;
    }

    public PDU createPDU(Target target) {
        PDU pdu;
        switch (target.getVersion()) {
            case SnmpConstants.version2c:
                pdu = new PDU();
                break;
            case SnmpConstants.version3:
                pdu = new ScopedPDU();
                break;
            default:                         //version1
                pdu = new PDUv1();
        }
        return pdu;
    }

    /**
     * 将一个SNMP的 Variable 转换为一个普通的Java对象
     *
     * @param oid      对象标识
     * @param variable 变量
     * @return 对象
     */
    protected Object toObject(String oid, Variable variable) throws SnmpException {
        switch (variable.getSyntax()) {
            case SYNTAX_INTEGER32:
                return variable.toInt();
            case SYNTAX_COUNTER32:
            case SYNTAX_COUNTER64:
            case SYNTAX_GAUGE32:
                return variable.toLong();
            case SYNTAX_OCTET_STRING:
            case SYNTAX_OBJECT_IDENTIFIER:
            case SYNTAX_IPADDRESS:
            case SYNTAX_OPAQUE:
                return variable.toString();
            case SYNTAX_NULL:
                return null;
            case EXCEPTION_NO_SUCH_OBJECT:
                throw new SnmpException(PROBE_NO_SUCH_OBJECT, "No such object:" + oid);
            case EXCEPTION_NO_SUCH_INSTANCE:
                throw new SnmpException(PROBE_NO_SUCH_INSTANCE, "No such instance:" + oid);
            case EXCEPTION_END_OF_MIB_VIEW:
                return null;
            default:
                return variable.toString();
        }
    }


    protected GeneralMap<String, Object> treeMap(List<TreeEvent> subtree) throws SnmpException {
        DefaultGeneralMap<String, Object> tree = new DefaultGeneralMap<String, Object>();
        for (TreeEvent event : subtree) {
            checkEvent(event);
            VariableBinding[] nodes = event.getVariableBindings();
            for (VariableBinding node : nodes) {
                String oid = node.getOid().toString();
                Object value = toObject(oid, node.getVariable());
                tree.put(oid, value);
            }
        }
        return tree;
    }

    private void checkResponse(ResponseEvent responseEvent, Target target) throws SnmpException {
        //noinspection ThrowableResultOfMethodCallIgnored
        if (responseEvent.getError() != null)
            throw new SnmpException(PROBE_SAMPLE_ERROR, responseEvent.getError());

        PDU pdu = responseEvent.getResponse();
        if (pdu == null) {
            throw new SnmpException(PROBE_TIMEOUT,
                                     "Probe sample timed out to " + target.getAddress());
        }
        int errorStatus = pdu.getErrorStatus();
        if (errorStatus == PDU.noError) return;
        String errorText = pdu.getErrorStatusText();
        switch (errorStatus) {
            case PDU.tooBig:
                throw new SnmpException(PROBE_TOO_BIG, errorText);
            case PDU.noSuchName:
                throw new SnmpException(PROBE_NO_SUCH_OBJECT, errorText);
            case PDU.wrongType:
                throw new SnmpException(PROBE_UNSUPPORTED_TYPE, errorText);
            case PDU.authorizationError:
                throw new SnmpException(PROBE_AUTHORIZATION_ERROR, errorText);
            case PDU.readOnly:
            case PDU.notWritable:
                throw new SnmpException(PROBE_READONLY, errorText);
            case PDU.badValue:
            case PDU.wrongValue:
            case PDU.wrongEncoding:
            case PDU.wrongLength:
            case PDU.inconsistentValue:
            case PDU.inconsistentName:
                throw new SnmpException(PROBE_BAD_INPUT, errorText);
            case PDU.noCreation:
                throw new SnmpException(PROBE_AUTH_INSUFFICIENT, errorText);
            case PDU.genErr:
            case PDU.noAccess:
            case PDU.resourceUnavailable:
            case PDU.commitFailed:
            case PDU.undoFailed:
                throw new SnmpException(PROBE_SAMPLE_ERROR, errorText);
            default:
                throw new SnmpException(PROBE_SAMPLE_ERROR,
                                         "Unrecognized snmp error code: " + errorStatus +
                                         ", error text = " + pdu.getErrorStatusText());
        }
    }

    protected void checkEvent(RetrievalEvent event) throws SnmpException {
        if (!event.isError()) return;
        switch (event.getStatus()) {
            case RetrievalEvent.STATUS_TIMEOUT:
                throw new SnmpException(PROBE_TIMEOUT, this + " : " + event.getErrorMessage());
            case RetrievalEvent.STATUS_WRONG_ORDER:
                throw new SnmpException(PROBE_CONFIG_ERROR, this + " : " + event.getErrorMessage());
            default:
                throw new SnmpException(PROBE_SAMPLE_ERROR, this + " : " + event.getErrorMessage());
        }
    }


}
