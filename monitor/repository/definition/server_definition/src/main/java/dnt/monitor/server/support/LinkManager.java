/**
 * Developer: Kadvin Date: 15/1/6 下午10:41
 */
package dnt.monitor.server.support;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.Link;
import dnt.monitor.model.LinkType;
import dnt.monitor.model.Resource;
import dnt.monitor.server.repository.LinkRepository;
import dnt.monitor.server.service.LinkService;
import net.happyonroad.event.*;
import net.happyonroad.spring.ApplicationSupportBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * <h1>The link manager</h1>
 * 它有两个作用：
 * <ol>
 * <li>作为基本的Link管理对象
 * <li>可以被子Link的管理类继承(由于被标记为package visible，所以子类必须在同一个包下)
 * </ol>
 */
@SuppressWarnings("unchecked")
@Service
public class LinkManager<L extends Link> extends ApplicationSupportBean
        implements LinkService<L> {
    LinkRepository<L> repository;

    @Autowired
    public LinkManager(LinkRepository<L> repository) {
        this.repository = repository;
    }

    @Override
    public List<L> finkLinksFrom(Resource resource) {
        return repository.findAllByFrom(resource.getId());
    }

    @Override
    public List<L> finkLinksTo(Resource resource) {
        return repository.findAllByTo(resource.getId());
    }

    @Override
    public List<L> findLinksOf(Resource resource) {
        Set<L> links;
        List<L> list = repository.findAll(resource.getId());
        //剔除可能有的重复
        links = new HashSet<L>(list);
        return new ArrayList<L>(links);
    }

    @Override
    public L link(Resource from, Resource to, LinkType type) throws ResourceException {
        return link(from, to, type, null);
    }

    @Override
    public L link(Resource from, Resource to, LinkType type, Properties properties) throws ResourceException {
        L link = newLink();
        link.setFrom(from);
        link.setTo(to);
        link.setType(type.name());
        link.setLabel(type.name());
        link.setProperties(properties);
        logger.info("Creating {}", link);
        publishEvent(new ObjectCreatingEvent<L>(link));
        try {
            repository.create(link);
            logger.info("Created  {}", link);
        } catch (Exception e) {
            logger.error("Failed to create " + link, e);
            publishEvent(new ObjectCreateFailureEvent<L>(link, e));
            throw new ResourceException("Can't setup " + type + " link from " + from + " to " + to, e);
        }
        publishEvent(new ObjectCreatedEvent<L>(link));
        return link;
    }

    @Override
    public void unlink(Resource from, Resource to, LinkType type) throws ResourceException {
        L link = repository.find(from.getId(), to.getId(), type);
        if (link != null) {
            unlink(link);
        }
    }

    public void unlink(L link) throws ResourceException {
        logger.warn("Deleting {}", link);
        publishEvent(new ObjectDestroyingEvent<L>(link));
        try {
            repository.deleteById(link.getId());
            logger.warn("Deleted  {}", link);
        } catch (Exception e) {
            logger.error("Failed to create " + link, e);
            publishEvent(new ObjectDestroyFailureEvent<L>(link, e));
            throw new ResourceException("Can't unlink " + link, e);
        }
        publishEvent(new ObjectDestroyedEvent<L>(link));
    }

    L newLink() {
        //noinspection unchecked
        return (L) new Link();
    }
}
