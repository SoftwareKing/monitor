/**
 * Developer: Kadvin Date: 15/1/28 下午3:10
 */
package dnt.monitor.server.support;

import dnt.monitor.server.service.OperatorService;
import net.happyonroad.platform.web.model.DefaultUser;
import net.happyonroad.spring.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * <h1>操作员管理</h1>
 */
@Service
class OperatorManager extends Bean implements OperatorService, UserDetailsService {
    static PasswordEncoder encoder = new StandardPasswordEncoder();

    private DefaultUser admin = new DefaultUser("admin", encoder.encode("secret"));
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // TODO 对接实际的操作员数据库
        if (username.equalsIgnoreCase("admin")) {
            return admin;
        }
        throw new UsernameNotFoundException("Support admin only now, your username is: " + username);
    }
}
