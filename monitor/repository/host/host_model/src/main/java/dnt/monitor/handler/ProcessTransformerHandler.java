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
public class ProcessTransformerHandler extends DefaultTransformerHandler {

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
        List<GeneralMap<String, Object>> performanceList = packsData.getTable("performance");

        for (GeneralMap<String, Object> before : mainList) {
            GeneralMap<String, Object> after = new DefaultGeneralMap<String, Object>();
            int pid = before.getInteger("SWRunIndex");
            after.put("pid",pid);
            String runName = before.getString("SWRunName");
            String runPath = before.getString("SWRunPath");
            String runParams = before.getString("SWRunParameters");
            after.put("label",runName);
            after.put("command",runPath+" "+runName+" "+runParams);
            String status = before.getString("SWRunStatus");
            after.put("status",status);
            GeneralMap<String, Object> performance = getPerformance(pid,performanceList);
            if(performance!=null){
                after.put("physicalMemory",performance.getLong("SWRunPerfMem"));
            }
            result.add(after);
        }
        return result;
    }

    private GeneralMap<String, Object> getPerformance(int pid, List<GeneralMap<String, Object>> performanceList) {
        for (GeneralMap<String, Object> performance : performanceList) {
            if (pid == performance.getInteger("Instance")) {
                return performance;
            }
        }
        return null;
    }
}
