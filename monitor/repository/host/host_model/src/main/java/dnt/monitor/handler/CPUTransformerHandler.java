package dnt.monitor.handler;

import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.sampling.MetaTransformer;
import dnt.monitor.meta.sampling.PacksData;
import dnt.monitor.service.sampling.TransformerHandler;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.support.DefaultGeneralMap;

import java.util.ArrayList;
import java.util.List;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
public class CPUTransformerHandler implements TransformerHandler {

    @Override
    public GeneralMap<String, Object> transformToMap(String resourceType,MetaTransformer metaTransformer, PacksData packsData)
            throws SampleException {
        GeneralMap<String, Object> after = new DefaultGeneralMap<String, Object>();
        after.put("idx", "all");
        float usage = 0;
        for (GeneralMap<String, Object> before : packsData.getTable()) {
            usage += before.getFloat("ProcessorLoad");
        }
        after.put("usage", usage / packsData.getTable().size());
        after.put("idle", 100 - after.getFloat("usage"));
        return after;
    }

    @Override
    public List<GeneralMap<String, Object>> transformToTable(String resourceType,MetaTransformer metaTransformer, PacksData packsData)
            throws SampleException {
        List<GeneralMap<String, Object>> result = new ArrayList<GeneralMap<String, Object>>(packsData.getTable().size());
        for (GeneralMap<String, Object> before : packsData.getTable()) {
            GeneralMap<String, Object> after = new DefaultGeneralMap<String, Object>();
            after.put("idx", before.get("Instance"));
            after.put("usage", before.get("ProcessorLoad"));
            after.put("idle", 100 - before.getFloat("ProcessorLoad"));
            result.add(after);
        }
        return result;

    }
}
