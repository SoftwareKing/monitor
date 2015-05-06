package dnt.monitor.engine.ssh.support;

import com.trilead.ssh2.Connection;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.SshCredential;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * <h1>Test Default Ssh Visitor</h1>
 *
 * @author mnnjie
 */
public class DefaultSshVisitorTest {
    Connection conn = new Connection("ci.dev.itsnow.com", 22);

    @Before
    public void setUp() throws Exception {
        conn.connect();
    }

    @After
    public void tearDown() throws Exception {
        conn.close();
    }

    @Test
    public void testVisitor() throws Exception{
        conn.authenticateWithPassword("root", "dev@dnt");
        DefaultSshVisitor visitor = new DefaultSshVisitor(null, new Resource(), new SshCredential(), conn, 10000);
        String result = visitor.perform("pwd");
        System.out.println(result);
        assertEquals("/root", result);
    }

}
