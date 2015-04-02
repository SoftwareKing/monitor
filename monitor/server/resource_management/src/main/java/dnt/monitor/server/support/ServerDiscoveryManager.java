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
import net.happyonroad.util.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
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
    //TODO 变为server/engine的控制参数
    private static final int MAX_DEPTH = 3;

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
            deviceService = (DeviceService<Device>) serviceLocator.locateResourceService("/device");
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
        discoveryRange(engine, localRange, MAX_DEPTH);
    }

    public void discoveryRange(MonitorEngine engine,
                               SubnetRange range,
                               int depth) throws DiscoveryException {
        String netAddress = convertAsNetAddress(range.getAddress());
        String scopePath = engine.getScopePath() + "/" + Device.convertAsPath(netAddress);
        Set<Device> devices = new HashSet<Device>();
        Set<IpRange> ranges = new HashSet<IpRange>();
        discoveryRange(engine, range, scopePath, devices, ranges, depth);
        setupEthernetLinks(devices);
    }

    public void discoveryRange(MonitorEngine engine,
                               IpRange range,
                               String scopePath,
                               Set<Device> deviceSet,
                               Set<IpRange> ranges,
                               int depth)
            throws DiscoveryException {
        if (depth < 0) {
            logger.warn("Stop discovery " + range + ", because of depth is less than zero");
            return;
        }
        if (ranges.contains(range)) {
            logger.debug("Stop discovery " + range + ", because of it's discovered already");
            return;
        }
        //将当前被发现的range放到已经发现的ranges里面，避免递归时重复进行发现
        ranges.add(range);
        // 第1步: 对该动态range进行发现
        DiscoveryService discoveryService = engineServiceLocator.locate(engine, DiscoveryService.class);
        Device[] devices;
        try {
            devices = discoveryService.searchDevices(range);
        } catch (EngineException e) {
            throw new DiscoveryException("Can't search devices by " + engine + " for " + range, e);
        }
        // 第2步: 将发现出来的设备入库
        List<Device> createdDevices = new ArrayList<Device>(devices.length);
        for (Device device : devices) {
            //如果这个设备已经在设备集合中，则不进行后继的发现
            if (deviceSet.contains(device))
                continue;
            //如果这个设备，已经在数据库中，则不进行后继的发现
            Device exist = deviceService.findWithAddress(device.getAddress());
            if (exist != null) {
                logger.warn("Skip {} which is duplicate with {}", device, exist);
                continue;
            }
            device.setProperty(PROPERTY_SCOPE_PATH, scopePath);
            Device created = createDevice(device);
            if (created != null) createdDevices.add(created);
        }
        Set<String> discoveryPaths = new HashSet<String>();
        // 第3步: 对发现出来的设备进行更细致的发现(仅对存在服务的设备)
        for (Device dev : createdDevices) {
            if (dev.getServices() != null && !dev.getServices().isEmpty()) {
                String path = dev.getProperty(PROPERTY_SCOPE_PATH) + "/" + dev.getProperty(PROPERTY_RELATIVE_PATH);
                discoveryPaths.add(path);
            }
        }
        //让下面的引擎同时对如下路径的资源发起细致的发现，这一步操作在下面是并发的
        List<Device> detailDevices = new ArrayList<Device>();
        try {
            logger.info("{} devices need to be discovered in deep", discoveryPaths.size());
            Device[] details = discoveryService.discoverComponents(discoveryPaths);
            detailDevices.addAll(Arrays.asList(details));
            logger.info("{} devices discovered actually", detailDevices.size());
        } catch (EngineException e) {
            String msg = "Can't discovery components by " + engine + " for " + StringUtils.join(discoveryPaths, ",");
            throw new DiscoveryException(msg, e);
        }
        // 在这一步发现的的详细设备，可能就有重复
        List<Device> reducedDevices = reduceDuplicates(detailDevices);
        // 从 created devices里面删除该记录，避免稍后删除之
        for (Device device : reducedDevices) {
            createdDevices.remove(device);
        }
        removeDuplicates(reducedDevices);

        // 第4步: 将细致发现的结果入库
        for (Device detail : detailDevices) {
            //根据id找到原来的对象
            Device legacy = findDevice(createdDevices, detail);
            // 下面的采集的代码可能有错，丢失了数据库id，导致这里不能正常工作
            // 再次更新入库
            updateDevice(legacy, detail);
            //Replace created device with detailed one
            int pos = createdDevices.indexOf(detail);
            createdDevices.set(pos, detail);
            //与数据库里面已有的设备进行比对，去除数据库中的重复
            List<String> addresses = new ArrayList<String>();
            for (AddressEntry addressEntry : detail.getAddresses()) {
                //略过本地地址
                if (addressEntry.getAddr().startsWith("127.")) continue;
                addresses.add(addressEntry.getAddr());
            }
            if (!addresses.isEmpty()) {
                List<Device> duplicates = deviceService.findAllInAddresses(addresses, detail);
                removeDuplicates(duplicates);
            }
        }

        //第5步: 递归处理交换机设备的上联/外联设备
        Map<String, Set<Device>> switch2devices = new HashMap<String, Set<Device>>();
        for (Device device : detailDevices) {
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
            discoveryRange(engine, upRange, engine.getScopePath(), deviceSet, ranges, depth - 1);
        }
        //向下进行发现，也需要避免过深，向下发现的switch与subnet之间的关系，不是Resource之间的Link
        // （因为Subnet不是Resource，而只是Topo Node直接的TopoLink)
        for (Device device : createdDevices) {
            if (device instanceof Switch) {
                for (RouteEntry entry : device.getRouteEntries()) {
                    if (entry.getDest().startsWith("0.")) continue;
                    if (entry.getDest().startsWith("127.")) continue;
                    if (entry.getMask().equals("255.255.255.255")) continue;
                    if (entry.getType() != 3) continue;//direct
                    SubnetRange subnetRange = new SubnetRange(entry.getDest(), entry.getMask());
                    String subScopePath = engine.getScopePath() + "/" + Device.convertAsPath(entry.getDest());
                    discoveryRange(engine, subnetRange, subScopePath, deviceSet, ranges, depth - 1);
                }
            }
        }

    }


    private void setupLink(Device left, Device right, LinkType type, Properties properties) {
        try {
            linkService.link(left, right, type, properties);
        } catch (ResourceException e) {
            logger.warn("Can't setup {} link between {} and {}, because of {}",
                        type, left, right, ExceptionUtils.getRootCauseMessage(e));
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
            if (StringUtils.equals(device.getLabel(), label)) return device;
        }
        //再到数据库中寻找
        return deviceService.findByLabel(label);
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

    Device findDevice(List<Device> devices, Device device) {
        for (Device legacy : devices) {
            if (legacy.getId().equals(device.getId())) return legacy;
        }
        return null;
    }

    //该方法返回时，相应的resource node也应该已经被创建并分配到监控引擎上了
    Device createDevice(Device device) {
        device.setLabel(device.getAddress());
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
                if( referenceAddresses.contains(deviceAddress) ){
                    logger.warn("Skip {} because of its address {} is duplicate with {}", device, deviceAddress, reference);
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

    void removeDuplicates(List<Device> duplicates) {
        if (!duplicates.isEmpty()) {
            logger.info("Found {} devices duplicate, and reduced them", duplicates.size());

            for (Device duplicate : duplicates) {
                removeDevice(duplicate);
            }
        }
    }

    private void updateDevice(Device legacy, Device detailed) {
        try {
            DeviceService<Device> concreteDeviceService = (DeviceService<Device>) serviceLocator.locate(detailed);
            concreteDeviceService.update(legacy, detailed);
        } catch (ResourceException e) {
            logger.error("Can't update " + detailed, e);
        }

    }

    private void removeDevice(Device device) {
        try {
            deviceService.delete(device);
        } catch (ResourceException e) {
            logger.error("Can't delete " + device, e);
        }

    }

    private String convertAsNetAddress(String address) {
        String[] numbers = address.split("\\.");
        numbers[3] = "0";
        return StringUtils.join(numbers, ".");
    }
}
