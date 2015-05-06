package dnt.monitor.meta.sampling;

import net.happyonroad.model.GeneralMap;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <h1>用于存储所有pack的执行结果，供Transformer使用</h1>
 *
 * @author mnnjie
 */
public class PacksData {
    public void add(GeneralMap<String, Object> mapValue) {
        put("map", mapValue);
    }

    public void add(List<GeneralMap<String, Object>> tableValue) {
        put("table", tableValue);
    }

    public void put(String name, GeneralMap<String, Object> mapValue) {
        mapData.put(name, mapValue);
    }

    public void put(String name, List<GeneralMap<String, Object>> tableValue) {
        tableData.put(name, tableValue);
    }

    public GeneralMap<String, Object> getMap(String name) {
        return mapData.get(name);
    }

    public List<GeneralMap<String, Object>> getTable(String name) {
        return tableData.get(name);
    }

    public GeneralMap<String, Object> getMap() {
        if (mapData.size() == 0) {
            return null;
        }

        if (mapData.containsKey("map")) {
            return getMap("map");
        }
        return mapData.values().iterator().next();
    }

    public List<GeneralMap<String, Object>> getTable() {
        if (tableData.size() == 0) {
            return null;
        }

        if (tableData.containsKey("map")) {
            return getTable("table");
        }
        return tableData.values().iterator().next();
    }

    public void merge(PacksData data){
        if(data!=null) {
            mapData.putAll(data.mapData);
            tableData.putAll(data.tableData);
        }
    }

    private Map<String, GeneralMap<String, Object>>       mapData   = new HashMap<String, GeneralMap<String, Object>>();
    private Map<String, List<GeneralMap<String, Object>>> tableData =
            new HashMap<String, List<GeneralMap<String, Object>>>();

}
