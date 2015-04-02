/**
 * Developer: Kadvin Date: 14/12/24 下午3:08
 */
package dnt.monitor.server.support;

import dnt.monitor.server.model.MonitorLog;
import dnt.monitor.server.repository.MonitorLogRepository;
import dnt.monitor.server.service.MonitorLogService;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.service.Pageable;
import net.happyonroad.platform.util.DefaultPage;
import net.happyonroad.spring.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 监控日志管理器(查询)
 */

@Service
class MonitorLogManager extends Bean implements MonitorLogService {
    @Autowired
    MonitorLogRepository repository;

    @Override
    public Page<MonitorLog> paginateByPath(String path, Pageable pageable) {
        long count = repository.countByPath(path);
        if( count > 0 ){
            List<MonitorLog> data = repository.findAllByPath(path, pageable);
            return new DefaultPage<MonitorLog>(data, pageable , count);
        }else {
            return new DefaultPage<MonitorLog>(new ArrayList<MonitorLog>(), pageable, 0);
        }
    }
}
