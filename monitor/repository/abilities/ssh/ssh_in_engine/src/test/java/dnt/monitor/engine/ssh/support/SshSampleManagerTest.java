package dnt.monitor.engine.ssh.support;

import dnt.monitor.engine.service.GenericSampleService;
import dnt.monitor.engine.ssh.SshVisitor;
import dnt.monitor.engine.ssh.SshVisitorFactory;
import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Component;
import dnt.monitor.model.Entry;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import dnt.monitor.service.MetaService;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SshSampleManagerTest.TestConfig.class)
@Ignore("After refactor, there are not valid meta resource(linux host)")
public class SshSampleManagerTest {

    @Autowired
    private GenericSampleService sampleService;

    @Autowired
    private MetaService metaService;

    private SshVisitorFactory visitorFactory = new DefaultSshVisitorFactory();

    @Test
    public void testSampleLinux() throws Exception {
        ResourceNode node = buildNode();
        SshVisitor visitor = visitorFactory.visitor(node, node.getCredential(SshCredential.class));
        MetaResource metaModel = buildMetaModel();
        Resource resource;
        try {
            resource = sampleService.sampleResource(visitor, metaModel);
        } finally {
            visitorFactory.returnBack(visitor);
        }
        System.out.println(ParseUtils.toJSONString(resource));
    }

    @Test
    public void testSampleNIC() throws Exception {
        ResourceNode node = buildNode();
        SshVisitor visitor = visitorFactory.visitor(node, node.getCredential(SshCredential.class));
        MetaResource metaResource = buildMetaModel();
        MetaRelation metaRelation = (MetaRelation) metaResource.getMember("interfaces");
        List<Component> componentList;
        try {
            componentList = sampleService.sampleComponents(visitor, metaRelation);
        } finally {
            visitorFactory.returnBack(visitor);
        }
        System.out.println(ParseUtils.toJSONString(componentList));
    }

    @Test
    public void testSampleMemory() throws Exception {
        ResourceNode node = buildNode();
        SshVisitor visitor = visitorFactory.visitor(node, node.getCredential(SshCredential.class));
        MetaResource metaResource = buildMetaModel();
        MetaRelation metaRelation = (MetaRelation) metaResource.getMember("memory");
        Component component;
        try {
            component = sampleService.sampleComponent(visitor, metaRelation);
        } finally {
            visitorFactory.returnBack(visitor);
        }
        System.out.println(ParseUtils.toJSONString(component));
    }

    @Test
    public void testSampleRoute() throws Exception {
        ResourceNode node = buildNode();
        SshVisitor visitor = visitorFactory.visitor(node, node.getCredential(SshCredential.class));
        MetaResource metaResource = buildMetaModel();
        MetaRelation metaRelation = (MetaRelation) metaResource.getMember("routeEntries");
        List<Entry> entryList;
        try {
            entryList = sampleService.sampleEntries(visitor, metaRelation);
        } finally {
            visitorFactory.returnBack(visitor);
        }
        System.out.println(ParseUtils.toJSONString(entryList));
    }

    private ResourceNode buildNode() {
        ResourceNode node = new ResourceNode();
        node.setPath("/device/host/linux");
        SshCredential sshCredential = new SshCredential("root", "xiongjie@dnt");
        sshCredential.setTimeout(1000000);
        node.setCredentials(sshCredential);
        Resource resource = new Resource();
        resource.setAddress("172.16.3.3");
        node.setResource(resource);
        return node;
    }

    private MetaResource buildMetaModel() throws Exception {
        return metaService.getMetaResource("/device/host/linux");
    }

    @Configuration
    @ComponentScan("dnt.monitor.engine.ssh.support")
    @Import(MetaManagerConfig.class)
    static class TestConfig {

    }
}
