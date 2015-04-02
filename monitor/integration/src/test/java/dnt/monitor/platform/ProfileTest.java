/**
 * xiongjie on 14-8-11.
 */
package dnt.monitor.platform;

import dnt.monitor.it.AbstractTest;
import net.happyonroad.platform.web.model.DefaultUser;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

/**
 * <h1>当前用户Profile的测试用例</h1>
 */
public class ProfileTest extends AbstractTest {

    // 测试用户读取自身profile的url
    @Test
    public void testGetProfile() throws Exception {
        DefaultUser user = withLoginUser(new Callback<DefaultUser>() {
            @Override
            public DefaultUser perform(HttpHeaders headers) {
                HttpEntity request = new HttpEntity(headers);
                return getForObject("/api/profile", DefaultUser.class, request);
            }
        });
        Assert.assertNotNull(user);
        Assert.assertEquals(configuration.getUsername(), user.getUsername());
    }
}
