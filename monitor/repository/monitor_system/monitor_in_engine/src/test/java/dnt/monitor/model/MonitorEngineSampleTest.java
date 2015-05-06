package dnt.monitor.model;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaResource;
import net.happyonroad.util.ParseUtils;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertNotNull;

/**
 * <h1>Sample Monitor Engine Test</h1>
 *
 * @author Jay Xiong
 */
public class MonitorEngineSampleTest extends JmxSampleTest{

    MetaResource<MonitorEngine> jvmModel;

    protected void resolveMetaModels() throws MetaException {
        super.resolveMetaModels();
        metaService.resolve(Host.class);
        metaService.resolve(Application.class);
        metaService.resolve(JvmApplication.class);
        metaService.resolve(MonitorApplication.class);
        //noinspection unchecked
        jvmModel = (MetaResource<MonitorEngine>) metaService.resolve(MonitorEngine.class);
    }

    @Override
    protected Resource createTargetApplication() {
        MonitorEngine engine = jvmModel.newInstance();
        //test JVM by monitor engine, need the monitor engine to be started
        engine.setAddress("localhost:1096");
        return engine;
    }

    @Test
    //@Ignore("Need real engine started")
    public void testSampleMonitorEngine() throws Exception {
        MonitorEngine engine = (MonitorEngine) sampleService.sampleResource(jmxVisitor, jvmModel);
        System.out.println(ParseUtils.toJSONString(engine));
        assertNotNull(engine);
        assertNotNull(engine.getOperationSystem());
        assertNotNull(engine.getJvm());
        assertNotNull(engine.getMemory());
        assertNotNull(engine.getMemoryPools());
        assertNotNull(engine.getGarbageCollectors());
        assertNotNull(engine.getThreading());
        assertNotNull(engine.getClassLoading());
        assertNotNull(engine.getCompilation());

        assertNotNull(engine.getExecutors());
        assertNotNull(engine.getMonitoringStats());
        assertNotNull(engine.getStoreSizes());
    }
}
