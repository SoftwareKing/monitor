/**
 * Developer: Kadvin Date: 15/1/9 下午9:46
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.service.EngineService;
import net.happyonroad.platform.web.controller.ApplicationController;
import net.happyonroad.platform.web.exception.WebServerSideException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * <h1>引擎控制器</h1>
 * <pre>
 * <b>HTTP    URI                                方法      含义  </b>
 *  PUT      /api/engines/{engineId}/approve     approve  管理员批准某个注册的引擎
 *              ?name={string}
 *              &label={string}
 *  DELETE   /api/engines/{engineId}/reject      reject   管理员拒绝某个注册的引擎
 * </pre>
 */
@RestController
@RequestMapping("/api/engines/{engineId}")
class EnginesController extends ApplicationController<MonitorEngine> {
    @Autowired
    EngineService engineService;

    @RequestMapping(value = "approve", method = RequestMethod.PUT)
    public MonitorEngine approve(@PathVariable("engineId") String engineId,
                                 @RequestParam("name") String name,
                                 @RequestParam("label") String label) {
        MonitorEngine engine = engineService.findByEngineId(engineId);
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

    @RequestMapping(value = "reject", method = RequestMethod.PUT)
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
}
