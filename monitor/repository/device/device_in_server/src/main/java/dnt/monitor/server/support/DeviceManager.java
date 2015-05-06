/**
 * Developer: Kadvin Date: 15/3/5 上午9:12
 */
package dnt.monitor.server.support;

import dnt.monitor.model.Device;
import dnt.monitor.model.NIC;
import dnt.monitor.model.Resource;
import dnt.monitor.model.Service;
import dnt.monitor.server.repository.DeviceRepository;
import dnt.monitor.server.service.DeviceService;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jmx.export.annotation.ManagedResource;

import java.util.Collections;
import java.util.List;

/**
 * <h1>设备管理的实现类</h1>
 */
@org.springframework.stereotype.Service
@ManagedResource(objectName = "dnt.monitor.server:type=extension,name=deviceService")
class DeviceManager<D extends Device> extends ResourceManager<D> implements DeviceService<D> {
    @Autowired
    public DeviceManager(@Qualifier("deviceRepository") DeviceRepository<D> repository) {
        super(repository);
    }

    protected DeviceRepository<D> getRepository(){
        return (DeviceRepository<D>) super.getRepository();
    }

    @Override
    public Class<? extends Resource> getResourceType() {
        return Device.class;
    }

    @Override
    public D findWithAddress(String address) {
        logger.debug("Finding device with {}", address);
        D device = getRepository().findWithAddress(address);
        if( device == null ){
            logger.debug("Found  no device with address {}", address);
        }else{
            logger.debug("Found  {} with address {}", device, address);
        }
        return device;
    }

    @Override
    public List<D> findAllInAddresses(List<String> addresses, Device except){
        String stringAddresses = StringUtils.join(addresses, ",");
        logger.debug("Finding devices in {}, except {}", stringAddresses, except);
        List<D> devices = getRepository().findAllInAddresses(addresses, except.getId());
        logger.debug("Found {} devices in {}, except {}", devices.size(), stringAddresses, except);
        return devices;
    }

    @Override
    public D findByAddress(String address) {
        D device = super.findByAddress(address);
        if( device == null )
            throw new IllegalArgumentException("Can't find device with address = " + address);
        return device;
    }

    @Override
    protected void performUpdate(Resource legacy, D updating) {
        if( !Device.class.isAssignableFrom(legacy.getClass()) ){
            getRepository().createPartialDevice(updating);
        }
        super.performUpdate(legacy, updating);
        List<NIC> legacyInterfaces = null;
        if( legacy instanceof Device){
            legacyInterfaces = ((Device) legacy).getInterfaces();
        }
        if( legacyInterfaces == null ) legacyInterfaces = Collections.emptyList();

        //处理网卡组件
        for(NIC nic : legacyInterfaces ){
            NIC newNIC = findNIC(nic.getIndex(), updating.getInterfaces());
            if( newNIC != null ){
                newNIC.setId(nic.getId());
                newNIC.setResource(updating);
                updateNIC(newNIC);

            }else{
                getRepository().deleteNIC(nic);
            }
        }
        if( updating.getInterfaces() != null ) for(NIC nic : updating.getInterfaces()){
            NIC oldNIC = findNIC(nic.getIndex(), legacyInterfaces);
            if( oldNIC == null ){
                nic.setResource(updating);
                createNIC(nic);
            }//else skip it, because we have update them in previous step
        }
        //TODO 处理IP服务组件
    }

    private void createNIC(NIC nic) {
        //TODO 应该做模型完整性校验
        if(nic.getAddress() != null )
            getRepository().createNIC(nic);
    }

    private void updateNIC(NIC newNIC) {
        //TODO 应该通过模型完整性校验
        if(newNIC.getAddress() != null )
            getRepository().updateNIC(newNIC);
    }

    private NIC findNIC(int index, List<NIC> interfaces) {
        for (NIC nic : interfaces) {
            if( nic.getIndex() == index) return nic;
        }
        return null;
    }

    protected void cascadeCreate(D device){
        if(device.getInterfaces() != null )
            for (NIC nic : device.getInterfaces()) {
                nic.setResource(device);
                createNIC(nic);
            }
        if( device.getServices() != null )
            for (Service service : device.getServices()) {
                service.setResource(device);
                getRepository().createService(service);
            }
    }

    protected void assemble(D device){
        if(device.getInterfaces() != null ) for(NIC nic: device.getInterfaces()){
            associate(device, nic);
        }
        if(device.getServices() != null ) for(Service service: device.getServices()){
            associate(device, service);
        }

    }
}
