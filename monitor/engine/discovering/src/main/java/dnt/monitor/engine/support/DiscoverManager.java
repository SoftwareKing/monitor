/**
 * Developer: Kadvin Date: 15/2/16 下午2:30
 */
package dnt.monitor.engine.support;

import dnt.monitor.engine.service.*;
import dnt.monitor.exception.EngineException;
import dnt.monitor.model.*;
import dnt.monitor.service.DiscoveryService;
import net.happyonroad.credential.ShellCredential;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.model.Credential;
import net.happyonroad.model.IpRange;
import net.happyonroad.spring.ApplicationSupportBean;
import net.happyonroad.spring.service.ServiceRegistry;
import net.happyonroad.type.Availability;
import net.happyonroad.type.TimeInterval;
import net.happyonroad.util.IpUtils;
import net.happyonroad.util.MiscUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.SystemUtils;
import org.nmap4j.Nmap4j;
import org.nmap4j.core.flags.Flag;
import org.nmap4j.core.nmap.ExecutionResults;
import org.nmap4j.core.nmap.NMapExecutionException;
import org.nmap4j.core.nmap.NMapInitializationException;
import org.nmap4j.data.NMapRun;
import org.nmap4j.data.host.Address;
import org.nmap4j.data.host.ports.Port;
import org.nmap4j.data.nmaprun.Host;
import org.nmap4j.parser.OnePassParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationListener;
import org.springframework.core.OrderComparator;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.Process;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

/**
 * <h1>发现服务</h1>
 */
@org.springframework.stereotype.Service
class DiscoverManager extends ApplicationSupportBean
        implements DiscoveryService, ApplicationListener<SystemStartedEvent> {

    OnePassParser parser;
    String        nmapPath;
    Nmap4j        nmap4j;
    Set<Service>  discoveryServices;
    File          serviceDbFile;

    /*批量发现执行服务*/
    @Autowired
    @Qualifier("discoveryExecutor")
    ExecutorService     discoveryExecutor;
    @Autowired
    NodeStore           nodeStore;
    @Autowired
    ResourceStore       resourceStore;
    @Autowired
    ServiceRegistry     serviceRegistry;
    @Autowired
    SampleHelperFactory sampleHelperFactory;

    @Override
    protected void performStart() {
        super.performStart();
        nmapPath = System.getProperty("nmap.path");
        if (StringUtils.isEmpty(nmapPath)) {
            if (!SystemUtils.IS_OS_WINDOWS) {
                nmapPath = whichNmap();
                nmapPath = new File(nmapPath).getParentFile().getParentFile().getPath();
            } else {
                throw new IllegalStateException("Can't auto-detect nmap in windows, " +
                                                "please specify nmap.path in engine.properties");
            }

        }

        parser = new OnePassParser();
    }

    //只有在这个时候，所有的资源包已经加载的情况下，才能找到所有的系统端口服务
    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        List<String> serviceEntries = new ArrayList<String>();
        discoveryServices = new HashSet<Service>();
        for (IpServiceDiscover discover : parseDiscovers()) {
            Service service = discover.service();
            if( service == null ) continue;
            discoveryServices.add(service);
            if (StringUtils.isNotBlank(service.getProtocol()))
                serviceEntries.add(String.format("%s\t%d/%s\t0", service.getLabel(), service.getPort(),
                                                 service.getProtocol()));
            else
                serviceEntries.add(String.format("%s\t%d\t0", service.getLabel(), service.getPort()));
            logger.debug("Found {}@{} ", discover.getClass().getName(), service);
        }
        FileOutputStream fos = null;
        try {
            //TODO 需要发现的服务，现在仅限于snmp, wmi, ssh； 改为根据系统配置的服务列表进行发现
            serviceDbFile = new File(System.getProperty("app.home"), "config/service_db.nmap");
            fos = new FileOutputStream(serviceDbFile);
            IOUtils.writeLines(serviceEntries, SystemUtils.LINE_SEPARATOR, fos);
        } catch (IOException ex) {
            IOUtils.closeQuietly(fos);
            throw new ApplicationContextException("Can't init the system service db", ex);
        }
    }

    // 由于采用了nmap -sS的参数，需要执行本程序的用户在sudoers里面
    @Override
    public Device[] searchDevices(IpRange range) throws EngineException {
        logger.info("Searching devices {}", range);
        long start = System.currentTimeMillis();
        nmap4j = new Nmap4j(nmapPath);
        //sudo nmap -sUS -PEO -T5 --servicedb services 192.168.12.1/24
        nmap4j.sudo("root");
        nmap4j.addFlags(Flag.UDP_SCAN.toString());
        nmap4j.addFlags(Flag.TCP_SYN_SCAN.toString());
        nmap4j.addFlags(Flag.PROTOCOL_PING.toString());
        nmap4j.addFlags(Flag.ICMP_ECHO_DISCOVERY.toString());
        nmap4j.addFlags(Flag.INSANE_TIMING.toString());
        nmap4j.addFlags("--servicedb " + serviceDbFile.getPath());
        nmap4j.includeHosts(range.toString());
        try {
            nmap4j.execute();
        } catch (NMapInitializationException e) {
            throw new EngineException("Error while initialize nmap", e);
        } catch (NMapExecutionException e) {
            throw new EngineException("Error while search devices against " + range, e);
        }
        ExecutionResults results = nmap4j.getExecutionResults();
        List<Device> devices = new LinkedList<Device>();
        ArrayList<Host> hosts;
        try {
            NMapRun result = parser.parse(results.getOutput(), OnePassParser.STRING_INPUT);
            hosts = result.getHosts();
        } catch (Exception e) {
            if (results.hasErrors()) {
                String message = "Error while scan(" + range + ")" +
                                 " by `" + results.getExecutedCommand() + "`" +
                                 "\n\t" + results.getErrors() + "derived : " + MiscUtils.describeException(e);
                throw new EngineException(message);
            } else {
                throw new EngineException("Error while parse search results", e);
            }
        }
        for (Host host : hosts) {
            Device device = resolveDevice(host);
            devices.add(device);
        }
        if (devices.isEmpty() && results.hasErrors()) {
            String message = "Error while scan(" + range + ")" +
                             " by `" + results.getExecutedCommand() + "`" +
                             "\n\t" + results.getErrors();
            throw new EngineException(message);
        }
        logger.info("Searched  devices {}: {} Device(s), take {}ms", range, devices.size(),
                    System.currentTimeMillis() - start);
        for (Device device : devices) {
            //store them below, maybe used by detail discovery
            resourceStore.add(device);
        }
        return devices.toArray(new Device[devices.size()]);
    }


    Device resolveDevice(Host host) {
        Device device = new Device();
        device.setType("/device");
        device.setAvailability(Availability.Available);
        List<AddressEntry> addressEntries = new ArrayList<AddressEntry>();
        for (Address address : host.getAddresses()) {
            if (address.getAddrtype().equalsIgnoreCase("ipv4")) {
                device.setAddress(address.getAddr());
                AddressEntry entry = new AddressEntry();
                entry.setAddr(address.getAddr());
                addressEntries.add(entry);
            } else if (address.getAddrtype().equalsIgnoreCase("ipv6")) {
                device.setAddress(address.getAddr());
                AddressEntry entry = new AddressEntry();
                entry.setAddr(address.getAddr());
                addressEntries.add(entry);
            } else if (address.getAddrtype().equals("mac")) {
                //TODO need not generate NIC? Common Device Recognition depends on MAC address
                NIC nic = new NIC();
                nic.setType("/nic");
                //应该等经过snmp等方式发现后，根据 mac address，
                // 将 index, mtu, speed, description(label)等信息填充上来
                nic.setIfType(1);//Ethernet
                nic.setAddress(IpUtils.regularMAC(address.getAddr()));
                nic.setAvailability(Availability.Available);
                nic.setAdminStatus(2);//正常
                if (address.getVendor() != null) {
                    device.setProperty("vendor", address.getVendor());
                }
                List<NIC> nics = new LinkedList<NIC>();
                nics.add(nic);
                device.setInterfaces(nics);
            }
        }
        device.setAddresses(addressEntries.toArray(new AddressEntry[addressEntries.size()]));
        List<Service> services = resolveServices(host);
        device.setServices(services);
        return device;
    }

    List<Service> resolveServices(Host host) {
        List<Service> services = new ArrayList<Service>(3);
        for (Port port : host.getPorts().getPorts()) {
            if (port.getState().getState().contains("open")) {
                Service service = new Service();
                service.setPort((int) port.getPortId());
                service.setProtocol(port.getProtocol());
                service.setLabel(port.getService().getName());
                services.add(service);
            }
        }
        return services;
    }

    /**
     * <h2>执行设备组件发现</h2>
     * 采用并发方式执行每个设备的发现，具体每个设备的发现步骤为：
     * <ol>
     * <li> 查找到对应的node, resource
     * <li> 遍历当前的IpServiceDiscover(已经按照优先级排序过)
     * <li> 查看当前资源是否存在该discover所对应的ip service
     * <li> 如果存在对应的service，则检查当前节点是否存在对应的credential
     * <li> 如果存在相应的credential，则检查该credential是否可用(test) (与可用性状态的维护一致)
     * <li> 如果credential可用，则执行实际的组件发现工作; 否则尝试下一个discover;
     * </ol>
     * 以SNMP方式的资源发现为例，实际的资源组件发现过程，主要是:
     * <ol>
     * <li> 先获取到对应资源的System OID
     * <li> 而后根据该System OID，与系统类型数据库比对，知道其设备类型(有可能无法知道具体型号，版本)
     * <li> 将资源实例类型变化为对应的新的实例类型
     * <li> 根据资源实例类型，查找到该资源的元模型
     * <li> 根据资源元模型，对其组件进行发现(先读取该资源的指标组, 再读取其关键组件/组件集合的指标组)
     * <li> 发现的组件信息应该被转换为资源模型中的组件信息，如果该组件与已有组件一致，则应该进行关联
     * </ol>
     * 获取到资源类型的元模型后，具体的采集方式为：
     * <ol>
     * <li> 开发者在开发相应资源模型时，
     * 通过Annotation(@snmp)机制，为ManagedObject(Resource/Component/Link)标记为相应的指标组
     * <li> 同样，开发者也通过类似机制，为各个 @Metric, @Indicator, @Config标记了相应的指标字段(oid)，解析/翻译机制
     * <li> SNMP采集器，收到对相应managed object进行采集的任务，只需要采用合适的方式(get/get next/bulk get/walk)获取数据
     * <li> 最终将采集来的snmp信息转换为模型属性
     * </ol>
     *
     * @param scopePath       发现时，从哪个管理节点处获取管理参数
     * @param deviceAddresses 需要详细发现的设备地址
     * @return 包括其详细组件的设备数组
     * @throws EngineException
     */
    @Override
    public Device[] discoverComponents(String scopePath, Set<String> deviceAddresses) throws EngineException {
        List<IpServiceDiscover> discovers = parseDiscovers();
        List<DeviceDiscoveryTask> tasks = parseDiscoveryTasks(scopePath, deviceAddresses, discovers);
        long maxTimeout = 0;
        for (DeviceDiscoveryTask task : tasks) {
            int timeout = task.computeTimeout();
            if (timeout > maxTimeout)
                maxTimeout = timeout;
        }
        maxTimeout += 1000;
        String maxCost = TimeInterval.parse(maxTimeout);
        if (logger.isInfoEnabled()) {
            logger.info("Start {} tasks to discover components for {} addresses, max timeout {}",
                        tasks.size(), deviceAddresses.size(), maxCost);
        }
        long start = System.currentTimeMillis();
        //Submit所有的任务，让他们都去执行
        List<Future<Device>> futures;
        try {
            futures = discoveryExecutor.invokeAll(tasks, maxTimeout, TimeUnit.MILLISECONDS);
        } catch (InterruptedException e) {
            throw new EngineException("Failed invoke all component discovery task in " + maxCost);
        }

        List<Device> devices = new ArrayList<Device>(tasks.size());
        for (Future<Device> future : futures) {
            Device discoveredDevice;
            try {
                discoveredDevice = future.get();
                if (discoveredDevice != null) devices.add(discoveredDevice);
            } catch (Exception e) {
                logger.debug(MiscUtils.describeException(e));
            }
        }
        if (logger.isInfoEnabled()) {
            String cost = TimeInterval.parse(System.currentTimeMillis() - start);
            logger.info("Discovered {} devices after execution {} tasks for {} nodes, takes {}",
                        devices.size(), tasks.size(), deviceAddresses.size(), cost);
        }
        //save them into local store
        for (Device device : devices) {
            Resource exist = resourceStore.findByAddress(device.getAddress());
            if (exist != null)
                resourceStore.update(device, device);
            else
                resourceStore.add(device);
        }
        return devices.toArray(new Device[devices.size()]);
    }

    protected List<IpServiceDiscover> parseDiscovers() {
        //主要是 snmp, ssh, wmi
        Map<String, IpServiceDiscover> services = serviceRegistry.getServices(IpServiceDiscover.class);
        List<IpServiceDiscover> discovers = new ArrayList<IpServiceDiscover>();
        discovers.addAll(services.values());
        OrderComparator.sort(discovers);
        return discovers;
    }

    protected List<DeviceDiscoveryTask> parseDiscoveryTasks(String scopePath,
                                                            Set<String> deviceAddresses,
                                                            List<IpServiceDiscover> discovers) {

        GroupNode node = (GroupNode) nodeStore.findByPath(scopePath);
        node = nodeStore.merge(node);
        List<DeviceDiscoveryTask> tasks = new ArrayList<DeviceDiscoveryTask>();
        for (String address : deviceAddresses) {
            Device device = (Device) resourceStore.findByAddress(address);
            DeviceDiscoveryTask task = new DeviceDiscoveryTask(node, device);
            DISCOVERS:
            for (IpServiceDiscover discover : discovers) {
                //判断该设备是否由该discover对应的服务
                if (contains(device.getServices(), discover.service())) {
                    //判断node上是否配置了有可以使用的认证方式
                    // 存在相应的credential不代表可以访问，具体是否好用，由发现任务在执行时判断(不好用就执行失败)
                    if (node.getCredentials() != null) for (Credential credential : node.getCredentials()) {
                        if (discover.support(credential)) {
                            task.addDiscover(discover, credential);
                            continue DISCOVERS;
                        }
                    }
                }
            }
            if (task.hasDiscovers()) {
                tasks.add(task);
            }
        }
        return tasks;
    }

    boolean contains(List<Service> services, Service service) {
        if (service == null) return true;
        if (services.isEmpty()) return false;
        for (Service exist : services) {
            if (exist.getPort() == service.getPort() &&
                exist.getProtocol().equals(service.getProtocol()))
                return true;
        }
        return false;
    }

    @Override
    public Resource[] discoverRelates(List<String> hostAddresses) throws EngineException {
        List<SampleHelper> helpers = new LinkedList<SampleHelper>();
        logger.info("Discovering relates of {}", StringUtils.join(hostAddresses, ","));
        //先找到每个主机对应的访问器
        for (String hostAddress : hostAddresses) {
            Device host = (Device) resourceStore.findByAddress(hostAddress);
            if( host == null ){
                logger.warn("Can't find host with address = {} in resource store", hostAddress);
                continue;
            }
            if( !(host instanceof dnt.monitor.model.Host)){
                logger.warn("{} is not a host", host);
                continue;
            }
            ResourceNode node = nodeStore.findByResourceId(host.getId());
            if( node == null ){
                logger.warn("Can't find resource node for host {} in node store", host);
                continue;
            }
            node.setResource(host);
            node = nodeStore.merge(node);
            node.only(ShellCredential.class);
            SampleHelper helper = sampleHelperFactory.createHelper(node);
            if (helper == null) {
                logger.warn("Can't create sample helper for {}", hostAddress);
                continue;
            }
            helpers.add(helper);
        }
        List<RelatesDiscoverTask> tasks = new ArrayList<RelatesDiscoverTask>(helpers.size());
        for (SampleHelper helper : helpers) {
            tasks.add(new RelatesDiscoverTask(helper, parseResourceDiscovers()));
        }
        long start = System.currentTimeMillis();
        //Submit所有的任务，让他们都去执行
        List<Future<Resource[]>> futures;
        try {
            futures = discoveryExecutor.invokeAll(tasks, 1, TimeUnit.MINUTES);
        } catch (InterruptedException e) {
            throw new EngineException("Failed invoke all related discovery task in 1m");
        }
        List<Resource> resources = new LinkedList<Resource>();
        for (Future<Resource[]> future : futures) {
            Resource[] discoveredResources;
            try {
                discoveredResources = future.get();
                if (discoveredResources != null)
                    resources.addAll(Arrays.asList(discoveredResources));
            } catch (Exception e) {
                logger.warn(MiscUtils.describeException(e));
            }
        }
        if (logger.isInfoEnabled()) {
            String cost = TimeInterval.parse(System.currentTimeMillis() - start);
            logger.info("Discovered {} related resources after execution {} tasks for {} hosts, takes {}",
                        resources.size(), tasks.size(), hostAddresses.size(), cost);
        }
        //save them into local store
        for (Resource resource : resources) {
            resourceStore.add(resource);
        }
        return resources.toArray(new Resource[resources.size()]);

    }

    protected List<ResourceDiscover> parseResourceDiscovers() {
        //主要是 snmp, ssh, wmi
        Map<String, ResourceDiscover> services = serviceRegistry.getServices(ResourceDiscover.class);
        List<ResourceDiscover> discovers = new ArrayList<ResourceDiscover>();
        discovers.addAll(services.values());
        OrderComparator.sort(discovers);
        return discovers;
    }


    static String whichNmap() {
        List<String> lines;
        String errors;
        try {
            Process exec = Runtime.getRuntime().exec("which nmap");
            exec.waitFor();
            lines = IOUtils.readLines(exec.getInputStream());
            errors = StringUtils.join(IOUtils.readLines(exec.getErrorStream()), "\n");
        } catch (Exception ex) {
            throw new UnsupportedOperationException("Can't execute `which nmap`", ex);
        }
        if (lines.isEmpty()) {
            throw new UnsupportedOperationException("Can't execute `which nmap`: " + errors);
        }
        return lines.get(0);
    }
}
