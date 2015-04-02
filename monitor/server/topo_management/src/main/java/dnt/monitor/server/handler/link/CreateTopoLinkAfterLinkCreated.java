/**
 * Developer: Kadvin Date: 15/1/12 下午2:08
 */
package dnt.monitor.server.handler.link;

import dnt.monitor.model.Link;
import dnt.monitor.server.exception.TopoException;
import dnt.monitor.server.model.TopoLink;
import dnt.monitor.server.model.TopoNode;
import dnt.monitor.server.service.TopoService;
import net.happyonroad.event.ObjectCreatedEvent;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * <h1>监听Link对象的事件，并同步成为TopoLink对象</h1>
 * <ul>
 * <li> 新的Link创建后，应该为其创建相应的TopoLink
 * <li> Link删除后，删除其所有相关的 TopoLink
 * </ul>
 * 在Link的资源层与Topo展示层之间，并不存在一个类似于ManagedNode的管理层
 * 所以，直接在Topo层监听Link的事件，与TopoLink(s)同步
 * <pre>
 * 同步的算法如下:
 *    1. 根据 Link 的 from/to属性，找到相应的 TopoNode对象(s)
 *    2. 如果 两个TopoNode隶属于同一个 TopoMap，则为其建立两者之间的关系
 *    3. 如果 两个TopoNode属于不同的TopoMap， 则找到其共同的根，建立在共同根图之中的关系
 * 关系建立的原则如下：
 *    1. 如果两个Topo Node之间不存在TopoLink，则建立一个新的Topo Link
 *    2. 如果两个Topo Node之间已经存在了Topo Link，则在该Topo Link上增加新的关系属性
 * </pre>
 */
@Component
class CreateTopoLinkAfterLinkCreated extends Bean
        implements ApplicationListener<ObjectCreatedEvent<Link>> {
    @Autowired
    TopoService topoService;

    public CreateTopoLinkAfterLinkCreated() {
        setOrder(20);
    }

    @Override
    public void onApplicationEvent(ObjectCreatedEvent<Link> event) {
        // 底层有Link，不代表上层也有Link
        Link link = event.getSource();
        TopoLink topoLink = new TopoLink();
        topoLink.setLink(link);
        TopoNode fromNode = topoService.findNodeByResourceId(link.getFromId());
        if (fromNode == null) {
            throw new ApplicationContextException("Can't find topo node by #from endpoint of link: " + link );
        }
        topoLink.setFromNode(fromNode);
        TopoNode toNode = topoService.findNodeByResourceId(link.getToId());
        if (toNode == null){
            throw new ApplicationContextException("Can't find topo node by #to endpoint of link: " + link );
        }
        topoLink.setToNode(toNode);
        // 只有 Link对应的两个节点的TopoNode存在于同一个map上时，需要创建TopoLink
        // TODO 未来这里的策略可能会变得更强大，譬如虽然Link的两个端点不在同一个map下，但可以为他们向上找到在同一个map下的两个topo node
        // 而后建立这两个Topo Node直接的关系
        if(fromNode.getMapId().equals(toNode.getMapId()))
            autoCreateTopoLink(topoLink);
    }


    /**
     * 当一个 Link创建时，由于其两端资源的 TopoNode 尚未创建完成；
     * 所以先将该Link存储在这里，而后等待两端资源就绪
     *
     * @param topoLink 新增加的管理节点
     */
    private void autoCreateTopoLink(TopoLink topoLink) {
        TopoNode fromNode = topoLink.getFromNode();
        TopoNode toNode = topoLink.getToNode();
        // 不管节点之间关系如何（深度不一，父节点不一致）
        //  但为她们建立TopoLink的算法都是如下:
        String parentPath = latestParentOf(fromNode.getPath(), toNode.getPath());
        String relativeFromPath = directChildPath(parentPath, fromNode.getPath());
        String relativeToPath = directChildPath(parentPath, toNode.getPath());

        String fromPath = parentPath + "/" + relativeFromPath;
        String toPath = parentPath + "/" + relativeToPath;
        if( !fromPath.equals(fromNode.getPath() ))
            fromNode = topoService.findNodeByPath(fromPath);
        if( !toPath.equals(toNode.getPath()))
            toNode = topoService.findNodeByPath(toPath);
        try {
            topoService.createLink(fromNode, toNode, topoLink.getLink());
        } catch (TopoException e) {
            logger.error("Can't create topo link between {} -> {} for {}", fromNode, toNode, topoLink);
        }
    }

    /**
     * <h2>找到两个路径之间最长的共同父路径</h2>
     * <pre>
     * 如:
     * fromPath = /default/192_168_10_0/192_168_10_1
     * toPath   = /default/192_168_20_0/192_168_20_1
     * 则其latest parent = /default
     * </pre>
     *
     * @param fromPath from node 路径
     * @param toPath   to node 路径
     * @return 最长的共同父路径
     */
    private String latestParentOf(String fromPath, String toPath) {
        List<String> sames = new ArrayList<String>();
        String[] froms = fromPath.split("/");
        String[] tos = toPath.split("/");
        for (int i = 0; i < froms.length - 1 && i < tos.length - 1; i++) {
            if (froms[i].equals(tos[i])) sames.add(froms[i]);
            else break;
        }
        return StringUtils.join(sames, "/");
    }

    /**
     * <h2>找到某个path在父path之下的直接子path</h2>
     * 如
     * path       = /default/192_168_10_0/192_168_10_1
     * parentPath = /default
     * 则其 direct child path = 192_168_10_0
     *
     * @param path       某个节点的路径
     * @param parentPath 节点的父路径，一定是从根路径开始
     * @return 父路径下的子路径
     */
    private String directChildPath(String parentPath, String path) {
        if (!parentPath.endsWith("/")) parentPath = parentPath + "/";
        String childPath = StringUtils.substringAfter(path, parentPath);
        if( childPath.contains("/") )
            childPath = StringUtils.substringBefore(childPath, "/");
        return childPath;
    }
}
