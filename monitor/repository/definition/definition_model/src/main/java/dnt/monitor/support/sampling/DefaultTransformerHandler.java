package dnt.monitor.support.sampling;

import dnt.monitor.meta.sampling.MetaTransformer;
import dnt.monitor.meta.sampling.PacksData;
import dnt.monitor.service.sampling.TransformerHandler;
import dnt.monitor.exception.SampleException;
import net.happyonroad.model.GeneralMap;
import org.apache.commons.lang.StringUtils;

import java.util.List;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
public class DefaultTransformerHandler implements TransformerHandler {

    protected boolean match(String resourceType, String keyword) {
        return StringUtils.containsIgnoreCase(resourceType, keyword);
    }

    @Override
    public GeneralMap<String, Object> transformToMap(String resourceType, MetaTransformer metaTransformer,
                                                     PacksData packsData) throws SampleException {
        return packsData.getMap();
    }

    @Override
    public List<GeneralMap<String, Object>> transformToTable(String resourceType, MetaTransformer metaTransformer,
                                                             PacksData packsData) throws SampleException {
        return packsData.getTable();
    }
}
