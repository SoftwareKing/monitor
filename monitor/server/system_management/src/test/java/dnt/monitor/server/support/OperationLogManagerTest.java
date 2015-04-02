package dnt.monitor.server.support;

import dnt.monitor.server.model.OperationLog;
import dnt.monitor.server.service.OperationLogService;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.util.PageRequest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * 验证操作日志业务层各个方法的正确性
 *
 * @author Chris Zhu
 * @email zhulihongpm@163.com
 */

@ContextConfiguration(classes = OperationLogManagerConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class OperationLogManagerTest
{
    @Autowired
    private OperationLogService service;

    private PageRequest pageRequest;

    @Before
    public void setUp() throws Exception {
        pageRequest = new PageRequest(0, 1);
    }

    @Test
    public void testFindPaginationByPath() throws Exception
    {
        String path = "/not/exist";
        Page<OperationLog> logs = service.paginateByPath(path, pageRequest);
        Assert.assertTrue(logs.getTotalElements() == 0);
        Assert.assertTrue(logs.getTotalPages() == 0);
        Assert.assertFalse(logs.hasContent());
        path = "/default/engine";
        logs = service.paginateByPath(path, pageRequest);
        Assert.assertTrue(logs.getTotalElements() != 0);
        Assert.assertTrue(logs.getTotalPages() != 0);
        Assert.assertTrue(logs.hasContent());
    }
}
