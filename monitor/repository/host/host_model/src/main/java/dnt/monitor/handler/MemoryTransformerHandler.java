package dnt.monitor.handler;

import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.sampling.MetaTransformer;
import dnt.monitor.meta.sampling.PacksData;
import dnt.monitor.support.sampling.DefaultTransformerHandler;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.support.DefaultGeneralMap;
import java.util.List;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
public class MemoryTransformerHandler extends DefaultTransformerHandler {

    @Override
    public GeneralMap<String, Object> transformToMap(String resourceType, MetaTransformer metaTransformer,
                                                     PacksData packsData) throws SampleException {
        List<GeneralMap<String, Object>> tableValue = packsData.getTable();
        if (match(resourceType, "windows")) {
            return windows(tableValue);
        }
        if (match(resourceType, "linux")) {
            return linux(tableValue);
        }
        if (match(resourceType, "osx")) {
            return osx(tableValue);
        }
        if (match(resourceType, "aix")) {
            return aix(tableValue);
        }
        return linux(tableValue);
    }

    @Override
    public List<GeneralMap<String, Object>> transformToTable(String resourceType, MetaTransformer metaTransformer,
                                                             PacksData packsData) throws SampleException {
        throw new SampleException("not support transform to table");
    }

    private static final String STORAGE_TYPE_OTHER          = "1.3.6.1.2.1.25.2.1.1";
    private static final String STORAGE_TYPE_RAM            = "1.3.6.1.2.1.25.2.1.2";
    private static final String STORAGE_TYPE_VIRTUAL_MEMORY = "1.3.6.1.2.1.25.2.1.3";

    private GeneralMap<String, Object> windows(List<GeneralMap<String, Object>> tableValue) {
        GeneralMap<String, Object> after = new DefaultGeneralMap<String, Object>();
        for (GeneralMap<String, Object> before : tableValue) {
            String storageType = before.getString("StorageType");
            if (match(storageType, STORAGE_TYPE_VIRTUAL_MEMORY)) {
                fillVirtual(before, after);
            } else if (match(storageType, STORAGE_TYPE_RAM)) {
                fillPhysical(before, after);
            }
        }
        return after;
    }

    private GeneralMap<String, Object> linux(List<GeneralMap<String, Object>> tableValue) {
        GeneralMap<String, Object> after = new DefaultGeneralMap<String, Object>();
        long pTotal = 0, pUsed = 0, pUnit = 0, buffers = 0, buffersUnit = 0, cached = 0, cachedUnit = 0;
        for (GeneralMap<String, Object> before : tableValue) {
            String storageType = before.getString("StorageType");
            String storageDescr = before.getString("StorageDescr");
            if (match(storageType, STORAGE_TYPE_VIRTUAL_MEMORY) && match(storageDescr, "Swap")) {
                fillVirtual(before, after);
            } else if (match(storageType, STORAGE_TYPE_RAM) && match(storageDescr, "Physical")) {
                pTotal = before.getLong("StorageSize");
                pUsed = before.getLong("StorageUsed");
                pUnit = before.getLong("StorageAllocationUnits");
            } else if (match(storageType, STORAGE_TYPE_OTHER) && match(storageDescr, "buffers")) {
                buffers = before.getLong("StorageUsed");
                buffersUnit = before.getLong("StorageAllocationUnits");
            } else if (match(storageType, STORAGE_TYPE_OTHER) && match(storageDescr, "Cached")) {
                cached = before.getLong("StorageUsed");
                cachedUnit = before.getLong("StorageAllocationUnits");
            }
        }
        fillPhysical(after, (int) (pTotal * pUnit / 1024 / 1024),
                     (int) ((pUsed * pUnit - buffers * buffersUnit - cached * cachedUnit) / 1024 / 1024));
        return after;
    }

    private GeneralMap<String, Object> osx(List<GeneralMap<String, Object>> tableValue) {
        GeneralMap<String, Object> after = new DefaultGeneralMap<String, Object>();
        for (GeneralMap<String, Object> before : tableValue) {
            String storageType = before.getString("StorageType");
            String storageDescr = before.getString("StorageDescr");
            if (match(storageType, STORAGE_TYPE_RAM) && match(storageDescr, "Physical")) {
                fillPhysical(before, after);
            }
        }
        fillVirtual(after, 0, 0);
        return after;
    }

    private GeneralMap<String, Object> aix(List<GeneralMap<String, Object>> tableValue) {
        return windows(tableValue);
    }

    private void fillPhysical(GeneralMap<String, Object> before, GeneralMap<String, Object> after) {
        long total = before.getLong("StorageSize");
        long used = before.getLong("StorageUsed");
        long unitSize = before.getLong("StorageAllocationUnits");
        fillPhysical(after, (int) (total * unitSize / 1024 / 1024), (int) (used * unitSize / 1024 / 1024));
    }

    private void fillPhysical(GeneralMap<String, Object> after, int total, int used) {
        after.put("total", total);  //单位MB
        after.put("used", used);  //单位MB
        after.put("free", total - used);  //单位MB
        if (total != 0) {
            after.put("usage", used * 10000l / total / 100f);  //单位%
        } else {
            after.put("usage", 0f);  //单位%
        }
    }

    private void fillVirtual(GeneralMap<String, Object> before, GeneralMap<String, Object> after) {
        long total = before.getLong("StorageSize");
        long used = before.getLong("StorageUsed");
        long unitSize = before.getLong("StorageAllocationUnits");
        fillVirtual(after, (int) (total * unitSize / 1024 / 1024), (int) (used * unitSize / 1024 / 1024));
    }

    private void fillVirtual(GeneralMap<String, Object> after, int total, int used) {
        after.put("virtualTotal", total);  //单位MB
        after.put("virtualUsed", used);  //单位MB
        after.put("virtualFree", total - used);  //单位MB
        if (total != 0) {
            after.put("virtualUsage", used * 10000l / total / 100f);  //单位%
        } else {
            after.put("virtualUsage", 0f);  //单位%
        }
    }

}
