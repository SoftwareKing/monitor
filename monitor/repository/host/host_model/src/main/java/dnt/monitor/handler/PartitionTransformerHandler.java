package dnt.monitor.handler;

import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.sampling.MetaTransformer;
import dnt.monitor.meta.sampling.PacksData;
import dnt.monitor.support.sampling.DefaultTransformerHandler;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.support.DefaultGeneralMap;

import java.util.ArrayList;
import java.util.List;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
public class PartitionTransformerHandler extends DefaultTransformerHandler {

    @Override
    public GeneralMap<String, Object> transformToMap(String resourceType, MetaTransformer metaTransformer,
                                                     PacksData packsData) throws SampleException {
        throw new SampleException("not support transform to map");
    }

    @Override
    public List<GeneralMap<String, Object>> transformToTable(String resourceType, MetaTransformer metaTransformer,
                                                             PacksData packsData) throws SampleException {
        List<GeneralMap<String, Object>> result = new ArrayList<GeneralMap<String, Object>>();

        List<GeneralMap<String, Object>> mainList = packsData.getTable("main");
        List<GeneralMap<String, Object>> typeList = packsData.getTable("type");

        for (GeneralMap<String, Object> before : mainList) {
            String storageType = before.getString("StorageType");
            if (match(storageType, STORAGE_TYPE_FIXED_DISK)) {
                GeneralMap<String, Object> after = new DefaultGeneralMap<String, Object>();
                long index = before.getLong("StorageIndex");   //用于对应hrFSTable
                long total = before.getLong("StorageSize");
                long used = before.getLong("StorageUsed");
                long unitSize = before.getLong("StorageAllocationUnits");
                String storageDescr = before.getString("StorageDescr");
                after.put("label", storageDescr);
                after.put("total", total * unitSize * 100l / 1024l / 1024l / 1024l / 100f);
                after.put("used", used * unitSize * 100l / 1024l / 1024l / 1024l / 100f);
                after.put("free", after.getFloat("total") - after.getFloat("used"));
                if (total != 0) {
                    after.put("usage", used * 10000l / total / 100f);
                    after.put("capacity", 100 - after.getFloat("usage"));
                } else {
                    after.put("usage", 0f);
                    after.put("capacity", 0f);
                }
                after.put("fsType", getFsType(index, typeList));
                result.add(after);
            }
        }
        return result;
    }

    private String getFsType(long index, List<GeneralMap<String, Object>> typeList) {
        String typeOID = null;
        for (GeneralMap<String, Object> typeMap : typeList) {
            if (index == typeMap.getLong("FSStorageIndex")) {
                typeOID = typeMap.getString("FSType");
                break;
            }
        }
        if (typeOID != null) {
            return getFsType(typeOID);
        }
        return "Unknown";
    }

    private String getFsType(String oid) {
        String typeName = "Unknown:" + oid;
        if (oid.equals("1.3.6.1.2.1.25.3.9.1")) {
            typeName = "Other";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.2")) {
            typeName = "Unknown";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.3")) {
            typeName = "BerkeleyFFS";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.4")) {
            typeName = "Sys5FS";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.5")) {
            typeName = "Fat";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.6")) {
            typeName = "HPFS";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.7")) {
            typeName = "HFS";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.8")) {
            typeName = "MFS";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.9")) {
            typeName = "NTFS";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.10")) {
            typeName = "VNode";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.11")) {
            typeName = "Journaled";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.12")) {
            typeName = "iso9660";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.13")) {
            typeName = "RockRidge";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.14")) {
            typeName = "NFS";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.15")) {
            typeName = "Netware";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.16")) {
            typeName = "AFS";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.17")) {
            typeName = "DFS";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.18")) {
            typeName = "Appleshare";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.19")) {
            typeName = "RFS";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.20")) {
            typeName = "DGCFS";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.21")) {
            typeName = "BFS";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.22")) {
            typeName = "FAT32";
        } else if (oid.equals("1.3.6.1.2.1.25.3.9.23")) {
            typeName = "LinuxExt2";
        }
        return typeName;
    }

    private static final String STORAGE_TYPE_FIXED_DISK = "1.3.6.1.2.1.25.2.1.4";

}
