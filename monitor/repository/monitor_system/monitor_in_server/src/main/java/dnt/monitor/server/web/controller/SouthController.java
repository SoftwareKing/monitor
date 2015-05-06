/**
 * Developer: Kadvin Date: 15/1/6 下午1:44
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.server.model.EngineAuthentication;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.service.EngineService;
import net.happyonroad.platform.web.annotation.BeforeFilter;
import net.happyonroad.platform.web.controller.ApplicationController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;

/**
 * 所有的南向控制器的父类
 */
@RestController
public abstract class SouthController extends ApplicationController<MonitorEngine> {
    @Autowired
    protected EngineService engineService;
    protected MonitorEngine engine;

    @BeforeFilter(order = 10, value = {"update", "delete"})
//    public void initEngineByParam(@RequestParam(value = "engineId", required = false) String engineId){
//        engine = engineService.findByEngineId(engineId);
//    }
//    // 没对Spring Security做定制之前，无法实现南向单独的验证方式
//    // 暂时采用 url 上的 parameter 做引擎识别
//    @BeforeFilter(order = 10, value = {"not-work-now"})
    public void initEngine(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        String engineId;
        if (principal instanceof EngineAuthentication) {
            engine = ((EngineAuthentication) principal).getEngine();
        } else {
            engineId = principal.getName();
            engine = engineService.findByEngineId(engineId);
        }
    }
}
