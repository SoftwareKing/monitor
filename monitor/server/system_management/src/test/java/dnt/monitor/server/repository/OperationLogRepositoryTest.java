package dnt.monitor.server.repository;

import dnt.monitor.server.model.OperationLog;
import net.happyonroad.platform.util.PageRequest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

/**
 * 验证操作日志数据访问层各个方法的正确性
 *
 * @author Chris Zhu
 * @email zhulihongpm@163.com
 */

@ContextConfiguration(classes = OperationLogRepositoryConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class OperationLogRepositoryTest
{
    @Autowired
    private OperationLogRepository repository;

    private PageRequest pageRequest;

    @Before
    public void setUp() throws Exception {
        pageRequest = new PageRequest(0, 1);
    }

    @Test
    public void testFindPaginationByPath()
    {
        String path = "/not/exist";
        long count = repository.countByPath(path);
        List<OperationLog> logs = repository.findPaginationByPath(path, pageRequest);
        Assert.assertTrue(count == 0);
        Assert.assertTrue(logs.isEmpty());
        path = "/default/engine";
        count = repository.countByPath(path);
        logs = repository.findPaginationByPath(path, pageRequest);
        Assert.assertTrue(count != 0);
        Assert.assertFalse(logs.isEmpty());
    }
}
