package dnt.monitor.service.sampling;

import dnt.monitor.meta.sampling.MetaRoot;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaField;
import net.happyonroad.model.GeneralMap;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
public interface Loader {
    void load(Class<? extends MetaRoot> rootClass,String resourceType,MetaField field,Object target,GeneralMap<String, Object> data) throws SampleException;
}
