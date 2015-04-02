/**
 * Developer: Kadvin Date: 14/12/23 下午1:37
 */
package dnt.monitor.server.support;

import dnt.monitor.model.GroupNode;
import dnt.monitor.model.Link;
import dnt.monitor.server.exception.TopoException;
import dnt.monitor.server.model.TopoLink;
import dnt.monitor.server.model.TopoMap;
import dnt.monitor.server.model.TopoNode;
import dnt.monitor.server.repository.TopoRepository;
import dnt.monitor.server.service.TopoService;
import net.happyonroad.event.*;
import net.happyonroad.model.Category;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.util.DiffUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * Topo Manager
 */
@Service
class TopoManager extends ApplicationSupportBean implements TopoService {
    @Autowired
    TopoRepository repository;

    @Override
    public TopoMap findMapByPath(String path) {
        logger.debug("Finding TopoMap by path = {}", path);
        TopoMap map = repository.findMapByPath(path);
        if (map == null)
            throw new IllegalArgumentException("Can't find topo map with path = " + path);
        assemble(map);
        logger.debug("Found   TopoMap {}", map);
        return map;
    }

    @Override
    public TopoNode findNodeByPath(String path) {
        logger.debug("Finding TopoNode by path = {}", path);
        TopoNode node = repository.findNodeByPath(path);
        logger.debug("Found   TopoNode {}", node);
        return node;
    }

    @Override
    public TopoNode findNodeById(Long nodeId) {
        logger.debug("Finding TopoNode by id = {}", nodeId);
        TopoNode node = repository.findNodeById(nodeId);
        if( node == null )
            throw new IllegalArgumentException("Can't find topo node with id = " + nodeId);
        logger.debug("Found   TopoNode {}", node);
        return node;
    }

    @Override
    public TopoNode findNodeByResourceId(long resourceId) {
        logger.debug("Finding TopoNode by resource id = {}", resourceId);
        TopoNode node = repository.findNodeByResourceId(resourceId);
        logger.debug("Found   TopoNode {}", node);
        return node;
    }

    @Override
    public TopoLink findLinkById(Long linkId) {
        logger.debug("Finding TopoLink by id = {}", linkId);
        TopoLink link = repository.findLinkById(linkId);
        if( link == null )
            throw new IllegalArgumentException("Can't find topo link with id = " + linkId);
        logger.debug("Found   TopoLink {}", link);
        return link;
    }

    @Override
    public void createMap(TopoMap map) throws TopoException {
        logger.info("Creating {}", map);
        publishEvent(new ObjectCreatingEvent<TopoMap>(map));
        try {
            repository.createMap(map);
            logger.info("Created  {}", map);
        } catch (Exception e) {
            publishEvent(new ObjectCreateFailureEvent<TopoMap>(map, e));
            throw new TopoException("Can't create topo map for path = " +  map.getPath() , e);
        }
        publishEvent(new ObjectCreatedEvent<TopoMap>(map));
    }

    @Override
    public void createNode(TopoMap map, TopoNode node) throws TopoException {
        logger.info("Creating {} in {}", node, map);
        publishEvent(new ObjectCreatingEvent<TopoNode>(node));
        try {
            node.setMap(map);
            repository.createNode(node);
            if(node.getNode() instanceof GroupNode){
                repository.increaseMapSize(map.getId(), 1);
            }else {
                repository.increaseNodeSize(map.getId(), 1);
            }
            logger.info("Created  {} in {}", node, map);
        } catch (Exception e) {
            publishEvent(new ObjectCreateFailureEvent<TopoNode>(node, e));
            throw new TopoException("Can't create topo node for path = " +  node.getPath() , e);
        }
        publishEvent(new ObjectCreatedEvent<TopoNode>(node));
    }

    @Override
    public TopoLink createLink(TopoNode fromTopoNode, TopoNode toTopoNode, Link link) throws TopoException {
        TopoLink topoLink = new TopoLink();
        topoLink.setFromNode(fromTopoNode);
        topoLink.setToNode(toTopoNode);
        topoLink.setLink(link);
        topoLink.setMap(fromTopoNode.getMap());
        topoLink.setType(link.getType());
        topoLink.setLabel(link.getLabel());
        return createLink(topoLink);
    }

    @Override
    public TopoLink createLink(TopoNode fromNode, TopoNode toNode, String type, String label) throws TopoException {
        TopoLink topoLink = new TopoLink();
        topoLink.setFromNode(fromNode);
        topoLink.setToNode(toNode);
        topoLink.setMap(fromNode.getMap());
        topoLink.setType(type);
        topoLink.setLabel(label);
        return createLink(topoLink);
    }

    public TopoLink createLink(TopoLink topoLink) throws TopoException {
        if( topoLink.getLabel() == null )
            topoLink.setLabel(topoLink.getType());
        logger.info("Creating {}", topoLink);
        publishEvent(new ObjectCreatingEvent<TopoLink>(topoLink));
        try {
            repository.createLink(topoLink);
            logger.info("Created  {}", topoLink);
        } catch (Exception e) {
            publishEvent(new ObjectCreateFailureEvent<TopoLink>(topoLink, e));
            throw new TopoException("Can't create topo link from "
                    +  topoLink.getFromNode().getPath() + " to " + topoLink.getToNode().getPath() , e);
        }
        publishEvent(new ObjectCreatedEvent<TopoLink>(topoLink));
        return topoLink;
    }

    @Override
    public TopoMap updateMap(TopoMap map, TopoMap updating) throws TopoException {
        logger.info("Updating {} -> {}", map, updating);
        publishEvent(new ObjectUpdatingEvent<TopoMap>(map, updating));
        try {
            map.apply(updating);
            map.updating();
            repository.updateMap(map);
            logger.info("Updated  {} by {}", map, DiffUtils.describeDiff(map, updating));
        } catch (Exception e) {
            logger.error("Failed to update " + map + " -> " + updating, e);
            publishEvent(new ObjectUpdateFailureEvent<TopoMap>(map, updating, e));
            throw new TopoException("Can't update topo map", e);
        }
        publishEvent(new ObjectUpdatedEvent<TopoMap>(updating, map));
        return map;
    }

    @Override
    public TopoNode updateNode(TopoNode node, TopoNode updating) throws TopoException {
        logger.info("Updating {} -> {}", node, updating);
        publishEvent(new ObjectUpdatingEvent<TopoNode>(node, updating));
        try {
            node.apply(updating);
            node.updating();
            repository.updateNode(node);
            logger.info("Updated  {} by {}", node, DiffUtils.describeDiff(node, updating));
        } catch (Exception e) {
            logger.error("Failed to update " + node + " -> " + updating, e);
            publishEvent(new ObjectUpdateFailureEvent<TopoNode>(node, updating, e));
            throw new TopoException("Can't update topo node", e);
        }
        publishEvent(new ObjectUpdatedEvent<TopoNode>(updating, node));
        return node;
    }

    @Override
    public TopoLink updateLink(TopoLink exist, TopoLink link) throws TopoException {
        logger.info("Updating {} -> {}", exist, link);
        publishEvent(new ObjectUpdatingEvent<TopoLink>(exist, link));
        try {
            exist.apply(link);
            exist.updating();
            repository.updateLink(exist);
            logger.info("Updated  {} by {}", exist, DiffUtils.describeDiff(exist, link));
        } catch (Exception e) {
            logger.error("Failed to update " + exist + " -> " + link, e);
            publishEvent(new ObjectUpdateFailureEvent<TopoLink>(exist, link, e));
            throw new TopoException("Can't update topo link", e);
        }
        publishEvent(new ObjectUpdatedEvent<TopoLink>(link, exist));
        return exist;
    }

    @Override
    public void updatePath(String oldPath, String newPath) {
        logger.warn("Updating Topo Map/Node path from {} to {}", oldPath, newPath);
        repository.updateMapsPath(oldPath, newPath);
        repository.updateNodesPath(oldPath, newPath);
        String oldParentPath = Category.parentOf(oldPath);
        String newParentPath = Category.parentOf(newPath);
        if(!StringUtils.equals(oldParentPath, newParentPath)){
            repository.updateNodesParent(newParentPath);
            repository.updateMapsChildrenSize(oldParentPath);
            repository.updateMapsChildrenSize(newParentPath);
        }
        logger.warn("Updated  Topo Map/Node path from {} to {}", oldPath, newPath);
    }

    @Override
    public void deleteMap(String path) throws TopoException {
        TopoMap map = findMapByPath(path);
        if( map == null ){
            logger.debug("The TopoMap with path {} has been deleted");
            return;
        }
        logger.warn("Deleting {}", map);
        publishEvent(new ObjectDestroyingEvent<TopoMap>(map));
        try {
            repository.deleteMap(path);
            logger.warn("Deleted  {}", map);
        } catch (Exception e) {
            publishEvent(new ObjectDestroyFailureEvent<TopoMap>(map, e));
            throw new TopoException("Can't delete topo map for path = " +  map.getPath() , e);
        }
        publishEvent(new ObjectDestroyedEvent<TopoMap>(map));
    }

    @Override
    public void deleteNode(String path) throws TopoException {
        TopoNode node = findNodeByPath(path);
        if( node == null ){
            logger.debug("The TopoNode with path {} has been deleted");//可能原本就是link的某个端点的node被删除发起的
            return;
        }
        logger.warn("Deleting {}", node);
        publishEvent(new ObjectDestroyingEvent<TopoNode>(node));
        try {
            repository.deleteNode(path);
            if(node.getNode() instanceof GroupNode){
                repository.increaseMapSize(node.getMapId(), -1);
            }else {
                repository.increaseNodeSize(node.getMapId(), -1);
            }
            logger.warn("Deleted  {}", node);
        } catch (Exception e) {
            publishEvent(new ObjectDestroyFailureEvent<TopoNode>(node, e));
            throw new TopoException("Can't delete topo node for path = " +  node.getPath() , e);
        }
        publishEvent(new ObjectDestroyedEvent<TopoNode>(node));
    }

    @Override
    public void deleteLink(Link link) throws TopoException {
        TopoLink topoLink = repository.findLinkByUnderlyingId(link.getId());
        if( topoLink == null ){
            logger.debug("The topo link for {} is destroyed already", link);
            return;
        }
        logger.warn("Deleting {}", topoLink);
        publishEvent(new ObjectDestroyingEvent<TopoLink>(topoLink));
        try {
            repository.deleteLink(link.getId());
            logger.warn("Deleted  {}", topoLink);
        } catch (Exception e) {
            publishEvent(new ObjectDestroyFailureEvent<TopoLink>(topoLink, e));
            throw new TopoException("Can't delete topo link  " +  topoLink , e);
        }
        publishEvent(new ObjectDestroyedEvent<TopoLink>(topoLink));
    }

    // 暂时不能很好的掌控 Mybatis 的 Repository，让其为我们构建好对象之间的关系
    // 所以就在Service层自行组装Map里面的Node/Link之间的关系
    protected void assemble(TopoMap map) {
        Set<TopoNode> nodes = map.getNodes();
        if (nodes != null) for (TopoNode node : nodes) {
            node.setMap(map);
        }
        Set<TopoLink> links = map.getLinks();
        if (links != null) for (TopoLink link : links) {
            link.setMap(map);
            TopoNode fromNode = nodeOf(nodes, link.getFromId());
            link.setFromNode(fromNode);
            TopoNode toNode = nodeOf(nodes, link.getToId());
            link.setToNode(toNode);
        }
    }

    protected TopoNode nodeOf(Set<TopoNode> nodes,  Long nodeId){
        for (TopoNode node : nodes) {
            if(node.getId().equals(nodeId)) return node;
        }
        TopoNode node =  findNodeById(nodeId);
        if (node != null ) return node;
        throw new IllegalArgumentException("Can't find topo node with id = " + nodeId);
    }
}
