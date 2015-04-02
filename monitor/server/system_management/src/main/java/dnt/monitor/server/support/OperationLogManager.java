package dnt.monitor.server.support;

import dnt.monitor.server.model.OperationLog;
import dnt.monitor.server.repository.OperationLogRepository;
import dnt.monitor.server.service.OperationLogService;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.service.Pageable;
import net.happyonroad.platform.util.DefaultPage;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 操作日志的业务实现
 *
 * @author Chris Zhu
 * @email  zhulihongpm@163.com
 */

@Service
class OperationLogManager extends Bean implements OperationLogService
{
    @Autowired
    private OperationLogRepository repository;

    public Page<OperationLog> paginateByPath(String path, Pageable pageable)
    {
        long count = repository.countByPath(path);
        if( count > 0 )
        {
            List<OperationLog> logs = repository.findPaginationByPath(path, pageable);
            return new DefaultPage<OperationLog>(logs, pageable , count);
        }
        else
        {
            return new DefaultPage<OperationLog>(new ArrayList<OperationLog>(), pageable, 0);
        }
    }
}
