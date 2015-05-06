/**
 * Developer: Kadvin Date: 14/12/24 下午3:13
 */
package dnt.monitor.server.web.controller;

import net.happyonroad.model.Record;
import net.happyonroad.platform.web.annotation.BeforeFilter;
import net.happyonroad.platform.web.controller.ApplicationController;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.servlet.HandlerMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * 能够为 /api/xxx/** 读取目标path的基础控制器
 */
public class GreedyPathController<T extends Record> extends ApplicationController<T> {
    protected String      targetPath;

    /**
     * <h2>获取Request中的path</h2>
     * @param request 请求
     */
    @BeforeFilter(order = 50)
    public void initTargetPath(HttpServletRequest request) {
        String path = (String) request.getAttribute(
                HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String bestMatchPattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);

        AntPathMatcher apm = new AntPathMatcher();
        targetPath = "/" + apm.extractPathWithinPattern(bestMatchPattern, path);
        if( targetPath.contains("&") ){
            targetPath = targetPath.substring(0, targetPath.indexOf('&'));
        }
    }
}
