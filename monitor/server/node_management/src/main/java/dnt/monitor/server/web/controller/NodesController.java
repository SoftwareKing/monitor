/**
 * Developer: Kadvin Date: 14/12/22 上午10:17
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.model.GroupNode;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.server.exception.NodeException;
import dnt.monitor.server.service.EventService;
import dnt.monitor.server.service.NodeService;
import dnt.monitor.server.util.ResourceComparator;
import net.happyonroad.model.Category;
import net.happyonroad.platform.web.annotation.BeforeFilter;
import net.happyonroad.platform.web.exception.WebServerSideException;
import net.happyonroad.type.Severity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.*;

/**
 * <h1>管理节点控制器</h1>
 * <pre>
 * <b>HTTP    URI                                方法      含义  </b>
 *  GET      /api/nodes/{path}                 children  获取某个节点对象下所有的子对象
 *                           ?summary={bool}             summary = true，汇总告警信息
 *                           &merge={bool}               merge   = true，合并父节点属性
 *                           &depth={int}                depth   = 1，返回的子节点的深度
 *                           &expand={bool}              expand  = true，以array形态返回节点数据
 *                           &leaf={bool}                leaf    = true，包括叶子节点，默认为true，为false的时候，将不会返回任何叶子节点
 *  POST     /api/nodes/{path}                 create   在某个节点下创建子节点
 *  DELETE   /api/nodes/{path}                 delete   删除特定节点以及其所有子节点
 * </pre>
 */
@RestController
@RequestMapping("/api/nodes/**")
class NodesController extends GreedyPathController {
    @Autowired
    NodeService  service;
    @Autowired
    EventService eventService;

    protected ManagedNode targetNode;

    /**
     * <h2>显示管理节点子对象</h2>
     * <p>
     * GET /api/nodes/{path}?summary={bool}&merge={bool}&depth={int}&expand={bool}&leaf={bool}
     * </p>
     *
     * @return 需要显示的节点数组，如果depth >1 and expand=true，则所有节点都被展开为单层数组
     * 否则的话，所有孙子以下的节点，都只是子节点的属性
     */
    @RequestMapping
    // 为了jackson能够正常序列化，不丢失类型信息，所以要用array
    // @see http://jackson-users.ning.com/forum/topics/mapper-not-include-type-information-when-serializing-object-why
    public ManagedNode[] children(@RequestParam(value = "summary", defaultValue = "true") boolean summary,
                                      @RequestParam(value = "merge", defaultValue = "true") boolean merge,
                                      @RequestParam(value = "depth", defaultValue = "1") int depth,
                                      @RequestParam(value = "expand", defaultValue = "true") boolean expand,
                                      @RequestParam(value = "leaf", defaultValue = "true") boolean leaf
                                     ) {
        logger.debug("Inspecting tree of: {}", targetNode);
        // 查到某个路径下所有的子节点
        //   depth == 1: 仅仅查找直接子节点
        //   depth == 2: 查找到孙子节点
        //   depth == 3: 查找到重孙子节点， 依次类推
        // 查找到的所有节点均依次排开，并未按照父子关系组织起来
        List<ManagedNode> children = service.findSubNodes(targetNode, depth, leaf);

        if (merge) {
            //按照层次关系排序，层次在先的排在前头
            Collections.sort(children, new ResourceComparator());
            //依次为每个节点合并属性信息
            for (ManagedNode child : children) {
                // 获取到子节点的上级节点
                ManagedNode parent = getParentFor(child, children);
                service.merge(child, parent);
            }
        }
        if (summary) {
            //依次为每个节点归并事件信息 TODO 这样的API调用效率会不会太低?
            for (ManagedNode child : children) {
                Map<Severity, Integer> eventSummary = eventService.summary(child.getPath());
                child.setSummary(eventSummary);
            }
        }
        setupHierarchy(children);
        List<ManagedNode> result;
        if (expand) {
            result = children;
        } else {
            result = ((GroupNode)targetNode).getChildren();
        }
        return result.toArray(new ManagedNode[result.size()]);
    }

    /**
     * <h2>在管理节点下创建子节点</h2>
     * <p>
     * POST /api/nodes/{path}
     * </p>
     * path为父节点的path
     *
     * @return 创建的管理节点
     */
    @RequestMapping(method = RequestMethod.POST)
    public ManagedNode create(@RequestBody @Valid ManagedNode inputNode) {
        logger.info("Creating {}/{}", targetPath, inputNode.getLabel());
        ManagedNode newNode;
        try {
            newNode = service.create(targetNode, inputNode);
            logger.info("Created  {}/{}", targetPath, newNode.getLabel());
        } catch (NodeException e) {
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR,
                                             "Failed to create managed node under " + targetPath);
        }
        return newNode;
    }

    /**
     * <h2>删除管理节点以及其所有子节点</h2>
     * <p>
     * DELETE /api/nodes/{path}
     * </p>
     * 这一定是force模式
     */
    @RequestMapping(method = RequestMethod.DELETE)
    public void delete() {
        logger.warn("Deleting hierarchy of {}", targetNode);
        try {
            if( targetNode instanceof ResourceNode)
                service.delete(targetNode, true);
            else
                service.deleteHierarchy(targetNode);
        } catch (NodeException e) {
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR,
                                             "Failed to delete managed node tree under " + targetPath);
        }
        logger.warn("Deleted  hierarchy of {}", targetNode);
    }

    @BeforeFilter(order = 60)//after path initialization
    public void initTargetNode() {
        targetNode = service.findByPath(targetPath);
    }

    @BeforeFilter(order = 70, method = {RequestMethod.GET, RequestMethod.POST})//after path initialization
    public void checkTargetNode(HttpServletRequest request) {
        if( targetNode instanceof ResourceNode )
            throw new IllegalArgumentException("You can't " + request.getMethod() +
                                               " /api/nodes on leaf node: " + targetPath);
    }

    private void setupHierarchy(List<ManagedNode> children) {
        for (ManagedNode node : children) {
            GroupNode parent = getParentFor(node, children);
            parent.addChild(node);
        }
    }

    private GroupNode getParentFor(ManagedNode child, List<ManagedNode> nodes) {
        String parentPath = Category.parentOf(child.getPath());
        for (ManagedNode node : nodes) {
            if (node.getPath().equals(parentPath))
                return (GroupNode) node;
        }
        //找不到，也就是当前节点的子节点
        return (GroupNode) targetNode;
    }

}
