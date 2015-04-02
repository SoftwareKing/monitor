/**
 * Developer: Kadvin Date: 15/1/6 下午3:17
 */
package dnt.monitor.server.support;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.server.exception.ResourceNotFoundException;
import dnt.monitor.model.*;
import dnt.monitor.server.repository.EngineRepository;
import dnt.monitor.server.service.EngineService;
import dnt.monitor.server.service.MonitorServerService;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.validation.ValidationException;
import java.util.List;
import java.util.UUID;

/**
 * The monitor engine manager
 */
@Service
class EngineManager extends ResourceManager<MonitorEngine> implements EngineService {
    @Autowired
    MonitorServerService serverService;

    @Autowired
    public EngineManager(@Qualifier("engineRepository") EngineRepository repository) {
        super(repository);
    }

    @Override
    protected EngineRepository getRepository() {
        return (EngineRepository) super.getRepository();
    }

    @Override
    public Class<? extends Resource> getResourceType() {
        return MonitorEngine.class;
    }

    @Override
    public MonitorEngine findByEngineId(String engineId) throws ResourceNotFoundException {
        MonitorEngine engine = getRepository().findByEngineId(engineId);
        if( engine == null ){
            throw new ResourceNotFoundException("Can't find engine with engineId = " + engineId);
        }
        return engine;
    }

    @Override
    protected void validateOnCreate(MonitorEngine engine) throws ValidationException {
        super.validateOnCreate(engine);
        MonitorEngine exist = findByAddress(engine.getAddress());
        if( exist != null ){
            throw new ValidationException("There is an engine with address " + engine.getAddress());
        }
    }

    @Override
    protected void validateOnUpdate(MonitorEngine exist, MonitorEngine resource) throws ValidationException {
        super.validateOnUpdate(exist, resource);
        // IP地址变了
        if(!StringUtils.equals(exist.getAddress(), resource.getAddress())){
            MonitorEngine another = findByAddress(resource.getAddress());
            if( another != null ){
                throw new ValidationException("There is another engine with address " + resource.getAddress());
            }
        }
    }

    /**
     * <h2>实际执行添加引擎的动作</h2>
     * <p/>
     * 有如下添加方式（对应两种情况）：
     * <ol>
     * <li>管理员通过界面主动新建一个监控引擎（而后由脚本主动安装）
     * 用户输入了如下信息
     * <ul>
     * <li>引擎路径（安装目标路径）
     * <li>引擎地址（也是主机地址）
     * <li>主机类型
     * <li>主机登录信息
     * </ul>
     * 程序在本步骤保持新的引擎对象以及其所在主机信息之后，后继应该使用该主机信息，将引擎安装到相应目录去
     * <li>用户在特定机器上安装引擎（而后引擎启动时，通过监控服务器SPI自动注册）
     * <ul>
     * <li>引擎路径（安装目标路径）
     * <li>引擎地址（也是主机地址）
     * <li>进程pids
     * <li>主机类型
     * </ul>
     * </ol>
     * 开发者可以通过监控引擎是否有pids值判断是否是界面输入的监控引擎
     *
     * @param engine 新注册的引擎对象
     * @throws ResourceException
     */
    @Override
    protected void performCreate(MonitorEngine engine) throws ResourceException {
        boolean manual;
        if (engine.getPids() == null || engine.getPids().isEmpty()) {
            //预先手工创建， 已经有name，一般已经被批准
            manual = true;
        } else {
            manual = false;
            engine.setEngineId(UUID.randomUUID().toString());

            //现在仅用地址是否相等判断是否是缺省引擎
            // 缺省引擎将会被自动批准
            if(isDefault(engine)){
                engine.setLabel("缺省引擎");
                engine.setName("default");
                approveIt(engine);
            }else if (isAutoApprove(engine)){
                //这种情况，应该在用户手工创建时，engine system node 和engine scope node都已经创建
                approveIt(engine);
            }else{
                int maxPending = getRepository().countMaxPending();
                maxPending++;
                engine.setLabel("新监控引擎#" + maxPending);
                String name = "pending_" + maxPending;
                engine.setName(name);
                engine.setApproveStatus(ApproveStatus.Requested);
                engine.setApiToken(null);//防止提交进来
            }
        }
        //本函数中没有包括创建该引擎所在主机，这个动作是在引擎创建后，
        // 由 SetupEngineAfterCreation这个handler完成
        logger.debug("An engine from {} created in {} mode", engine.getAddress(), (manual ? "manual" : "auto"));
        super.performCreate(engine);
    }

    @Override
    protected void validateOnDelete(MonitorEngine resource) throws ValidationException {
        // skip links validation
    }

    @SuppressWarnings("unchecked")
    @Override
    protected void performDelete(MonitorEngine resource) throws ResourceException {
        //删除engine -> host, engine -> redis等关系
        List<Link> links = linkService.findLinksOf(resource);
        for (Link link : links) {
            linkService.unlink(link);
        }
        super.performDelete(resource);
    }

    /**
     * 判断某个引擎是否需要自动批准
     * @param engine 被判断的引擎
     * @return 是否需要自动批准
     */
    protected boolean isAutoApprove(MonitorEngine engine) {
        // 增加一个自动批准的机制，便于集成测试
        return engine.getProperty("autoApproveForIntegration", "false").equals("true");
    }

    protected boolean isDefault(MonitorEngine engine) {
        return StringUtils.equals(serverService.getServer().getAddress(), engine.getAddress());
    }

    @Override
    public MonitorEngine approve(MonitorEngine engine, String name, String label) throws ResourceException {
        engine.setName(name);
        engine.setLabel(label);
        approveIt(engine);
        return update(engine);
    }

    @Override
    public MonitorEngine reject(MonitorEngine engine) throws ResourceException {
        engine.setApproveStatus(ApproveStatus.Rejected);
        engine.setApiToken(null);//防止提交进来
        return update(engine);
    }

    void approveIt(MonitorEngine engine) {
        engine.setApproveStatus(ApproveStatus.Approved);
        engine.setApiToken(UUID.randomUUID().toString());
    }

}
