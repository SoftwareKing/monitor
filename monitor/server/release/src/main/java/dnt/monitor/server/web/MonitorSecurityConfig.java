/**
 * Developer: Kadvin Date: 15/1/22 下午12:36
 */
package dnt.monitor.server.web;

import net.happyonroad.spring.service.ServiceRegistry;
import net.happyonroad.event.SystemStartedEvent;
import net.happyonroad.platform.web.SpringSecurityConfig;
import net.happyonroad.platform.web.util.DelegateAuthenticationProvider;
import net.happyonroad.platform.web.util.DelegateUserDetailsService;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.DelegatingAuthenticationEntryPoint;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import java.util.LinkedHashMap;

/**
 * <h1>Monitor Server Security Configuration</h1>
 * 由于这个类是被 platform 构造的，而不是当前组件的application context构造的
 * 暂时不能 import/export 其他service
 */
@Configuration
public class MonitorSecurityConfig extends SpringSecurityConfig
        implements ApplicationListener<SystemStartedEvent>{

    private DelegateAuthenticationProvider delegateAuthenticationProvider;
    private DelegateUserDetailsService delegateUserDetailsService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        super.configure(auth);
        // 额外增加一个认证方式，原来的Default Authentication Provider关联到了当前的 DelegateUserDetailsService
        delegateAuthenticationProvider = new DelegateAuthenticationProvider();
        auth.authenticationProvider(delegateAuthenticationProvider);
    }

    @Override
    protected void configureBasic(HttpSecurity http) throws Exception {
        LinkedHashMap<RequestMatcher, AuthenticationEntryPoint> entryPoints = new LinkedHashMap<RequestMatcher, AuthenticationEntryPoint>();
        BasicAuthenticationEntryPoint basicEntryPoint = new BasicAuthenticationEntryPoint();
        //南向 web socket需要 basic 认证
        entryPoints.put(new AntPathRequestMatcher("/south"), basicEntryPoint);
        //南向 接口需要 basic 认证
        entryPoints.put(new AntPathRequestMatcher("/engine"), basicEntryPoint);
        DelegatingAuthenticationEntryPoint entryPoint = new DelegatingAuthenticationEntryPoint(entryPoints);
        entryPoint.setDefaultEntryPoint(new LoginUrlAuthenticationEntryPoint("/login.html"));
        http.httpBasic().realmName(realmName()).authenticationEntryPoint(entryPoint);
    }

    protected String realmName() {
        return "Monitor Server";
    }

    @Override
    protected void configureAuthorizeRequests(ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry authorizeRequests) throws Exception {
        super.configureAuthorizeRequests(authorizeRequests);
        //引擎注册接口不需要身份验证
        authorizeRequests.antMatchers(HttpMethod.POST, "/engine/self").anonymous();
        //其他南向接口需要身份验证(Basic方式)
        authorizeRequests.antMatchers("/engine/**").not().anonymous();

    }

    // 通过delegate机制，将user details service委托给monitor server应用层
    @Override
    protected UserDetailsService defaultUserDetailsService() {
        delegateUserDetailsService = new DelegateUserDetailsService();
        return delegateUserDetailsService;
    }

    @Override
    protected String[] csrfExcludeUrls() {
        return new String[]{"/south", "/north", "/engine"};
    }

    // 系统完全启动之后，再通过服务注册表获取到应用层的实现的相关服务
    @Override
    public void onApplicationEvent(SystemStartedEvent event) {
        ServiceRegistry registry = event.getSource().getRegistry();
        UserDetailsService userDetailsService = registry.getService(UserDetailsService.class, "operator");
        delegateUserDetailsService.setDelegate(userDetailsService);
        AuthenticationProvider southAuthenticationProvider = registry.getService(AuthenticationProvider.class, "south");
        delegateAuthenticationProvider.setDelegate(southAuthenticationProvider);
    }
}
