package dnt.monitor.server.repository;

import dnt.monitor.model.Switch;

/**
 * <h1>交换机仓库</h1>
 *
 * @author Jay Xiong
 */
public interface SwitchRepository<S extends Switch> extends DeviceRepository<S>  {
    /**
     * <h2>创建t_switches里面的局部记录</h2>
     * 这个操作主要是当资源类型由Device -> Switch时，在t_switches表里面，补齐原对象类型欠缺的数据
     *
     * @param theSwitch 交换机对象
     */
    void createPartialSwitch( S theSwitch);
}
