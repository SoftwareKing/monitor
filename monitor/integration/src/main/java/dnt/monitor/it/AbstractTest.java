/**
 * xiongjie on 14-8-11.
 */
package dnt.monitor.it;

import dnt.monitor.model.CsrfToken;
import net.happyonroad.util.ParseUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.junit.Assert;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.*;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * <h1>所有测试用例共享的基类</h1>
 * <p/>
 * 由于该类需要被其他maven模块继承
 * 所以，它需要被放置于src目录，以便其他模块可见
 */
public abstract class AbstractTest extends DefaultResponseErrorHandler implements RestOperations {
    private static RestTemplate template = new RestTemplate();

    //为了支持 HierarchicalContextRunner，这些共享变量必须静态化
    protected Configuration configuration = new Configuration();
    protected Configuration engineConfiguration = new Configuration();

    private boolean posted = false;

    public AbstractTest() {
        configure(configuration);
        configure(engineConfiguration);
        engineConfiguration.username(null).password(null);
        template.setErrorHandler(this);
    }

    protected static void configure(Configuration configuration) {
        configuration
                .host(getValue("it.host", "localhost"))
                .port(Integer.valueOf(getValue("it.port", "8070")))
                .username(getValue("it.user", "admin"))
                .password(getValue("it.password", "secret"));
    }

    protected static String getValue(String name, String defaultValue){
        String property = System.getProperty(name, System.getenv(defaultValue));
        if( property == null ) return defaultValue;
        return property;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    /* 错误处理 */
    ////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        List<String> body = IOUtils.readLines(response.getBody());
        String text = StringUtils.join(body, "\n");
        try{
            Map result = ParseUtils.parseJson(text, Map.class);
            Object error = result.get("error");
            if( error == null ) throw new Exception();
            System.err.println("Error reason is");
            System.err.println(error);
        }catch (Exception ex){
            System.err.println(text);
        }
        super.handleError(response);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    /* url组装 */
    ////////////////////////////////////////////////////////////////////////////////////////////////

    protected String assemble(String url) {
        if( url.startsWith("http://") || url.startsWith("https://")) return url;
        return "http://" + configuration.getHost() + ":" + configuration.getPort()
                + (url.startsWith("/") ? url : "/" + url);
    }

    protected URI assemble(URI url) {
        String str = url.toString();
        if( str.startsWith("http://") || str.startsWith("https://")) return url;
        try {
            return new URI(assemble(url.toString()));
        } catch (URISyntaxException e) {
            System.err.println("Can't add host/port prefix for: " + url);
            return url;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    /* 高级封装 */
    ////////////////////////////////////////////////////////////////////////////////////////////////

    @SuppressWarnings("UnusedDeclaration")
    protected void withCsrf(final Job job) {
      withCsrf(new Callback<Object>() {
          @Override
          public Object perform(HttpHeaders headers) {
              job.perform(headers);
              return null;
          }
      });
    }

    protected <T> T withCsrf(Callback<T> callback) {
        if (configuration.getCsrf() == null) {
            HttpHeaders headers = configuration.requestHeaders();
            HttpEntity entity = new HttpEntity(headers);
            ResponseEntity<CsrfToken> response = getForEntity("/security/csrf", CsrfToken.class, entity);
            configuration.csrf(response.getBody());
            // 登录等前后会由服务器端发起改变cookie，所以，是否有cookie，不由客户端决定，而是由服务器端决定
            String newCookies = response.getHeaders().getFirst("Set-Cookie");
            if (newCookies != null ) {
                configuration.sessionCookies(newCookies);
            }
        }
        try {
            return callback.perform(configuration.requestHeaders());
        } finally {
            if (posted) {
                configuration.csrf(null);
            }
            this.posted = false;
        }
    }

    @SuppressWarnings("UnusedDeclaration")
    protected void withLoginUser(final Job job){
        withLoginUser(new Callback<Object>() {
            @Override
            public Object perform(HttpHeaders headers) {
                job.perform(headers);
                return null;
            }
        });
    }

    protected <T> T withLoginUser(Callback<T> callback){
        if( !configuration.isLogined() ){
            withCsrf(new Callback<URI>() {
                public URI perform(HttpHeaders headers) {
                    HttpEntity request = new HttpEntity(headers);
                    ResponseEntity<String> response = postForEntity("/api/session?username={username}&password={password}",
                            request, String.class, configuration.getUsername(), configuration.getPassword());
                    //登录成功之后，改变session
                    String newCookies = response.getHeaders().getFirst("Set-Cookie");
                    if (newCookies != null ) {
                        configuration.sessionCookies(newCookies);
                    }
                    return response.getHeaders().getLocation();
                }
            });
            configuration.logined();
        }
        return withCsrf(callback);
    }

    protected void withLoginEngine(final Job job){
        withLoginEngine(new Callback<Void>() {
            @Override
            public Void perform(HttpHeaders headers) {
                job.perform(headers);
                return null;
            }
        });
    }


    protected <T> T withLoginEngine(final Callback<T> callback){
        if( !engineConfiguration.isLogined() ){
            if( StringUtils.isBlank(engineConfiguration.getUsername()))
                throw new IllegalStateException("The engineId is not configured");
            if( StringUtils.isBlank(engineConfiguration.getPassword()))
                throw new IllegalStateException("The apiToken is not configured");

            HttpHeaders headers = engineConfiguration.requestHeaders();
            // 以 basic authentication 方式获得身份认证
            headers.set("Authorization", "Basic " + engineConfiguration.asBasic());
            HttpEntity entity = new HttpEntity(headers);
            //随便访问一个会产生会话的url
            ResponseEntity<CsrfToken> response = getForEntity("/security/csrf", CsrfToken.class, entity);
            engineConfiguration.csrf(response.getBody());
            // 登录等前后会由服务器端发起改变cookie，所以，是否有cookie，不由客户端决定，而是由服务器端决定
            String newCookies = response.getHeaders().getFirst("Set-Cookie");
            if (newCookies != null ) {
                engineConfiguration.sessionCookies(newCookies);
            }
            engineConfiguration.logined();
        }

        HttpHeaders headers = engineConfiguration.requestHeaders();
        headers.set("Authorization", "Basic " + engineConfiguration.asBasic());
        return callback.perform(headers);
    }


    @Override
    public <T> T getForObject(String url, Class<T> responseType, Object... uriVariables) throws RestClientException {
        try {
            return template.getForObject(assemble(url), responseType, uriVariables);
        } finally {
            this.normal();
        }
    }

    public <T> T getForObject(String url, Class<T> responseType, HttpEntity request, Object... uriVariables) throws RestClientException {
        try {
            ResponseEntity<T> response = exchange(url, HttpMethod.GET, request, responseType, uriVariables);
            return response.getBody();
        } finally {
            this.normal();
        }
    }

    @Override
    public <T> T getForObject(String url, Class<T> responseType, Map<String, ?> uriVariables) throws RestClientException {
        try {
            return template.getForObject(assemble(url), responseType, uriVariables);
        } finally {
            this.normal();
        }
    }

    public <T> T getForObject(String url, Class<T> responseType, HttpEntity request, Map<String, ?> uriVariables) throws RestClientException {
        try {
            ResponseEntity<T> response = exchange(url, HttpMethod.GET, request, responseType, uriVariables);
            return response.getBody();
        } finally {
            this.normal();
        }
    }

    @Override
    public <T> T getForObject(URI url, Class<T> responseType) throws RestClientException {
        try {
            return template.getForObject(assemble(url), responseType);
        } finally {
            this.normal();
        }
    }

    @Override
    public <T> ResponseEntity<T> getForEntity(String url, Class<T> responseType, Object... uriVariables) throws RestClientException {
        try {
            return template.getForEntity(assemble(url), responseType, uriVariables);
        } finally {
            this.normal();
        }
    }

    public <T> ResponseEntity<T> getForEntity(String url, Class<T> responseType, HttpEntity request, Object... uriVariables) throws RestClientException {
        try {
            return exchange(assemble(url), HttpMethod.GET, request, responseType, uriVariables);
        } finally {
            this.normal();
        }
    }

    @Override
    public <T> ResponseEntity<T> getForEntity(String url, Class<T> responseType, Map<String, ?> uriVariables) throws RestClientException {
        try {
            return template.getForEntity(assemble(url), responseType, uriVariables);
        } finally {
            this.normal();
        }
    }

    public <T> ResponseEntity<T> getForEntity(String url, Class<T> responseType, HttpEntity request, Map<String, ?> uriVariables) throws RestClientException {
        try {
            return exchange(assemble(url), HttpMethod.GET, request, responseType, uriVariables);
        } finally {
            this.normal();
        }
    }

    @Override
    public <T> ResponseEntity<T> getForEntity(URI url, Class<T> responseType) throws RestClientException {
        try {
            return template.getForEntity(assemble(url), responseType);
        } finally {
            this.normal();
        }
    }

    public <T> ResponseEntity<T> getForEntity(URI url, Class<T> responseType, HttpEntity request) throws RestClientException {
        try {
            return exchange(assemble(url), HttpMethod.GET, request, responseType);
        } finally {
            this.normal();
        }
    }

    @Override
    public HttpHeaders headForHeaders(String url, Object... uriVariables) throws RestClientException {
        try {
            return template.headForHeaders(assemble(url), uriVariables);
        } finally {
            this.normal();
        }
    }

    @Override
    public HttpHeaders headForHeaders(String url, Map<String, ?> uriVariables) throws RestClientException {
        try {
            return template.headForHeaders(assemble(url), uriVariables);
        } finally {
            this.normal();
        }
    }

    @Override
    public HttpHeaders headForHeaders(URI url) throws RestClientException {
        try {
            return template.headForHeaders(assemble(url));
        } finally {
            this.normal();
        }
    }

    @Override
    public URI postForLocation(String url, Object request, Object... uriVariables) throws RestClientException {
        try {
            return template.postForLocation(assemble(url), request, uriVariables);
        } finally {
            this.posted();
        }
    }

    @Override
    public URI postForLocation(String url, Object request, Map<String, ?> uriVariables) throws RestClientException {
        try {
            return template.postForLocation(assemble(url), request, uriVariables);
        } finally {
            this.posted();
        }
    }

    @Override
    public URI postForLocation(URI url, Object request) throws RestClientException {
        try {
            return template.postForLocation(assemble(url), request);
        } finally {
            this.posted();
        }
    }

    @Override
    public <T> T postForObject(String url, Object request, Class<T> responseType, Object... uriVariables) throws RestClientException {
        try {
            return template.postForObject(assemble(url), request, responseType, uriVariables);
        } finally {
            this.posted();
        }
    }

    @Override
    public <T> T postForObject(String url, Object request, Class<T> responseType, Map<String, ?> uriVariables) throws RestClientException {
        try {
            return template.postForObject(assemble(url), request, responseType, uriVariables);
        } finally {
            this.posted();
        }
    }

    @Override
    public <T> T postForObject(URI url, Object request, Class<T> responseType) throws RestClientException {
        try {
            return template.postForObject(assemble(url), request, responseType);
        } finally {
            this.posted();
        }
    }

    @Override
    public <T> ResponseEntity<T> postForEntity(String url, Object request, Class<T> responseType, Object... uriVariables) throws RestClientException {
        try {
            return template.postForEntity(assemble(url), request, responseType, uriVariables);
        } finally {
            this.posted();
        }
    }

    @Override
    public <T> ResponseEntity<T> postForEntity(String url, Object request, Class<T> responseType, Map<String, ?> uriVariables) throws RestClientException {
        try {
            return template.postForEntity(assemble(url), request, responseType, uriVariables);
        } finally {
            this.posted();
        }
    }

    @Override
    public <T> ResponseEntity<T> postForEntity(URI url, Object request, Class<T> responseType) throws RestClientException {
        try {
            return template.postForEntity(assemble(url), request, responseType);
        } finally {
            this.posted();
        }
    }

    @Override
    public void put(String url, Object request, Object... uriVariables) throws RestClientException {
        try {
            template.put(assemble(url), request, uriVariables);
        } finally {
            this.posted();
        }
    }

    @Override
    public void put(String url, Object request, Map<String, ?> uriVariables) throws RestClientException {
        try {
            template.put(assemble(url), request, uriVariables);
        } finally {
            this.posted();
        }
    }

    @Override
    public void put(URI url, Object request) throws RestClientException {
        try {
            template.put(assemble(url), request);
        } finally {
            this.posted();
        }
    }

    @Override
    public void delete(String url, Object... uriVariables) throws RestClientException {
        try {
            template.delete(assemble(url), uriVariables);
        } finally {
            this.posted();
        }
    }

    public void delete(String url, HttpEntity<?> request, Object... uriVariables) throws RestClientException {
        try {
            exchange(url, HttpMethod.DELETE, request, Object.class, uriVariables);
        } finally {
            this.posted();
        }
    }

    @Override
    public void delete(String url, Map<String, ?> uriVariables) throws RestClientException {
        try {
            template.delete(assemble(url), uriVariables);
        } finally {
            this.posted();
        }
    }

    @Override
    public void delete(URI url) throws RestClientException {
        try {
            template.delete(assemble(url));
        } finally {
            this.posted();
        }
    }

    @Override
    public Set<HttpMethod> optionsForAllow(String url, Object... uriVariables) throws RestClientException {
        return template.optionsForAllow(assemble(url), uriVariables);
    }

    @Override
    public Set<HttpMethod> optionsForAllow(String url, Map<String, ?> uriVariables) throws RestClientException {
        return template.optionsForAllow(assemble(url), uriVariables);
    }

    @Override
    public Set<HttpMethod> optionsForAllow(URI url) throws RestClientException {
        return template.optionsForAllow(assemble(url));
    }

    @Override
    public <T> ResponseEntity<T> exchange(String url, HttpMethod method, HttpEntity<?> requestEntity, Class<T> responseType, Object... uriVariables) throws RestClientException {
        try {
            return template.exchange(assemble(url), method, requestEntity, responseType, uriVariables);
        } finally {
            this.executed(method);
        }
    }

    @Override
    public <T> ResponseEntity<T> exchange(String url, HttpMethod method, HttpEntity<?> requestEntity, Class<T> responseType, Map<String, ?> uriVariables) throws RestClientException {
        try {
            return template.exchange(assemble(url), method, requestEntity, responseType, uriVariables);
        } finally {
            this.executed(method);
        }
    }

    @Override
    public <T> ResponseEntity<T> exchange(URI url, HttpMethod method, HttpEntity<?> requestEntity, Class<T> responseType) throws RestClientException {
        try {
            return template.exchange(assemble(url), method, requestEntity, responseType);
        } finally {
            this.executed(method);
        }
    }

    @Override
    public <T> ResponseEntity<T> exchange(String url, HttpMethod method, HttpEntity<?> requestEntity, ParameterizedTypeReference<T> responseType, Object... uriVariables) throws RestClientException {
        try {
            return template.exchange(assemble(url), method, requestEntity, responseType, uriVariables);
        } finally {
            this.executed(method);
        }
    }

    @Override
    public <T> ResponseEntity<T> exchange(String url, HttpMethod method, HttpEntity<?> requestEntity, ParameterizedTypeReference<T> responseType, Map<String, ?> uriVariables) throws RestClientException {
        try {
            return template.exchange(assemble(url), method, requestEntity, responseType, uriVariables);
        } finally {
            this.executed(method);
        }
    }

    @Override
    public <T> ResponseEntity<T> exchange(URI url, HttpMethod method, HttpEntity<?> requestEntity, ParameterizedTypeReference<T> responseType) throws RestClientException {
        try {
            return template.exchange(assemble(url), method, requestEntity, responseType);
        } finally {
            this.executed(method);
        }
    }

    @Override
    public <T> ResponseEntity<T> exchange(RequestEntity<?> requestEntity, Class<T> responseType) throws RestClientException {
        return template.exchange(requestEntity, responseType);
    }

    @Override
    public <T> ResponseEntity<T> exchange(RequestEntity<?> requestEntity, ParameterizedTypeReference<T> responseType) throws RestClientException {
        return template.exchange(requestEntity, responseType);
    }

    @Override
    public <T> T execute(String url, HttpMethod method, RequestCallback requestCallback, ResponseExtractor<T> responseExtractor, Object... uriVariables) throws RestClientException {
        try {
            return template.execute(assemble(url), method, requestCallback, responseExtractor, uriVariables);
        } finally {
            this.executed(method);
        }
    }

    @Override
    public <T> T execute(String url, HttpMethod method, RequestCallback requestCallback, ResponseExtractor<T> responseExtractor, Map<String, ?> uriVariables) throws RestClientException {
        try {
            return template.execute(assemble(url), method, requestCallback, responseExtractor, uriVariables);
        } finally {
            this.executed(method);
        }
    }

    @Override
    public <T> T execute(URI url, HttpMethod method, RequestCallback requestCallback, ResponseExtractor<T> responseExtractor) throws RestClientException {
        try {
            return template.execute(assemble(url), method, requestCallback, responseExtractor);
        } finally {
            this.executed(method);
        }
    }

    ////////////////////////////////////////////////////////
    // 其他方法
    ////////////////////////////////////////////////////////

    protected void validateIndexHeader(HttpHeaders headers){
        Assert.assertTrue(headers.containsKey("total"));
        Assert.assertTrue(headers.containsKey("pages"));
        Assert.assertTrue(headers.containsKey("number"));
        Assert.assertTrue(headers.containsKey("real"));
        Assert.assertTrue(headers.containsKey("sort"));
        Assert.assertTrue(headers.containsKey("count"));
    }

    ////////////////////////////////////////////////////////
    // 私有辅助方法
    ////////////////////////////////////////////////////////

    private void posted() {
        this.posted = true;
    }

    private void normal() {
        this.posted = false;
    }

    private void executed(HttpMethod method) {
        switch (method) {
            case POST:
            case PUT:
            case PATCH:
            case DELETE:
                this.posted();
                break;
        }
    }

    public static interface Callback<T> {
        T perform(HttpHeaders headers);
    }

    public static interface Job {
        void perform(HttpHeaders headers);
    }


}
