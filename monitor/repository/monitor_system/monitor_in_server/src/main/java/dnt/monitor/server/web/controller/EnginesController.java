/**
 * Developer: Kadvin Date: 15/1/9 下午9:46
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.service.EngineService;
import net.happyonroad.platform.web.controller.ApplicationController;
import net.happyonroad.platform.web.exception.WebServerSideException;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

/**
 * <h1>北向引擎控制器</h1>
 *
 * 引擎是一种特殊的节点，所以提供如下特殊api来操作；
 * 而不是像其他类型的对象，要求前端用户按照普通的节点管理引擎
 *
 * <pre>
 * <b>HTTP    URI                                方法      含义  </b>
 *  POST     /api/engines/                       create   管理员手工添加某个监控引擎
 *  PUT      /api/engines/{engineId}/approve     approve  管理员批准某个注册的引擎
 *              ?name={string}
 *              &label={string}
 *  DELETE   /api/engines/{engineId}/reject      reject   管理员拒绝某个注册的引擎
 * </pre>
 */
@RestController
@RequestMapping("/api/engines/")
class EnginesController extends ApplicationController<MonitorEngine> {
    @Autowired
    EngineService engineService;

    @RequestMapping(method = RequestMethod.POST)
    public MonitorEngine create(@RequestBody MonitorEngine engine){/*由于此地业务上有自行设置地址的情况，所以不增加 @Valid 标记*/
        logger.info("Manual Creating {}", engine);
        try {
            autoAssignAddress(engine);
            MonitorEngine created = engineService.create(engine);
            logger.info("Manual Created  {}", engine);
            return created;
        } catch (ResourceException e) {
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR,
                                             "Can't create the engine: " + e.getMessage());
        }
    }

    @RequestMapping(value = "{engineId}/approve", method = RequestMethod.PUT)
    public MonitorEngine approve(@PathVariable("engineId") String engineId,
                                 @RequestParam(value = "name", required = false) String name,
                                 @RequestParam(value = "label", required = false) String label) {
        MonitorEngine engine = engineService.findByEngineId(engineId);
        if( StringUtils.isBlank(name) ) name = engine.getName();
        if( StringUtils.isBlank(label) ) label = engine.getLabel();
        logger.info("Approving {} with name = {}, label = {}", engine, name, label);
        try {
            MonitorEngine approved = engineService.approve(engine, name, label);
            logger.info("Approved  {} with name = {}, label = {}", approved, name, label);
            return approved;
        } catch (ResourceException e) {
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR,
                                             "Can't approve the engine: " + e.getMessage());
        }
    }

    @RequestMapping(value = "{engineId}/reject", method = RequestMethod.PUT)
    public MonitorEngine reject(@PathVariable("engineId") String engineId) {
        MonitorEngine engine = engineService.findByEngineId(engineId);
        logger.info("Rejecting {}", engine);
        try {
            MonitorEngine rejected = engineService.reject(engine);
            logger.info("Rejected  {}", rejected);
            return rejected;
        } catch (ResourceException e) {
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Can't reject the engine: " + e.getMessage());
        }
    }

    private void autoAssignAddress(MonitorEngine engine) {
        if (StringUtils.isNotBlank(engine.getAddress())) return;
        //随便设置一个1000+的端口
        int randomPort = new Random().nextInt(64534) + 1001;
        engine.setAddress("0.0.0.0:" + randomPort);
    }

}
