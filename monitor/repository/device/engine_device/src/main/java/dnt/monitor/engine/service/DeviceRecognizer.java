package dnt.monitor.engine.service;

import dnt.monitor.meta.MetaResource;
import dnt.monitor.model.Device;

/**
 * <h1>设备识别接口</h1>
 *
 * @author Jay Xiong
 */
public interface DeviceRecognizer {
    /**
     * 根据设备的sys oid，识别设备类型
     *
     * @param sysOid SNMP sys oid
     * @return 设备类型
     */
    MetaResource<? extends Device> recognizeByOID(String sysOid);

    /**
     * 根据设备的uname，识别设备类型
     *
     * @param sysName 通过Linux `uname` 获得的os名称
     * @return 设备类型
     */
    MetaResource<? extends Device> recognizeBySystem(String sysName);
}
