package dnt.monitor.engine.ssh.support;

import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.*;
import dnt.monitor.service.MetaService;
import dnt.monitor.service.SampleService;
import dnt.monitor.support.MetaManagerConfig;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.util.ParseUtils;
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
public class SshSampleManagerTest {

    @Autowired
    private SampleService sampleService;

    @Autowired
    private MetaService metaService;

    @Test
    public void testSampleLinux() throws Exception {
        ResourceNode node = buildNode();
        MetaResource metaModel = buildMetaModel();
        Resource resource = sampleService.sampleResource(node, metaModel);
        System.out.println(ParseUtils.toJSONString(resource));
    }

    @Test
    public void testSampleNIC() throws Exception {
        ResourceNode node = buildNode();
        MetaResource metaResource = buildMetaModel();
        MetaRelation metaRelation = (MetaRelation) metaResource.getMember("interfaces");
        List<Component> componentList =
                sampleService.sampleComponents(node,metaRelation);
        System.out.println(ParseUtils.toJSONString(componentList));
    }

    @Test
    public void testSampleMemory() throws Exception {
        ResourceNode node = buildNode();
        MetaResource metaResource = buildMetaModel();
        MetaRelation metaRelation = (MetaRelation) metaResource.getMember("memory");
        Component component =
                sampleService.sampleComponent(node, metaRelation);
        System.out.println(ParseUtils.toJSONString(component));
    }

    @Test
    public void testSampleRoute() throws Exception {
        ResourceNode node = buildNode();
        MetaResource metaResource = buildMetaModel();
        MetaRelation metaRelation = (MetaRelation) metaResource.getMember("routeEntries");
        List<Entry> entryList =
                sampleService.sampleEntries(node, metaRelation);
        System.out.println(ParseUtils.toJSONString(entryList));
    }

    private ResourceNode buildNode() {
        ResourceNode node = new ResourceNode();
        node.setPath("/device/host/linux");
        SshCredential sshCredential = new SshCredential("root", "xiongjie@dnt");
        sshCredential.setTimeout(1000000);
        node.setCredentials(sshCredential);
        Device resource = new Device();
        resource.setAddress("172.16.3.3");
        node.setResource(resource);
        return node;
    }

    private MetaResource buildMetaModel() throws Exception {
        return (MetaResource) metaService.resolve(LinuxHost.class);
    }

    @Configuration
    @ComponentScan("dnt.monitor.engine.ssh.support")
    @Import(MetaManagerConfig.class)
    static class TestConfig {

    }
}
