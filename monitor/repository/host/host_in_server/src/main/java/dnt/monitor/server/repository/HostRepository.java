/**
 * Developer: Kadvin Date: 14/12/26 上午11:17
 */
package dnt.monitor.server.repository;

import dnt.monitor.model.*;

/**
 * <h1>主机仓库</h1>
 *
 */
//@org.springframework.context.annotation.DependsOn("deviceRepository")
//由于单元测试环境不是将各个组件分开加载，而是混在一起
// 当单元测试类先加载 HostRepository，没有将DeviceRepository作为实例预先加载过
// 会导致 hostResult(extends deviceResult) 的这个映射由于 deviceResult在hostResult之后解析而不能解析成功
// 测试环境出现这个问题的根本原因，还是我们的Repository体系设计上，
// 各个Repository类，既可以作为实例服务，又可以作为下级类的父类
//现在在测试config里面解决该问题，而不是将该问题混到正式阶段
public interface HostRepository<H extends Host> extends DeviceRepository<H> {
    @Override
    void create(H resource);

    void createPartialHost(H host);

    void createCPU(CPU cpu);

    void createMemory(Memory memory);

    void createDisk(Disk disk);

    void createPartition(Partition partition);
}
