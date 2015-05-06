/**
 * Developer: Kadvin Date: 15/1/6 下午3:17
 */
package dnt.monitor.server.support;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.server.exception.RecordNotFoundException;
import dnt.monitor.model.*;
import dnt.monitor.server.repository.EngineRepository;
import dnt.monitor.server.service.EngineService;
import dnt.monitor.server.service.MonitorServerService;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.model.SocketAddress;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import net.happyonroad.util.IpUtils;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Service;

import javax.validation.ValidationException;
import java.util.List;
import java.util.UUID;

/**
 * The monitor engine manager
 */
@Service
@ManagedResource(objectName = "dnt.monitor.server:type=extension,name=engineService")
class EngineManager extends ResourceManager<MonitorEngine>
        implements EngineService, ApplicationListener<SystemStartedEvent> {
    @Autowired
    MonitorServerService serverService;

    @Autowired
    public EngineManager(@Qualifier("engineRepository") EngineRepository repository) {
        super(repository);
        setOrder(1100);
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
    public void onApplicationEvent(SystemStartedEvent event) {
        MonitorEngine defaultEngine = getRepository().findDefaultEngine();
        if( defaultEngine == null ){
            defaultEngine = initDefaultEngine();
            try {
                create(defaultEngine);
            } catch (ResourceException e) {
                throw new ApplicationContextException("Can't create default monitor engine", e);
            }
        }
    }

    private MonitorEngine initDefaultEngine() {
        MonitorEngine engine = new MonitorEngine();
        engine.setName("default");
        engine.setLabel("缺省引擎");
        engine.setAddress("0.0.0.0:1000");
        return engine;
    }

    @Override
    public MonitorEngine findByEngineId(String engineId) throws RecordNotFoundException {
        MonitorEngine engine = getRepository().findByEngineId(engineId);
        if (engine == null) {
            throw new RecordNotFoundException("Can't find engine with engineId = " + engineId);
        }
        return engine;
    }

    @Override
    public List<MonitorEngine> findAllByStatus(ApproveStatus status) {
        return getRepository().findAllByApproveStatus(status);
    }

    @Override
    public MonitorEngine register(MonitorEngine engine) throws ResourceException {
        //先执行自动批准动作
        performApproval(engine);
        // 如果是从监控服务器下载下来的引擎，关联了相应的engine id，则直接更新
        if (StringUtils.isNotBlank(engine.getEngineId())) {
            MonitorEngine legacy = findByEngineId(engine.getEngineId());
            //id/name/label 保留数据库中的值
            engine.setId(legacy.getId());
            engine.setName(legacy.getName());
            engine.setLabel(legacy.getLabel());
            //properties 合并
            if ( legacy.getProperties() != null ){
                if( engine.getProperties() == null) {
                    engine.setProperties(legacy.getProperties());
                }else{
                    engine.getProperties().putAll(legacy.getProperties());
                }
            }
            return update(legacy, engine);
        } else if (isDefault(engine)){//还有一种常见情况，就是缺省引擎（与监控服务器安装在同一个地址)，而后没有配置engineId
            MonitorEngine defaultEngine = getRepository().findDefaultEngine();
            engine.setEngineId(defaultEngine.getEngineId());
            return update(defaultEngine, engine);
        } else {
            //否则创建一个新的实例
            return create(engine);
        }
    }

    /**
     * <h2>根据默认规则执行对该引擎的批准动作</h2>
     *
     * @param engine 刚刚注册上来的监控引擎
     */
    void performApproval(MonitorEngine engine) {
        if (isDefault(engine)) {
            engine.setLabel("缺省引擎");
            engine.setName("default");
            approveIt(engine);
        } else if (isAutoApprove(engine)) {
            //这种情况，应该在用户手工创建时，engine system node 和engine scope node都已经创建
            approveIt(engine);
        }
    }

    @Override
    protected void validateOnCreate(MonitorEngine engine) throws ValidationException {
        super.validateOnCreate(engine);
        MonitorEngine exist = findByAddress(engine.getAddress());
        if (exist != null) {
            throw new ValidationException("There is an engine with address " + engine.getAddress());
        }
    }

    @Override
    protected void validateOnUpdate(MonitorEngine exist, MonitorEngine resource) throws ValidationException {
        super.validateOnUpdate(exist, resource);
        // IP地址变了
        if (!StringUtils.equals(exist.getAddress(), resource.getAddress())) {
            MonitorEngine another = findByAddress(resource.getAddress());
            if (another != null) {
                throw new ValidationException("There is another engine with address " + resource.getAddress());
            }
        }
    }

    /**
     * <h2>实际执行添加引擎的动作</h2>
     * <p/>
     * 有如下添加方式（对应两种情况）：
     * <ol>
     * <li>管理员通过界面主动新建一个监控引擎（而后由脚本安装）
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
        manual = engine.getPids() == null || engine.getPids().isEmpty();
        //新建的引擎，没有真的引擎实例与之关联，所以，必定 不可用, 待批准
        engine.setEngineId(UUID.randomUUID().toString());
        engine.setAvailability(Availability.Unavailable);
        engine.setConfigStatus(ConfigStatus.Unknown);
        engine.setPerformance(Performance.Unknown);
        engine.setApproveStatus(ApproveStatus.Requested);
        //没有预先创建，自动注册的监控引擎没有name，需要为其生成
        //@see dnt.monitor.engine.support.IdentityManager#createLocalEngine(String)
        if (StringUtils.isBlank(engine.getName())) {
            int maxPending = getRepository().countMaxPending();
            maxPending++;
            engine.setLabel("新监控引擎#" + maxPending);
            String name = "pending_" + maxPending;
            engine.setName(name);
            engine.setApiToken(null);//防止提交进来
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
     *
     * @param engine 被判断的引擎
     * @return 是否需要自动批准
     */
    protected boolean isAutoApprove(MonitorEngine engine) {
        // 增加一个自动批准的机制，便于集成测试
        return engine.getProperty("autoApproveForIntegration", "false").equals("true");
    }

    protected boolean isDefault(MonitorEngine engine) {
        //判断引擎的名称，这个是由管理员自行设置的
        if (engine.isDefault()) return true;
        //在某些本机场景下, server address = localhost, engine address = 192.168.12.63
        SocketAddress serverAddr = IpUtils.parseSocketAddress(serverService.getServer().getAddress());
        SocketAddress engineAddr = IpUtils.parseSocketAddress(engine.getAddress());
        return StringUtils.equals(serverAddr.getHost(), engineAddr.getHost());
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
