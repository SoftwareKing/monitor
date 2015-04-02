package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.exception.SnmpException;
import dnt.monitor.engine.snmp.MibAwareSnmpVisitor;
import dnt.monitor.engine.snmp.MibRepository;
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
    static final int PAGE_SIZE = 100;
    private final MibRepository repository;
    private final Map<String, Object> options;

    public FullSnmpVisitor(Target target, Snmp snmp, MibRepository repository) {
        super(target, snmp);
        this.repository = repository;
        this.options = new HashMap<String, Object>();
    }

    @Override
    public void setOption(String key, Object value) {
        options.put(key, value);
    }

    @Override
    public GeneralMap<String, Object> walk(String oid, String prefix) throws SnmpException {
        GeneralMap<String, Object> result = super.walk(oid);
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

    @Override
    public List<GeneralMap<String, Object>> table(String oid, String prefix) throws SnmpException {
        return table(oid, prefix, null, null);
        /*
        List<GeneralMap<String, Object>> records = new ArrayList<GeneralMap<String, Object>>();
        int offset = 0;
        while (true) {
            OID lower = new OID(String.valueOf(offset));
            OID upper = new OID(String.valueOf(offset + PAGE_SIZE));
            List<GeneralMap<String, Object>> page = table(oid, prefix, lower, upper);
            records.addAll(page);
            offset += page.size();
            if (page.isEmpty()) break;
        }
        return records;
*/
    }

    @Override
    public List<GeneralMap<String, Object>> table(String oid, String prefix, OID lowerInstance, OID upperInstance)
            throws SnmpException {
        ObjectIdentifierValue symbol = repository.getSymbol(oid);
        if (symbol == null) {
            throw new IllegalStateException("There is no MIB definition of " + oid
                                            + ", we can't retrieve table by parent OID");
        }
        if (symbol.getSymbol().isTable()) {
            //use table row
            return table(oid + ".1", prefix, lowerInstance, upperInstance);
        } else if (symbol.getSymbol().isTableRow()) {
            MibValueSymbol[] children = symbol.getSymbol().getChildren();
            OID[] oids = new OID[children.length];
            for (int i = 0; i < children.length; i++) {
                MibValueSymbol child = children[i];
                oids[i] = new OID(child.getValue().toString());
            }
            TableUtils tableUtils = new TableUtils(snmp, new DefaultPDUFactory());

            Object maxRows = options.get(MAX_ROWS_PER_PDU);
            Object maxCols = options.get(MAX_COLS_PER_PDU);

            if( maxRows == null )
                tableUtils.setMaxNumRowsPerPDU(100);
            else
                tableUtils.setMaxNumRowsPerPDU(Integer.valueOf(maxRows.toString()));
            if(maxCols == null)
                tableUtils.setMaxNumColumnsPerPDU(50);
            else
                tableUtils.setMaxNumColumnsPerPDU(Integer.valueOf(maxCols.toString()));

            List<TableEvent> table = tableUtils.getTable(target, oids, lowerInstance, upperInstance);
            return tableMap(table, prefix);
        } else {
            throw new IllegalArgumentException("The table oid " + oid + " is not a table or table row!");
        }
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

    @Override
    public String toString() {
        return "FullSnmpVisitor(" + target + ")";
    }
}
