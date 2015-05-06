package dnt.monitor.model;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertNotNull;

/**
 * <h1>Sample Monitor Server Test</h1>
 *
 * @author Jay Xiong
 */
public class MonitorServerSampleTest extends JmxSampleTest{

    MetaResource<MonitorServer> jvmModel;

    protected void resolveMetaModels() throws MetaException {
        super.resolveMetaModels();
        metaService.resolve(Host.class);
        metaService.resolve(Application.class);
        metaService.resolve(JvmApplication.class);
        metaService.resolve(MonitorApplication.class);
        //noinspection unchecked
        jvmModel = (MetaResource<MonitorServer>) metaService.resolve(MonitorServer.class);
    }

    @Override
    protected Resource createTargetApplication() {
        MonitorServer server = jvmModel.newInstance();
        //test JVM by monitor server, need the monitor server to be started
        server.setAddress("localhost:1097");
        return server;
    }

    @Test
    @Ignore("Need real server started")
    public void testSampleMonitorServer() throws Exception {
        MonitorServer server = (MonitorServer) sampleService.sampleResource(jmxVisitor, jvmModel);
        System.out.println(ParseUtils.toJSONString(server));
        assertNotNull(server);
        assertNotNull(server.getOperationSystem());
        assertNotNull(server.getJvm());
        assertNotNull(server.getMemory());
        assertNotNull(server.getMemoryPools());
        assertNotNull(server.getGarbageCollectors());
        assertNotNull(server.getThreading());
        assertNotNull(server.getClassLoading());
        assertNotNull(server.getCompilation());

        assertNotNull(server.getEventSizes());
        assertNotNull(server.getNodeStats());
        assertNotNull(server.getResourceSizes());
        assertNotNull(server.getServiceStats());
    }
}
