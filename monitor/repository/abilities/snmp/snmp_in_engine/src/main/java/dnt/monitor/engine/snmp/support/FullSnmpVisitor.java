package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.exception.SnmpException;
import dnt.monitor.engine.snmp.MibAwareSnmpVisitor;
import dnt.monitor.engine.snmp.MibRepository;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.SnmpCredential;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.support.DefaultGeneralMap;
import net.percederberg.mibble.MibValueSymbol;
import net.percederberg.mibble.value.ObjectIdentifierValue;
import org.snmp4j.Snmp;
import org.snmp4j.Target;
import org.snmp4j.smi.OID;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.util.DefaultPDUFactory;
import org.snmp4j.util.TableEvent;
import org.snmp4j.util.TableUtils;

import java.util.*;

/**
 * <h1>Full SNMP Visitor with MIB support</h1>
 *
 * @author Jay Xiong
 */
class FullSnmpVisitor extends SimpleSnmpVisitor implements MibAwareSnmpVisitor {
    private final MibRepository repository;
    private final GeneralMap<String, Object> options;

    public FullSnmpVisitor(ManagedNode node,
                           Target target,
                           Resource resource,
                           SnmpCredential credential,
                           Snmp snmp,
                           MibRepository repository) {
        super(node, resource, credential, target, snmp);
        this.repository = repository;
        this.options = new DefaultGeneralMap<String, Object>();
        this.options.put(PAGE_SIZE, 100);
        this.options.put(MAX_COLS_PER_PDU, 50);
        this.options.put(MAX_ROWS_PER_PDU, 100);
    }

    @Override
    public void setOption(String key, Object value) {
        options.put(key, value);
    }

    @Override
    public GeneralMap<String, Object> walk(String oid, String prefix) throws SnmpException {
        return walk(target.getTimeout(), oid, prefix);
    }

    @Override
    public GeneralMap<String, Object> walk(long timeout, String oid, String prefix) throws SnmpException {
        GeneralMap<String, Object> result = super.walk(timeout, oid);

        ObjectIdentifierValue identifier = repository.getSymbol(oid);
        if (identifier == null) throw new UnsupportedOperationException("There is no mib definition for " + oid);
        Set<String> instanceOIDs = new HashSet<String>(result.keySet());
        for (String instanceOID : instanceOIDs) {
            ObjectIdentifierValue childIdentifier = repository.getSymbol(instanceOID);
            String key = reform(childIdentifier.getName(), prefix);
            Object value = result.remove(instanceOID);
            if (childIdentifier.getSymbol().isTableColumn()) {
                String tableKey = reform(childIdentifier.getParent().getParent().getName(), prefix);
                //noinspection unchecked
                List<Map<String, Object>> table = (List<Map<String, Object>>) result.get(tableKey);
                if (table == null) {
                    table = new ArrayList<Map<String, Object>>();
                    result.put(tableKey, table);
                }
                String instance = instanceOID.substring(childIdentifier.toString().length() + 1);
                Map<String, Object> row = findInstance(table, instance);
                if (row == null) {
                    row = new HashMap<String, Object>();
                    row.put("Instance", instance);
                    table.add(row);
                }
                row.put(key, value);
            } else {
                result.put(key, value);
            }
        }
        return result;
    }

    @Override
    public List<GeneralMap<String, Object>> table(String oid, String prefix) throws SnmpException {
        return table(target.getTimeout(), oid, prefix);
    }

    @Override
    public List<GeneralMap<String, Object>> table(long timeout, String oid, String prefix) throws SnmpException {
        return table(timeout, oid, prefix, null, null);
        // TODO 不知道怎么回事，分页获取 Route表就完全驴头不对马嘴
/*
        long left = timeout;
        List<GeneralMap<String, Object>> records = new ArrayList<GeneralMap<String, Object>>();
        int offset = 0;
        while (true) {
            OID lower = new OID(String.valueOf(offset));
            OID upper = new OID(String.valueOf(offset + options.getInteger(PAGE_SIZE)));
            long start = System.currentTimeMillis();
            List<GeneralMap<String, Object>> page = table(timeout, oid, prefix, lower, upper);
            long cost = System.currentTimeMillis() - start;
            records.addAll(page);
            offset += page.size();
            left -= cost;
            if (page.isEmpty()) break;
            if( left < 0 )
                throw new SnmpException(ErrorCodes.PROBE_TIMEOUT,
                                        "It took too much time " + TimeInterval.parse(timeout - left) +
                                        " to retrieve table " + oid + ", current get " + records.size() + " records");
        }
        return records;
*/
    }

    @Override
    public List<GeneralMap<String, Object>> table(long timeout, String oid, String prefix, OID lowerInstance, OID upperInstance)
            throws SnmpException {
        ObjectIdentifierValue symbol = repository.getSymbol(oid);
        if (symbol == null) {
            throw new IllegalStateException("There is no MIB definition of " + oid
                                            + ", we can't retrieve table by parent OID");
        }
        if (symbol.getSymbol().isTable()) {
            //use table row
            return table(timeout, oid + ".1", prefix, lowerInstance, upperInstance);
        } else if (symbol.getSymbol().isTableRow()) {
            MibValueSymbol[] children = symbol.getSymbol().getChildren();
            OID[] oids = new OID[children.length];
            for (int i = 0; i < children.length; i++) {
                MibValueSymbol child = children[i];
                oids[i] = new OID(child.getValue().toString());
            }
            TableUtils tableUtils = new TableUtils(snmp, new DefaultPDUFactory());

            int maxRows = options.getInteger(MAX_ROWS_PER_PDU);
            int maxCols = options.getInteger(MAX_COLS_PER_PDU);
            tableUtils.setMaxNumRowsPerPDU(maxRows);
            tableUtils.setMaxNumColumnsPerPDU(maxCols);

            List<TableEvent> table = tableUtils.getTable(target, oids, lowerInstance, upperInstance);
            return tableMap(table, prefix);
        } else {
            throw new IllegalArgumentException("The table oid " + oid + " is not a table or table row!");
        }
    }

    private Map<String, Object> findInstance(List<Map<String, Object>> table, String instance) {
        for (Map<String, Object> map : table) {
            if (instance.equals(map.get("Instance"))) return map;
        }
        return null;
    }

    private String reform(String name, String prefix) {
        if (prefix == null) return name;
        return name.substring(prefix.length());
    }

    protected String toKey(String oid, String prefix) {
        ObjectIdentifierValue symbol = repository.getSymbol(oid);
        if (symbol == null) {
            //向上找一位，以免传入的是实例的OID
            symbol = repository.getSymbol(oid.substring(0, oid.length() - 2));
        }
        if (symbol == null)
            return oid;
        else {
            //从编译的MIB库中获取相应的字段名称
            if (prefix != null && symbol.getName().startsWith(prefix)) {
                return symbol.getName().substring(prefix.length());
            }
            return symbol.getName();
        }
    }

    protected List<GeneralMap<String, Object>> tableMap(List<TableEvent> tableEvents, String prefix) throws SnmpException {
        List<GeneralMap<String, Object>> table = new ArrayList<GeneralMap<String, Object>>(tableEvents.size());
        for (TableEvent event : tableEvents) {
            if( event == null ) continue;
            checkEvent(event);
            GeneralMap<String, Object> row = toRow(event, prefix);
            table.add(row);
        }
        return table;
    }

    protected GeneralMap<String, Object> toRow(TableEvent event, String prefix) throws SnmpException {
        GeneralMap<String, Object> row = new DefaultGeneralMap<String, Object>();
        row.put("Instance", event.getIndex().toString());
        VariableBinding[] columns = event.getColumns();
        for (VariableBinding column : columns) {
            if(column == null)continue;
            String oid = column.getOid().toString();
            String key = toKey(oid, prefix);
            Object value = toObject(oid, column.getVariable());
            row.put(key, value);
        }
        return row;
    }
}
