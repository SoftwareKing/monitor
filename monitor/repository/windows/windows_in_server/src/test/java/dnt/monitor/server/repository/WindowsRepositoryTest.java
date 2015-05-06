package dnt.monitor.server.repository;

import dnt.monitor.model.Host;
import dnt.monitor.model.WindowsHost;
import net.happyonroad.type.Availability;
import net.happyonroad.type.ConfigStatus;
import net.happyonroad.type.Performance;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Date;

import static org.junit.Assert.*;

@ContextConfiguration(classes = WindowsRepositoryConfig.class)
@ActiveProfiles({"test", "mysql"})
@RunWith(SpringJUnit4ClassRunner.class)
public class WindowsRepositoryTest {
    @Autowired
    WindowsRepository repository;

    WindowsHost host;

    @Before
    public void setUp() throws Exception {
        host = new WindowsHost();
        host.setType("/device/host/windows");
        host.setAddress("192.168.10.199");
        host.setLabel(host.getAddress());
        host.setDescription("A test host");
        host.setPerformance(Performance.Normal);
        host.setConfigStatus(ConfigStatus.Changed);
        host.setAvailability(Availability.Unavailable);
        host.setModelName("Dell 2800");
        host.setOs("Windows 2003 Server");
        host.setVersion("2003.12");
        host.setSerialNumber("1203920");
        host.setDomain("workstation");
        host.setUpTime("long long ago");
        host.setLocalTime(new Date());
        host.setProperty("test", "value");
    }

    @After
    public void tearDown() throws Exception {
        if (host.getId() != null) repository.deleteById(host.getId());
    }


    /**
     * 测试创建主机，应该会填充 resources + t_devices + t_hosts表
     * @throws Exception
     */
    @Test
    public void testCreate() throws Exception {
        //在 Windows Repository 里面，必须有 create 方法，否则将会被直接映射到 ResourceRepository.create
        /**
         * 参考: org.apache.ibatis.binding.MapperMethod#SqlCommand的构造函数
         *
         *  if (configuration.hasStatement(statementName)) {
         *    ms = configuration.getMappedStatement(statementName);
         *  } else if (!mapperInterface.equals(method.getDeclaringClass().getName())) { // issue #35
         *    String parentStatementName = method.getDeclaringClass().getName() + "." + method.getName();
         *    if (configuration.hasStatement(parentStatementName)) {
         *      ms = configuration.getMappedStatement(parentStatementName);
         *    }
         *  }
         *
         * 其若在 WindowsRepository里面找不到映射方法，就直接与method的declaring class里面的mapping绑定
         * 所以，解决这个bug的方法是:
         * 1. 在 WindowsRepository.xml 里面声明 create 映射           [经测试 ok]
         * 2. 在 其父接口中 HostRepository 里面声明 create 方法         [经测试 在测试环境下ok，真实环境下还是映射到根接口方法上去了]
         * 3. 改变 Mapper Proxy 的机制                               [暂无通道]
         */
        repository.create(host);
        assertNotNull(host.getId());

        Host created = repository.findById(host.getId());
        assertEquals(host, created);
    }

}