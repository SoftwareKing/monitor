package dnt.monitor.engine.support;

import dnt.monitor.engine.exception.SnmpException;
import dnt.monitor.engine.service.DiscoveryContext;
import dnt.monitor.engine.service.SampleService;
import dnt.monitor.service.Visitor;
import dnt.monitor.engine.snmp.MibAwareSnmpVisitor;
import dnt.monitor.exception.EngineException;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.*;
import net.happyonroad.model.Credential;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.type.Availability;
import net.happyonroad.util.IpUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.reflect.FieldUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * <h1>临时开发的设备Snmp采集器</h1>
 * 不依赖于实际的通用SNMP采集机制，而是为了拓扑发现临时使用的
 *
 * @author Jay Xiong
 */
//@org.springframework.stereotype.Component
class DeviceSampleManager extends AbstractSampleManager implements SampleService {
    @Autowired
    DiscoveryContext context;

    public DeviceSampleManager() {
        setOrder(49);//before snmp sample manager
    }

    @Override
    protected String supportedCredentials() {
        return Credential.Snmp;
    }

    @Override
    public Resource sampleResource(Visitor v, MetaResource metaResource) throws SampleException {
        MibAwareSnmpVisitor visitor = (MibAwareSnmpVisitor) v;
        try {
            Device device = (Device) metaResource.newInstance();
            String sysName = applySystemInfo(visitor, device);
            Set<String> ips = applyAddresses(visitor, device);
            try {
                //走到这一步，需要去申请设备的发现锁，如果被其他设备申请了，则直接抛出sample exception，说明同一个设备被以多ip发现
                context.acquire(sysName, ips);
            } catch (EngineException e) {
                throw new SampleException("Can't acquire the discovery lock of " + sysName, e);
            }
            List<GeneralMap<String, Object>> interfaces = retrieveInterfaces(visitor);
            device.setInterfaces(convertNICs(device, interfaces));

            List<GeneralMap<String, Object>> routes = visitor.table("1.3.6.1.2.1.4.21", "ipRoute");
            device.setRouteEntries(covertRoutes(routes));

            List<GeneralMap<String, Object>> arps = visitor.table("1.3.6.1.2.1.4.22", "ipNetToMedia");
            device.setArpEntries(covertArps(arps));
            if( device.getType().equals("/device/switch") ){
                List<GeneralMap<String, Object>> cdpTable = visitor.table("1.3.6.1.4.1.9.9.23.1.2.1", "cdpCache");
                Class klass = FieldUtils.getField(metaResource.getModelClass(), "cdpEntries", true).getType();
                Object cdpEntries = convertCdps(klass, cdpTable);
                PropertyUtils.setProperty(device, "cdpEntries", cdpEntries);
            }

            return device;
        } catch (SnmpException e) {
            throw new SampleException("Can't sample " + visitor.getResource(), e);
        } catch (Exception e) {
            throw new SampleException("Can't create " + visitor.getResource(), e);
        }
    }

    protected String applySystemInfo(MibAwareSnmpVisitor visitor, Device device) throws SnmpException {
        GeneralMap<String, Object> systemInfo = visitor.walk("1.3.6.1.2.1.1", "sys");
        String sysName = systemInfo.getString("Name");
        device.setDescription(systemInfo.getString("Descr"));
        device.setLabel(sysName);
        device.setObjectID(systemInfo.getString("ObjectID"));
        device.setUpTime(systemInfo.getString("UpTime"));
        device.setContact(systemInfo.getString("Contact"));
        device.setLocation(systemInfo.getString("Location"));
        return sysName;
    }

    protected Set<String> applyAddresses(MibAwareSnmpVisitor visitor, Device device) throws SnmpException {
        List<GeneralMap<String, Object>> addresses = visitor.table("1.3.6.1.2.1.4.20", "ipAdEnt");
        Set<String> ips = new HashSet<String>();
        for (GeneralMap<String, Object> address : addresses) {
            ips.add(address.getString("Addr"));
        }
        device.setAddresses(covertAddresses(addresses));
        return ips;
    }

    protected List<GeneralMap<String, Object>> retrieveInterfaces(MibAwareSnmpVisitor visitor) throws SnmpException {
        return visitor.table("1.3.6.1.2.1.2.2", "if");
    }

    private List<NIC> convertNICs(Device device, List<GeneralMap<String, Object>> interfaces) {
        List<NIC> nics = new ArrayList<NIC>(interfaces.size());
        for (GeneralMap<String, Object> raw : interfaces) {
            String physAddress = IpUtils.regularMAC(raw.getString("PhysAddress"));
            NIC nic = findOrCreateNic(device, physAddress);
            nics.add(nic);
            nic.setType("/interface");
            nic.setResource(device);
            nic.setLabel(raw.getString("Descr"));
            nic.setIndex(raw.getInteger("Index"));
            nic.setIfType(raw.getInteger("Type"));
            nic.setMtu(raw.getInteger("Mtu"));
            nic.setSpeed(raw.getLong("Speed"));
            nic.setAddress(physAddress);
            nic.setAdminStatus(raw.getInteger("AdminStatus"));
            Integer operStatus = raw.getInteger("OperStatus");
            Availability availability;
            if( operStatus == 1 ){
                availability = Availability.Unavailable;
            }else if(operStatus == 2 ){
                availability = Availability.Available;
            }else if (operStatus == 3){
                availability = Availability.Testing;
            }else {
                availability = Availability.Unknown;
            }
            nic.setAvailability(availability);
            //TODO USAGE  Collisions, rtx, trx, ttx, trtx
            nic.setRx(raw.getDouble("InOctets"));
            nic.setTx(raw.getDouble("OutOctets"));
            nic.setInPkts(raw.getLong("InUcastPkts"));
            nic.setOutPkts(raw.getLong("OutUcastPkts"));
            nic.setInDiscards(raw.getLong("InDiscards"));
            nic.setOutDiscards(raw.getLong("OutDiscards"));
            nic.setInErrs(raw.getLong("InErrors"));
            nic.setOutErrs(raw.getLong("OutErrors"));
            nic.setQueueLength(raw.getLong("OutQLen"));
        }
        return nics;
    }

    private NIC findOrCreateNic(Device device, String physAddress) {
        if(device.getInterfaces() != null ){
            for (NIC nic : device.getInterfaces()) {
                if(StringUtils.equalsIgnoreCase(IpUtils.regularMAC(nic.getAddress()), physAddress)){
                    return nic;
                }
            }
        }
        return new NIC();
    }

    private AddressEntry[] covertAddresses(List<GeneralMap<String, Object>> addresses) {
        AddressEntry[] entries = new AddressEntry[addresses.size()];
        for (int i = 0; i < addresses.size(); i++) {
            GeneralMap<String, Object> raw = addresses.get(i);
            AddressEntry entry = new AddressEntry();
            entries[i] = entry;
            entry.setAddr(raw.getString("Addr"));
            entry.setBcastAddr(raw.getBoolean("BcastAddr"));
            entry.setIfIndex(raw.getInteger("Index"));
            entry.setNetMask(raw.getString("NetMask"));
            entry.setReasmMaxSize(raw.getInteger("ReasmMaxSize"));
        }
        return entries;
    }

    private RouteEntry[] covertRoutes(List<GeneralMap<String, Object>> routes) {
        RouteEntry[] entries = new RouteEntry[routes.size()];
        for (int i = 0; i < routes.size(); i++) {
            GeneralMap<String, Object> raw = routes.get(i);
            RouteEntry entry = new RouteEntry();
            entries[i] = entry;
            entry.setDest(raw.getString("Dest"));
            entry.setIfIndex(raw.getInteger("IfIndex"));
            entry.setNextHop(raw.getString("NextHop"));
            entry.setType(raw.getInteger("Type"));
            entry.setProto(raw.getInteger("Proto"));
            entry.setAge(raw.getInteger("Age"));
            entry.setMask(raw.getString("Mask"));
        }
        return entries;
    }

    private ARPEntry[] covertArps(List<GeneralMap<String, Object>> arps) {
        ARPEntry[] entries = new ARPEntry[arps.size()];
        for (int i = 0; i < arps.size(); i++) {
            GeneralMap<String, Object> raw = arps.get(i);
            ARPEntry entry = new ARPEntry();
            entries[i] = entry;
            entry.setIfIndex(raw.getInteger("IfIndex"));
            entry.setPhysAddress(raw.getString("PhysAddress"));
            entry.setNetAddress(raw.getString("NetAddress"));
            entry.setType(raw.getInteger("Type"));
        }
        return entries;
    }

    private Object convertCdps(Class cdpEntryClass, List<GeneralMap<String, Object>> cdpTable) {
        Object entries =  Array.newInstance(cdpEntryClass, cdpTable.size());
        for (int i = 0; i < cdpTable.size(); i++) {
            GeneralMap<String, Object> raw = cdpTable.get(i);
            Entry entry;
            try {
                entry = (Entry) cdpEntryClass.newInstance();
                Array.set(entries, i, entry);
                PropertyUtils.setProperty(entry, "address", raw.getString("Address"));
                PropertyUtils.setProperty(entry, "addressType", raw.getInteger("AddressType"));
                PropertyUtils.setProperty(entry, "deviceId", raw.getString("DeviceId"));
                PropertyUtils.setProperty(entry, "platform", raw.getString("Platform"));
                PropertyUtils.setProperty(entry, "capabilities", raw.getString("Capabilities"));
                PropertyUtils.setProperty(entry, "nativeVLAN", raw.getInteger("NativeVLAN"));
            } catch (Exception e) {
                //skip it
            }
        }
        return entries;
    }

}
