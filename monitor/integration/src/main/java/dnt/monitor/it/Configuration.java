/**
 * xiongjie on 14-8-11.
 */
package dnt.monitor.it;

import dnt.monitor.model.CsrfToken;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.codec.Base64;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;

/**
 * <h1>IT测试用例运行时的配置+运行状态</h1>
 */
public class Configuration {
    static PasswordEncoder encoder = new StandardPasswordEncoder();

    ////////////////////////////////////////////////////////////////////////////////////////////////
    /* 配置信息 */
    ////////////////////////////////////////////////////////////////////////////////////////////////

    // 被测试系统
    private String host;
    private int port;

    // 需要记录用户时的信息
    private String username;
    private String password;

    ////////////////////////////////////////////////////////////////////////////////////////////////
    /* 运行信息 */
    ////////////////////////////////////////////////////////////////////////////////////////////////


    private String sessionCookies;// 需要记录session时的信息
    private boolean logined;
    private CsrfToken csrf;


    public String getHost() {
        return host;
    }

    public Configuration host(String host) {
        this.host = host;
        return this;
    }

    public int getPort() {
        return port;
    }

    public Configuration port(int port) {
        this.port = port;
        return this;
    }

    public String getSessionCookies() {
        return sessionCookies;
    }

    public Configuration sessionCookies(String sessionCookies) {
        //System.out.println("cookies changed from " + this.sessionCookies + " to " + sessionCookies);
        this.sessionCookies = sessionCookies;
        return this;
    }

    public CsrfToken getCsrf() {
        return csrf;
    }

    public Configuration csrf(CsrfToken csrf) {
        this.csrf = csrf;
        return this;
    }

    public String getUsername() {
        return username;
    }

    public Configuration username(String username) {
        this.username = username;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public Configuration password(String password) {
        this.password = password;
        return this;
    }

    public boolean hasSessionCookies() {
        return this.sessionCookies != null;
    }

    public HttpHeaders requestHeaders() {
        HttpHeaders headers = new HttpHeaders();
        if( csrf != null )
            headers.add(csrf.getHeaderName(), csrf.getToken());
        if( hasSessionCookies() )
            headers.set("Cookie", getSessionCookies());
        return headers;
    }

    public boolean isLogined() {
        return logined;
    }

    public void logined() {
        this.logined = true;
    }

    public String asBasic() {
        String raw = getUsername() + ":" + encoder.encode(getPassword());
        return new String(Base64.encode(raw.getBytes()));
    }
}
