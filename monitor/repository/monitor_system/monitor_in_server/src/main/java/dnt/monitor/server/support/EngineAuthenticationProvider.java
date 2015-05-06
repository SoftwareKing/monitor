/**
 * Developer: Kadvin Date: 15/1/28 下午3:03
 */
package dnt.monitor.server.support;

import dnt.monitor.server.exception.RecordNotFoundException;
import dnt.monitor.server.model.EngineAuthentication;
import dnt.monitor.model.MonitorEngine;
import dnt.monitor.server.service.EngineService;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

/**
 * <h1>实现对引擎的认证</h1>
 */
@Service
class EngineAuthenticationProvider implements AuthenticationProvider{
    static PasswordEncoder encoder = new StandardPasswordEncoder();
    @Autowired
    EngineService engineService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String engineId = authentication.getName();
        try {
            MonitorEngine engine = engineService.findByEngineId(engineId);
            //引擎传来的密码是加密过的 api token
            //数据库里面是原始的api token
            //这样设计是为了防止传输中的泄密
            if( authentication.getCredentials() == null )
                throw new BadCredentialsException("No credential");
            if( engine.isRejected()){
                throw new LockedException("The engine is rejected by monitor server");
            }
            Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
            authorities.add(new SimpleGrantedAuthority("Engine"));
            if(StringUtils.isEmpty(engine.getApiToken())){
                authorities.add(new SimpleGrantedAuthority("PendingEngine"));
            }else if( encoder.matches(engine.getApiToken(), authentication.getCredentials().toString()) ){
                //需要设置为已经验证，否则稍后还要验证，但credentials又已经被清空
                if( engine.isApproved() ) {
                    authorities.add(new SimpleGrantedAuthority("ApprovedEngine"));
                } else {//照理来说，有密码，就不应该再pending了，这里不会走到
                    authorities.add(new SimpleGrantedAuthority("PendingEngine"));
                }
                if( engine.isDefault() ){//为缺省引擎增加一个额外的权限
                    authorities.add(new SimpleGrantedAuthority("DefaultEngine"));
                }
            }else{
                throw new BadCredentialsException("The engine credential is incorrect");
            }
            return new EngineAuthentication(engine, authorities);
        } catch (RecordNotFoundException e) {
            throw new UsernameNotFoundException("There is no engine with id = " + engineId);
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
