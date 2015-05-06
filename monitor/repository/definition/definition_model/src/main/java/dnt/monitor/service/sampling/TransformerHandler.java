package dnt.monitor.service.sampling;

import dnt.monitor.meta.sampling.MetaTransformer;
import dnt.monitor.meta.sampling.PacksData;
import dnt.monitor.exception.SampleException;
import net.happyonroad.model.GeneralMap;
import java.util.List;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
public interface TransformerHandler {
    GeneralMap<String, Object> transformToMap(String resourceType,MetaTransformer metaTransformer, PacksData packsData) throws
                                                                                                    SampleException;

    List<GeneralMap<String, Object>> transformToTable(String resourceType,MetaTransformer metaTransformer, PacksData packsData)
            throws SampleException;
}
