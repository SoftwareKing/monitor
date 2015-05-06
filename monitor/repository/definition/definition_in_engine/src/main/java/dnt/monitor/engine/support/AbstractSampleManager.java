package dnt.monitor.engine.support;

import dnt.monitor.engine.service.SampleService;
import dnt.monitor.service.Visitor;
import dnt.monitor.meta.MetaResource;
import net.happyonroad.spring.Bean;

/**
 * <h1>Abstract Sample Manager</h1>
 *
 * @author Jay Xiong
 */
public abstract class AbstractSampleManager extends Bean implements SampleService{
    @Override
    public boolean support(Visitor visitor) {
        return supportedCredentials().contains(visitor.getCredential().name());
    }

    @Override
    public boolean support(MetaResource model) {
        String[] credentials = model.getCategory().getCredentials();
        String supports = supportedCredentials();
        for (String credential : credentials) {
            if (supports.contains(credential)) return true;
        }
        return false;
    }

    /**
     * <h2>支持的认证方式</h2>
     *
     * @return 支持的认证方式，多种方式用逗号隔开
     */
    protected abstract String supportedCredentials();
}
