/**
 * Developer: Kadvin Date: 15/3/12 下午2:28
 */
package dnt.monitor.server.support;

import dnt.monitor.exception.EngineException;
import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.*;
import dnt.monitor.server.exception.DiscoveryException;
import dnt.monitor.server.service.*;
import dnt.monitor.service.DiscoveryService;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.model.CollectionRange;
import net.happyonroad.model.IpRange;
import net.happyonroad.model.SubnetRange;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.MiscUtils;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.*;

import static dnt.monitor.model.Resource.*;

/**
 * <h1>服务器调度的的网络发现算法</h1>
 */
@SuppressWarnings("unchecked")
@Component
class ServerDiscoveryManager extends Bean implements ServerDiscoveryService, ApplicationListener<SystemStartedEvent> {

    @Autowired
    EngineServiceLocator engineServiceLocator;
    @Autowired
    ServiceLocator       serviceLocator;
    @Autowired
    LinkService<Link>    linkService;

    DeviceService<Device> deviceService;

    public ServerDiscoveryManager() {
        //需要保证在Service Manager on SystemStarted事件之后
        setOrder(Integer.MAX_VALUE);
    }

    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        try {
            //noinspection unchecked
            deviceService = (DeviceService<Device>) serviceLocator.locate(Device.class);
        } catch (ClassCastException e) {
            throw new ApplicationContextException("Located Device Service is not capable", e);
        } catch (ResourceException e) {
            throw new ApplicationContextException("Can't locate /device service ", e);
        }
    }

    /**
     * <h2>让特定引擎启动第一次发现</h2>
     * 发现逻辑：
     * <p/>
     * <ol>
     * <li> 先针对引擎所在的子网进行(C类)发现(仅包括基本服务)
     * <li> 将发现回来的设备归并，入库
     * <li> 根据设备存在的服务情况，要求引擎再进行更细致的发现
     * <li> 而后将细致发现的结果入库
     * <li> 对于交换机类型的设备，其内部子网后继会自动发现，但需要这里调度发现其上联设备(route表中indirect记录的next hop)
     * </ol>
     *
     * @param engine 需要执行自动发现的引擎
     */
    @Override
    public void startFirstDiscovery(MonitorEngine engine) throws DiscoveryException {
        // 第一步: 生成默认的range
        String address = engine.getAddress();
        String netAddress = convertAsNetAddress(address);
        String rangeAddress = netAddress + "/24";
        SubnetRange localRange = new SubnetRange(rangeAddress);
        int depth = Integer.valueOf(engine.getProperty("discovery.depth", "1"));
        discoveryRange(engine, localRange, depth);
    }

    public void discoveryRange(MonitorEngine engine,
                               SubnetRange range,
                               int depth) throws DiscoveryException {
        String netAddress = convertAsNetAddress(range.getAddress());
        String scopePath = engine.getScopePath() + "/" + Device.convertAsPath(netAddress);
        logger.info("Discovery of {} for {}, depth = {} started", engine, netAddress, depth);
        Set<Device> devices = new HashSet<Device>();
        Set<IpRange> ranges = new HashSet<IpRange>();
        discoveryRange(engine, range, scopePath, devices, ranges, depth);
        setupEthernetLinks(devices);
        logger.info("Discovery of {} for {}, depth = {} finished", engine, netAddress, depth);
    }

    /**
     * <h2>对特定范围进行发现</h2>
     *
     * @param engine    发现所使用的监控引擎
     * @param range     被发现的IP范围
     * @param scopePath 发现出来的设备存放的管理路径
     * @param deviceSet 已经发现的设备，此次发现的结果也应该被存放于该集合中
     * @param ranges    已经发现的IP范围，此次发现的目标range稍后也应该存放与该集合中
     * @param depth     发现的深度
     * @return 此次发现的设备，不包括深度/广度递归发现的其他设备
     * @throws DiscoveryException 发现过程中碰到的异常
     */
    public List<Device> discoveryRange(MonitorEngine engine,
                                       IpRange range,
                                       String scopePath,
                                       Set<Device> deviceSet,
                                       Set<IpRange> ranges,
                                       int depth)
            throws DiscoveryException {
        if (depth <= 0) {
            logger.warn("Stop discovery " + range + ", because of depth({}) <= zero", depth);
            return Collections.emptyList();
        }
        if (ranges.contains(range)) {
            logger.debug("Stop discovery " + range + ", because of it's discovered already");
            return Collections.emptyList();
        }
        logger.info("Discovering {} by {}, depth = {}", range, engine, depth);
        //将当前被发现的range放到已经发现的ranges里面，避免递归时重复进行发现
        ranges.add(range);
        String engineHostAddress = engine.getHostAddress();
        // 第1步: 对该动态range进行发现
        DiscoveryService discoveryService = engineServiceLocator.locate(engine, DiscoveryService.class);
        Device[] devices;
        try {
            devices = discoveryService.searchDevices(range);
        } catch (EngineException e) {
            throw new DiscoveryException("Can't search devices by " + engine + " for " + range, e);
        }
        // 第2步: 过滤发现出来的设备(防止与现有设备重复)
        List<Device> deviceList = new ArrayList<Device>(devices.length);
        for (Device device : devices) {
            //如果这个设备已经在设备集合中，则应该被过滤掉
            if (deviceSet.contains(device))
                continue;
            //如果这个设备，已经在数据库中，则不进行后继的发现
            Device exist = deviceService.findWithAddress(device.getAddress());
            if (exist != null) {
                //TODO 对于服务器中已经有的某些设备，如监控服务器默认创建的所在主机，可能是预先构建，并没有被监控，应该如何处理？
                // 可能的方案是:
                // 1. 此地仍然略过
                // 2. assign server to default engine时，也把这个主机assign过去
                // 3. default engine monitor server & server's host
                logger.warn("Skip {} which is duplicate with {}", device, exist);
                continue;
            }
            deviceList.add(device);
            //Device created = createDevice(device);
            //if (created != null) deviceList.add(created);
        }
        Set<String> scopeAddresses = new HashSet<String>();
        Set<String> localAddresses = new HashSet<String>();
        // 第3步: 对发现出来的设备进行更细致的发现(仅对存在snmp/ssh/wmi服务的设备)
        for (Device dev : deviceList) {
            //虽然没有服务，但该设备为引擎所在主机
            if (StringUtils.equals(dev.getAddress(), engineHostAddress)) {
                localAddresses.add(dev.getAddress());
            } else if (dev.getServices() != null && !dev.getServices().isEmpty()) {
                //TODO 如果以后下面发现的服务包括其他服务，那么这里就需要判断是不是包括snmp/ssh/wmi
                scopeAddresses.add(dev.getAddress());
            }
        }
        //让下面的引擎同时对如下路径的资源发起细致的发现，这一步操作在下面是并发的
        try {
            logger.info("{} devices need to be discovered in deep", localAddresses.size() + scopeAddresses.size());
            Device[] locals = discoverDevices(discoveryService, engine.getSystemPath(), localAddresses);
            Device[] details = discoverDevices(discoveryService, scopePath, scopeAddresses);
            Device[] all = new Device[locals.length + details.length];
            System.arraycopy(locals, 0, all, 0, locals.length);
            System.arraycopy(details, 0, all, locals.length, details.length);
            for (Device detail : all) {
                //DEVICE equals/hashCode by address
                int index = indexOf(deviceList, detail);
                if (index >= 0)
                    deviceList.set(index, detail);
                else {
                    logger.warn("Can't find {} in device list", detail);
                }
            }
            logger.info("{} devices discovered actually", details.length);
        } catch (EngineException e) {
            String msg =
                    "Can't discovery components by " + engine + " for " + StringUtils.join(scopeAddresses, ",");
            throw new DiscoveryException(msg, e);
        }
        // 在这一步发现的的详细设备，可能就有重复
        List<Device> reducedDevices = reduceDuplicates(deviceList);
        if (!reducedDevices.isEmpty()) {
            logger.info("Found {} duplicate devices", reducedDevices.size());
        }
        List<String> hostAddresses = new LinkedList<String>();
        // 第4步: 将发现的结果入库
        Iterator<Device> it = deviceList.iterator();
        while (it.hasNext()) {
            Device detail = it.next();
            //与数据库里面已有的设备进行比对，去除数据库中的重复
            List<String> addresses = new ArrayList<String>();
            for (AddressEntry addressEntry : detail.getAddresses()) {
                //略过本地地址
                if (addressEntry.getAddr().startsWith("127.")) continue;
                if (addressEntry.getAddr().startsWith("169.")) continue;
                addresses.add(addressEntry.getAddr());
            }
            if (!addresses.isEmpty()) {
                List<Device> duplicates = deviceService.findAllInAddresses(addresses, detail);
                if (!duplicates.isEmpty()) {
                    it.remove();
                    continue;
                }
            }
            //现在保证发现的设备是新设备，且与数据库现有对象不重复
            Device created = createDevice(engine.getSystemPath(), scopePath, detail, engineHostAddress);
            deviceSet.add(created);
            //交换机被创建之后，会自动构建相应的子网
            if (created instanceof Host) {
                hostAddresses.add(created.getAddress());
            }
        }
        // 第5步: 对可以执行关联发现的设备(主机)进行关联发现
        try {
            Resource[] relatedResources = discoveryService.discoverRelates(hostAddresses);
            for (Resource resource : relatedResources) {
                Resource created = createResource(engine.getSystemPath(),scopePath, resource, engineHostAddress);
                if (created != null) {
                    String hostAddress = created.getProperty(Resource.PROPERTY_HOST_ADDRESS);
                    Device host = findDeviceByAddress(deviceSet, hostAddress);
                    //Link应该由server发现? 还是由引擎发现? 现在为了能够发现全局对象直接的链接，让server发现
                    //但对于有些关系，如 engine -use-> mysql, redis 是根据engine的配置文件决定的
                    //server -use-> mysql, redis, nginx 也是由 server的配置文件决定的
                    //这种关系应该由引擎发现，并告知服务器
                    //但这条通道尚未建立
                    setupLink(created, host, LinkType.RunOn, new Properties());
                }
            }
        } catch (EngineException e) {
            logger.warn("Can't find related resources", MiscUtils.describeException(e));
        }

        // 第6步: 递归处理交换机设备的上联/外联设备
        // TODO 并发之
        Map<String, Set<Device>> switch2devices = new HashMap<String, Set<Device>>();
        for (Device device : deviceList) {
            if (!(device instanceof Switch))
                continue;
            Switch switchDevice = (Switch) device;
            List<String> nextHops = findUpLinkNextHops(switchDevice.getRouteEntries());
            for (String nextHop : nextHops) {
                Set<Device> downLinkDevices = switch2devices.get(nextHop);
                if (downLinkDevices == null) {
                    downLinkDevices = new HashSet<Device>();
                    switch2devices.put(nextHop, downLinkDevices);
                }
                downLinkDevices.add(device);
            }
        }
        //移除已经存在的上联设备
        for (String next : switch2devices.keySet()) {
            Device device = deviceService.findWithAddress(next);
            if (device != null) {
                //setup those devices up link with
                Set<Device> downLinkDevices = switch2devices.remove(next);
                for (Device downLinkDevice : downLinkDevices) {
                    setupLink(downLinkDevice, device, LinkType.UpLink, null);
                }
            }
        }
        //向上进行发现，需要避免过深
        if (!switch2devices.isEmpty()) {
            CollectionRange upRange = new CollectionRange(switch2devices.keySet());
            List<Device> upLinks = discoveryRange(engine, upRange, engine.getScopePath(), deviceSet, ranges, depth - 1);
            for (Device upLink : upLinks) {
                Set<Device> downLinks = switch2devices.remove(upLink.getAddress());
                for (Device downLink : downLinks) {
                    setupLink(downLink, upLink, LinkType.UpLink, null);
                }
            }
        }
        //向下进行发现，也需要避免过深，向下发现的switch与subnet之间的关系，不是Resource之间的Link
        // （因为Subnet不是Resource，而只是Topo Node之间的TopoLink)
        for (Device device : deviceList) {
            if (device instanceof Switch) {
                for (RouteEntry entry : device.getRouteEntries()) {
                    if (entry.getDest().startsWith("0.")) continue;
                    if (entry.getDest().startsWith("127.")) continue;
                    if (entry.getMask().equals("255.255.255.255")) continue;
                    if (entry.getType() != 3) continue;//direct
                    SubnetRange subnetRange = new SubnetRange(entry.getDest(), entry.getMask());
                    String subScopePath = engine.getScopePath() + "/" + Device.convertAsPath(entry.getDest());
                    List<Device> devs = discoveryRange(engine, subnetRange, subScopePath, deviceSet, ranges, depth - 1);
                    // 这里可以建立Switch到下面每个直接设备的连接，TODO 要不要建立呢？
                    for (Device dev : devs) {
                        setupLink(dev, device, LinkType.UpLink, null);
                    }
                }
            }
        }
        logger.info("Discovered  {} by {}, depth = {}", range, engine, depth);
        return deviceList;
    }

    protected Device[] discoverDevices(DiscoveryService discoveryService, String scopePath, Set<String> scopeAddresses)
            throws EngineException {
        Device[] details;
        if(scopeAddresses.isEmpty()){
            details = new Device[0];
        }else{
            details = discoveryService.discoverComponents(scopePath, scopeAddresses);
        }
        return details;
    }


    private void setupLink(Resource left, Resource right, LinkType type, Properties properties) {
        try {
            linkService.link(left, right, type, properties);
        } catch (ResourceException e) {
            logger.warn("Can't setup {} link between {} and {}, because of {}",
                        type, left, right, MiscUtils.describeException(e));
        }
    }

    void setupEthernetLinks(Set<Device> devices) {
        //TODO：这种关系的最终处理，可能由switch模块监听事件完成
        // 当下由于项目进度问题，先写在这里
        //最后一步：建立被发现设备之间的总体关系，例如 cisco switch设备之间的相邻关系
        Set<CandidateLink> candidateLinks = new HashSet<CandidateLink>();
        for (Device device : devices) {
            if (device instanceof Switch) {
                Switch switchDevice = (Switch) device;
                CdpEntry[] cdpEntries = switchDevice.getCdpEntries();
                for (CdpEntry entry : cdpEntries) {
                    CandidateLink candidateLink = findCandidateLink(candidateLinks,
                                                                    device.getLabel(),
                                                                    entry.getDeviceId());
                    if (candidateLink == null) {
                        candidateLink = new CandidateLink(device.getLabel(), entry.getDeviceId());
                        candidateLinks.add(candidateLink);
                    }
                    candidateLink.addPort(entry.getDevicePort());
                }
            }
        }
        for (CandidateLink candidateLink : candidateLinks) {
            Device left = findDeviceByLabel(devices, candidateLink.leftId);
            Device right = findDeviceByLabel(devices, candidateLink.rightId);
            if (left != null && right != null) {
                setupLink(left, right, LinkType.Connect, candidateLink.toProperties());
            }
        }
    }

    private CandidateLink findCandidateLink(Set<CandidateLink> candidateLinks, String leftId, String rightId) {
        for (CandidateLink candidateLink : candidateLinks) {
            if (candidateLink.isSame(leftId, rightId)) return candidateLink;
        }
        return null;
    }

    private Device findDeviceByLabel(Set<Device> devices, String label) {
        //先在已有设备中寻找
        for (Device device : devices) {
            if (device == null) continue;
            if (StringUtils.equals(device.getLabel(), label)) return device;
        }
        //再到数据库中寻找
        return deviceService.findByLabel(label);
    }

    private Device findDeviceByAddress(Set<Device> devices, String address) {
        //先在已有设备中寻找
        for (Device device : devices) {
            if (device == null) continue;
            if (StringUtils.equals(device.getAddress(), address)) return device;
        }
        //再到数据库中寻找
        return deviceService.findByAddress(address);
    }

    static class CandidateLink {
        String leftId;
        String rightId;
        private Set<String> ports;

        public CandidateLink(String leftId, String rightId) {
            this.leftId = leftId;
            this.rightId = rightId;
            this.ports = new HashSet<String>();
        }


        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof CandidateLink)) return false;

            CandidateLink that = (CandidateLink) o;

            if (!leftId.equals(that.leftId)) return false;
            //noinspection RedundantIfStatement
            if (!rightId.equals(that.rightId)) return false;

            return true;
        }

        @Override
        public int hashCode() {
            int result = leftId.hashCode();
            result = 31 * result + rightId.hashCode();
            return result;
        }

        public Properties toProperties() {
            Properties properties = new Properties();
            properties.setProperty("ports", StringUtils.join(ports, ","));
            return properties;
        }

        public void addPort(String port) {
            this.ports.add(port);
        }

        public boolean isSame(String leftId, String rightId) {
            return (this.leftId.equals(leftId) && this.rightId.equals(rightId)) ||
                   (this.rightId.equals(leftId) && this.leftId.equals(rightId));
        }
    }

    private List<String> findUpLinkNextHops(RouteEntry[] routeEntries) {
        List<String> result = new ArrayList<String>();
        for (RouteEntry entry : routeEntries) {
            if (entry.getType() == 4 /*indirect*/) {
                result.add(entry.getNextHop());
            }
        }
        return result;
    }

    int indexOf(List<Device> devices, Device target) {
        for (int i = 0; i < devices.size(); i++) {
            Device device = devices.get(i);
            if (StringUtils.equals(device.getAddress(), target.getAddress())) return i;
        }
        return -1;
    }

    //该方法返回时，相应的resource node也应该已经被创建并分配到监控引擎上了
    Device createDevice(String systemPath, String scopePath, Device device, String engineHostAddress) {
        //这些设备的属性，是服务器侧加上的，随着下次同步的动作，将会被引擎冲掉
        if (device.getLabel() == null) device.setLabel(device.getAddress());
        if (StringUtils.equals(device.getAddress(), engineHostAddress)) {
            device.setProperty(PROPERTY_SYSTEM_PATH, systemPath);
        } else {
            device.setProperty(PROPERTY_SCOPE_PATH, scopePath);
        }
        device.setProperty(PROPERTY_RELATIVE_PATH, Device.convertAsPath(device.getAddress()));
        device.setProperty(PROPERTY_SOURCE, "discovery");
        try {
            DeviceService<Device> concreteDeviceService = (DeviceService<Device>) serviceLocator.locate(device);
            return concreteDeviceService.create(device);
        } catch (Exception e) {
            logger.error("Can't create " + device, e);
            return null;
        }
    }

    Resource createResource(String systemPath, String scopePath, Resource resource, String engineHostAddress) {
        if (resource.getLabel() == null) resource.setLabel(resource.getAddress());
        String resourceHostAddress = resource.getProperty(PROPERTY_HOST_ADDRESS);
        if (StringUtils.equals(resourceHostAddress, engineHostAddress)) {
            resource.setProperty(PROPERTY_SYSTEM_PATH, systemPath);
        } else {
            resource.setProperty(PROPERTY_SCOPE_PATH, scopePath);
        }
        resource.setProperty(PROPERTY_RELATIVE_PATH, Device.convertAsPath(resource.getAddress()));
        resource.setProperty(PROPERTY_SOURCE, "discovery");
        try {
            ResourceService service = serviceLocator.locate(resource);
            return service.create(resource);
        } catch (Exception e) {
            logger.error("Can't create " + resource, e);
            return null;
        }
    }

    // 对在某次发现过程中找到的多个设备进行去重操作
    List<Device> reduceDuplicates(List<Device> devices) {
        List<Device> references = new ArrayList<Device>(devices);
        List<Device> duplicates = new ArrayList<Device>();
        Iterator<Device> it = devices.iterator();
        while (it.hasNext()) {
            Device device = it.next();
            //先从references里面剔除自己
            references.remove(device);
            if (contains(references, device)) {
                //从最终结果中剔除自己
                it.remove();
                duplicates.add(device);
            } else // 没有任何重复，把它再放回参考list
                references.add(device);
        }
        return duplicates;
    }

    private boolean contains(List<Device> references, Device device) {
        Set<String> deviceAddresses = extractAddresses(device.getAddresses());
        for (Device reference : references) {
            if (!StringUtils.equals(reference.getLabel(), device.getLabel()))
                continue;
            //为了兼容，采集来的地址不全的问题
            Set<String> referenceAddresses = extractAddresses(reference.getAddresses());
            for (String deviceAddress : deviceAddresses) {
                if (referenceAddresses.contains(deviceAddress)) {
                    logger.warn("Skip {} because of its address {} is duplicate with {}", device, deviceAddress,
                                reference);
                    return true;
                }
            }
        }
        return false;
    }

    private Set<String> extractAddresses(AddressEntry[] addresses) {
        Set<String> result = new HashSet<String>();
        for (AddressEntry entry : addresses) {
            if (entry.getAddr().startsWith("127.")) continue;
            if (entry.getAddr().startsWith("169.")) continue;//none ip
            result.add(entry.getAddr());
        }
        return result;
    }

    private String convertAsNetAddress(String address) {
        String[] numbers = address.split("\\.");
        numbers[3] = "0";
        return StringUtils.join(numbers, ".");
    }
}
