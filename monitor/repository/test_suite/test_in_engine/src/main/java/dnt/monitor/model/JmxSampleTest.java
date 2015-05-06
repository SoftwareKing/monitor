package dnt.monitor.model;

import dnt.monitor.engine.jmx.JmxVisitor;
import dnt.monitor.engine.jmx.JmxVisitorFactory;
import dnt.monitor.engine.service.SampleService;
import dnt.monitor.exception.MetaException;
import dnt.monitor.service.MetaService;
import net.happyonroad.credential.CredentialProperties;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * <h1>JMX Sample Test</h1>
 *
 * @author Jay Xiong
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = JmxSampleConfig.class)
public abstract class JmxSampleTest {
    @Autowired
    @Qualifier("jmxSampleManager")
    SampleService sampleService;
    @Autowired
    protected MetaService metaService;
    @Autowired
    JmxVisitorFactory jmxVisitorFactory;

    protected JmxVisitor jmxVisitor;

    @Before
    public void setUp() throws Exception {
        resolveMetaModels();

        ResourceNode node = new ResourceNode();
        node.setResource(createTargetApplication());
        CredentialProperties credential = new CredentialProperties();
        jmxVisitor = jmxVisitorFactory.visitor(node, credential);
    }

    protected abstract Resource createTargetApplication();

    protected void resolveMetaModels() throws MetaException {
        metaService.resolve(ManagedObject.class);
        metaService.resolve(Resource.class);
        metaService.resolve(Component.class);
        metaService.resolve(Link.class);
        metaService.resolve(Device.class);
    }

    @After
    public void tearDown() throws Exception {
        jmxVisitorFactory.returnBack(jmxVisitor);
    }
}
