/**
 * Developer: Kadvin Date: 14/12/26 上午11:16
 */
package dnt.monitor.server.support;

import dnt.monitor.model.*;
import dnt.monitor.model.Process;
import dnt.monitor.server.repository.HostRepository;
import dnt.monitor.server.service.HostService;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.service.Pageable;
import net.happyonroad.platform.util.DefaultPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jmx.export.annotation.ManagedResource;

import java.util.ArrayList;
import java.util.List;

/**
 * <h2>主机管理的实现类</h2>
 */
@org.springframework.stereotype.Service
@ManagedResource(objectName = "dnt.monitor.server:type=extension,name=hostService")
class HostManager<H extends Host> extends DeviceManager<H> implements HostService<H> {

    @Autowired
    public HostManager( @Qualifier("hostRepository") HostRepository<H> repository) {
        super(repository) ;
    }

    protected HostRepository<H> getRepository(){
        return (HostRepository<H>) super.getRepository();
    }

    @Override
    public Class<? extends Resource> getResourceType() {
        return Host.class;
    }

    @Override
    public Page<H> paginateByKeyword(String keyword, Pageable request) {
        long count = getRepository().countByKeyword(keyword);
        if( count > 0 ){
            List<H> data = getRepository().findAllByKeyword(keyword, request);
            processList(data);
            return new DefaultPage<H>(data, request , count);
        }else {
            return new DefaultPage<H>(new ArrayList<H>(), request, 0);
        }
    }

    @Override
    public void cascadeCreate(H host) {
        super.cascadeCreate(host);
        //注意：
        //  如果是一般通过界面创建对象的情况，输入的主机的都没有组件
        //    对于这种情况，本函数的作用与ResourceManager的create函数作用等价
        //    能够正确的保存Host对象到resources, t_hosts表（基于 hostRepository)的功能
        //  Engine在进行网络搜索时，可能将发现的主机，部分信息直接关联/映射成为子组件
        //    那么此时，下面的函数才有真正发挥的空间
        if(host.getCPU() != null )
        {
            host.getCPU().setResource(host);
            getRepository().createCPU(host.getCPU());
        }
        if(host.getCPUs() != null )
            for (CPU cpu : host.getCPUs()) {
                cpu.setResource(host);
                getRepository().createCPU( cpu);
            }
        if(host.getMemory() != null )
        {
            host.getMemory().setResource(host);
            getRepository().createMemory(host.getMemory());
        }
        if(host.getDisks() != null )
            for (Disk disk : host.getDisks()) {
                disk.setResource(host);
                getRepository().createDisk(disk);
            }
        if(host.getPartitions() != null )
            for (Partition partition : host.getPartitions()) {
                partition.setResource(host);
                getRepository().createPartition(partition);
            }
    }

    @Override
    protected void performUpdate(Resource legacy, H updating) {
        if( !Host.class.isAssignableFrom(legacy.getClass()) ){
            getRepository().createPartialHost(updating);
        }
        super.performUpdate(legacy, updating);
    }

    // 暂时不能很好的掌控 Mybatis 的 Repository，让其为我们构建好对象之间的关系
    // 所以就在Service层自行组装Host里面的Component/Link之间的关系
    protected void assemble(H host){
        super.assemble(host);
        if( host.getCPU() != null){
            associate(host, host.getCPU());
        }
        if(host.getCPUs() != null) for (CPU cpu : host.getCPUs()) {
            associate(host, cpu);
        }
        if(host.getMemory() != null ){
            associate(host, host.getMemory());
        }
        if(host.getDisks() != null ) for(Disk disk : host.getDisks()){
            associate(host, disk);
        }
        if(host.getPartitions() != null ) for(Partition partition : host.getPartitions()){
            associate(host, partition);
        }
        if(host.getProcesses() != null ) for(Process process: host.getProcesses()){
            associate(host, process);
        }

    }
}
