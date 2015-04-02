package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.exception.SnmpException;
import dnt.monitor.engine.service.DiscoveryContext;
import dnt.monitor.engine.snmp.MibAwareSnmpVisitor;
import dnt.monitor.exception.EngineException;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.*;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.type.Availability;
import net.happyonroad.util.IpUtils;
import org.apache.commons.lang.StringUtils;
import org.snmp4j.smi.OID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
@Component
class DeviceSampleManager extends SnmpSampleManager {
    static final int PAGE_SIZE = 100;
    @Autowired
    DiscoveryContext context;

    @Override
    public Resource sampleResource(ResourceNode node, MetaResource metaModel) throws SampleException {
        MibAwareSnmpVisitor visitor = (MibAwareSnmpVisitor) visitor(node);
        try {
            Device device = (Device) metaModel.getModelClass().newInstance();
            String type = device.getType();
            device.apply(node.getResource());
            if( type != null ){
                device.setType(type);// dont use origin type
            }
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

            if( device instanceof Switch ){
                List<GeneralMap<String, Object>> cdpTable = visitor.table("1.3.6.1.4.1.9.9.23.1.2.1", "cdpCache");
                ((Switch) device).setCdpEntries(convertCdps(cdpTable));
            }

            return device;
        } catch (SnmpException e) {
            throw new SampleException("Can't sample " + node.getPath(), e);
        } catch (Exception e) {
            throw new SampleException("Can't create " + node.getPath(), e);
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
        List<GeneralMap<String, Object>> interfaces = new ArrayList<GeneralMap<String, Object>>();
        int offset = 0;
        while(true){
            OID lower = new OID(String.valueOf(offset));
            OID upper = new OID(String.valueOf(offset + PAGE_SIZE));
            List<GeneralMap<String, Object>> page = visitor.table("1.3.6.1.2.1.2.2", "if", lower, upper);
            interfaces.addAll(page);
            offset += page.size();
            if( page.isEmpty() ) break;
        }
        return interfaces;
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

    private CdpEntry[] convertCdps(List<GeneralMap<String, Object>> cdpTable) {
        CdpEntry[] entries = new CdpEntry[cdpTable.size()];
        for (int i = 0; i < cdpTable.size(); i++) {
            GeneralMap<String, Object> raw = cdpTable.get(i);
            CdpEntry entry = new CdpEntry();
            entries[i] = entry;
            entry.setAddress(raw.getString("Address"));
            entry.setAddressType(raw.getInteger("AddressType"));
            entry.setVersion(raw.getString("Version"));
            entry.setDeviceId(raw.getString("DeviceId"));
            entry.setDevicePort(raw.getString("DevicePort"));
            entry.setPlatform(raw.getString("Platform"));
            entry.setCapabilities(raw.getString("Capabilities"));
            entry.setNativeVLAN(raw.getInteger("NativeVLAN"));
        }
        return entries;
    }

}
