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


    @Override
    public MetaResource<? extends Device> recognizeByOID(String sysOid) {
        //TODO 根据devices.xml解析
        // 或者说，devices.xml的内容，需要和资源模型结合在一起，也是动态拼装;
        // 抑或，category/device-class需要有一个统计的机制，参考 nc8
        if( sysOid.equals("1.3.6.1.4.1.9.1.283"))
            return metaService.getMetaResource("/device/switch");
        else
            return metaService.getMetaResource("/device");
    }

    @Override
    public MetaResource<? extends Device> recognizeBySystem(String sysName) {
        if( sysName.equalsIgnoreCase("linux")){
            return metaService.getMetaResource("/device/host/linux");
        }else if( sysName.contains("windows")){
            return metaService.getMetaResource("/device/host/windows");
        }
        return metaService.getMetaResource("/device/host");
    }
}
