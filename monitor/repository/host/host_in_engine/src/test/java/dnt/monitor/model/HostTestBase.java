package dnt.monitor.model;

import dnt.monitor.exception.MetaException;

/**
 * <h1>主机相关测试的基类</h1>
 *
 * @author Jay Xiong
 */
public abstract class HostTestBase extends DeviceSampleTest {
    @Override
    protected void resolveMetaModels() throws MetaException {
        super.resolveMetaModels();
        metaService.resolve(Host.class);
    }
}
