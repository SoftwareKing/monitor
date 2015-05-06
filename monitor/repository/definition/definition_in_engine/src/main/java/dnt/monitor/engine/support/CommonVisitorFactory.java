package dnt.monitor.engine.support;

import dnt.monitor.service.Visitor;
import dnt.monitor.engine.service.VisitorFactory;
import dnt.monitor.model.GroupNode;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.model.Credential;
import net.happyonroad.spring.Bean;

import java.util.HashMap;
import java.util.Map;

/**
 * <h1>Common Visitor Factory</h1>
 *
 * 用于管理无连接的资源, 如SNMP的UDP访问器, WMIC的命令行访问器， HTTP的访问器
 *
 * @author Jay Xiong
 */
public abstract class CommonVisitorFactory <C extends Credential, V extends Visitor>
        extends Bean implements VisitorFactory<C,V> {
    Map<String, V> visitors = new HashMap<String, V>();

    public V visitor(ResourceNode node, C credential) {
        return innerVisitor(node, node.getResource(), credential);
    }

    public V visitor(GroupNode scopeNode, Resource device, C credential) {
        return innerVisitor(scopeNode, device, credential);
    }

    protected V innerVisitor(ManagedNode node, Resource device, C credential) {
        String address = device.getAddress();
        String key = address + "/" + credential.toString();
        V visitor = visitors.get(key);
        if (visitor == null) {
            visitor = createVisitor(node, device, credential);
            visitors.put(key, visitor);
        }else{
            //Keep the visitor's resource latest
            visitor.setResource(device);
        }
        return visitor;
    }

    protected abstract V createVisitor(ManagedNode node, Resource resource, C credential);

    @Override
    public void returnBack(V visitor) {
        // do nothing now
    }
}
