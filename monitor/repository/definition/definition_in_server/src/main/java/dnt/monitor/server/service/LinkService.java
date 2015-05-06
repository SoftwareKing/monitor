/**
 * Developer: Kadvin Date: 15/1/6 下午10:10
 */
package dnt.monitor.server.service;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.Link;
import dnt.monitor.model.LinkType;
import dnt.monitor.model.Resource;

import java.util.List;
import java.util.Properties;

/**
 * <h1>链路服务接口</h1>
 */
public interface LinkService<L extends Link> {

    List<L> finkLinksFrom(Resource resource);

    List<L> finkLinksTo(Resource resource);

    List<L> findLinksOf(Resource resource);

    L link(Resource from, Resource to, LinkType type) throws ResourceException;

    L link(Resource from, Resource to, LinkType type, Properties properties) throws ResourceException;

    void unlink(Resource from, Resource to, LinkType type) throws ResourceException;

    void unlink(L link)throws ResourceException;
}
