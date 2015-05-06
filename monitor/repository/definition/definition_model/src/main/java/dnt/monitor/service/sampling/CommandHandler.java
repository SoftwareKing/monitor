package dnt.monitor.service.sampling;

import dnt.monitor.meta.sampling.MetaCommand;
import dnt.monitor.meta.sampling.PacksData;
import dnt.monitor.exception.SampleException;
import dnt.monitor.service.Visitor;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
public interface CommandHandler<V extends Visitor> {
    PacksData execute(V visitor,MetaCommand metaCommand, String... args) throws SampleException;
}
