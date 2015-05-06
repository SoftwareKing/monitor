package dnt.monitor.engine.support;

import dnt.monitor.engine.service.DeviceRecognizer;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Device;
import dnt.monitor.service.MetaService;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <h1>缺省的设备识别对象</h1>
 *
 * @author Jay Xiong
 */
@SuppressWarnings("unchecked")
@Component
class DefaultDeviceRecognizer extends Bean implements DeviceRecognizer{
    @Autowired
    MetaService metaService;

    //1.3.6.1.4.1.8072.3.2.3
    //1.3.6.1.4.1.2011.2.23.145
    //1.3.6.1.4.1.12325.1.1.2.1.1
    //1.3.6.1.4.1.3454
    //1.3.6.1.4.1.1347.41  -> Kyocera Printer
    @Override
    public MetaResource<? extends Device> recognizeByOID(String sysOid) {
        //TODO 根据devices.xml解析
        // 或者说，devices.xml的内容，需要和资源模型结合在一起，也是动态拼装;
        // 抑或，category/device-class需要有一个统计的机制，参考 nc8
        if(sysOid == null ) sysOid = "<null>" ;//TO Avoid null
        if( sysOid.equals("1.3.6.1.4.1.9.1.283"))
            return metaService.getMetaResource("/device/switch");
        else if(sysOid.equals("1.3.6.1.4.1.311.1.1.3.1.1") ||
                sysOid.equals("1.3.6.1.4.1.311.1.1.3.2") || /*Win 95/98*/
                sysOid.equals("1.3.6.1.4.1.99.1.1.3.11") || /*Windows Workstation*/
                sysOid.equals("1.3.6.1.4.1.311.1.1.3.1.2") ||
                sysOid.equals("1.3.6.1.4.1.311.1.1.3.1.3") /*Windows Server*/
                ) {
            return metaService.getMetaResource("/device/host/windows");
        }else if(sysOid.equals("1.3.6.1.4.1.8072.3.2.255")){
            return metaService.getMetaResource("/device/host/osx");
        }else if(sysOid.equals("1.3.6.1.4.1.8072.3.2.10")){
            return metaService.getMetaResource("/device/host/linux");
        } else{
            logger.warn("Found a un-recognized device oid = {}", sysOid);
            return metaService.getMetaResource("/device");
        }
    }

    @Override
    public MetaResource<? extends Device> recognizeBySystem(String sysName) {
        if( sysName.equalsIgnoreCase("linux")){
            return metaService.getMetaResource("/device/host/linux");
        }else if( sysName.contains("windows")){
            return metaService.getMetaResource("/device/host/windows");
        }else if( sysName.contains("Darwin")){
            return metaService.getMetaResource("/device/host/osx");
        } else{
            logger.warn("Found a un-recognized device sysName = {}", sysName);
            return metaService.getMetaResource("/device/host");
        }
    }
}
