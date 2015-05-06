package dnt.monitor.resolver;

import dnt.monitor.annotation.jmx.ObjectAttr;
import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.exception.MetaException;
import dnt.monitor.support.resolver.MetaResolverHelper;

import javax.management.Attribute;
import javax.management.MalformedObjectNameException;

/**
 * <h1>JMX Meta Resolver Helper</h1>
 *
 * @author Jay Xiong
 */
public class JmxMetaResolverHelper extends MetaResolverHelper {

    protected javax.management.ObjectName resolveObjectName(ObjectName anObjectName) throws MetaException {
        //由于JMX有现成的对象，就不需要额外定义Meta对象了
        javax.management.ObjectName objectName;
        try {
            objectName = new javax.management.ObjectName(anObjectName.value());
        } catch (MalformedObjectNameException e) {
            throw new MetaException("Malformed object name " + anObjectName.value(), e);
        }
        return objectName;
    }

    protected Attribute resolveObjectAttr(ObjectAttr anObjectAttr) {
        return new Attribute(anObjectAttr.value(), anObjectAttr.defaultValue());
    }
}
