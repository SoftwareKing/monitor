/**
 * xiongjie on 14-8-11.
 */
package dnt.monitor.platform;

import dnt.monitor.it.AbstractTest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * <h1>Session Related Integration Test</h1>
 *
 * <ul>
 * <li>Login Test</li>
 * <li>Logout Test</li>
 * <li>Forget/Recovery password Test</li>
 * <li>Remember Me Test</li>
 * </ul>
 *
 */
public class SessionTest extends AbstractTest {
    private Map<String, String> loginRequest;

    @Before
    public void setUp() throws Exception {
        loginRequest = new HashMap<String, String>();
        loginRequest.put("username", getValue("it.user", "admin"));
        loginRequest.put("password", getValue("it.password", "secret"));
    }

    @Test
    public void testLoginWithoutCsrf() throws Exception {
        try {
            postForLocation("/api/session", loginRequest);
            Assert.fail("It should failed for no csrf token");
        } catch (RestClientException e) {
            Assert.assertTrue(e instanceof HttpClientErrorException);
            HttpClientErrorException ce = (HttpClientErrorException) e;
            Assert.assertEquals(403, ce.getStatusCode().value());
        }
    }

    @Test
    public void testLoginWithCsrf() throws Exception {
        URI uri = super.withCsrf(new Callback<URI>() {
            public URI perform(HttpHeaders headers) {
                HttpEntity request = new HttpEntity(headers);
                return postForLocation("/api/session?username={username}&password={password}", request, loginRequest);
            }
        });
        Assert.assertNotNull(uri);
    }

    @Test
    public void testLogout() throws Exception {
        URI uri = super.withLoginUser(new Callback<URI>() {
            @Override
            public URI perform(HttpHeaders headers) {
                HttpEntity request = new HttpEntity(headers);
                ResponseEntity<String> response = exchange("/api/session", HttpMethod.DELETE, request, String.class);
                return response.getHeaders().getLocation();
            }
        });
        Assert.assertNotNull(uri);
    }
}
