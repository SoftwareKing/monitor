/**
 * Developer: Kadvin Date: 14/12/16 下午4:44
 */
package dnt.monitor.server.web.controller;

import net.happyonroad.platform.web.controller.ApplicationController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * 显示监控服务器当前用户的信息
 */
@RestController
@RequestMapping("/api/profile")
class ProfileController extends ApplicationController {
    @Autowired
    UserDetailsService userService;

    /**
     * <h2>查看当前的用户信息</h2>
     *
     * GET /api/profile
     *
     * @return 当前用户对象
     */
    @RequestMapping
    public UserDetails show(HttpServletRequest request) {
        String username = request.getRemoteUser();
        logger.info("Viewing profile of {}", username);
        UserDetails user = userService.loadUserByUsername(username);
        logger.info("Viewed  profile of {}", username);
        return user;
    }

}
