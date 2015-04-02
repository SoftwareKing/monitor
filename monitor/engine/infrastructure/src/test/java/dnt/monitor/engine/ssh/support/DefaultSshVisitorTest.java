package dnt.monitor.engine.ssh.support;

import com.trilead.ssh2.Connection;
import org.apache.commons.lang.StringUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * <h1>Test Default Ssh Visitor</h1>
 *
 * @author mnnjie
 */
public class DefaultSshVisitorTest {
    Connection conn = new Connection("172.16.3.14", 22);

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
        conn.authenticateWithPassword("root", "root123");
        DefaultSshVisitor visitor = new DefaultSshVisitor(conn,10000);
        String result = visitor.perform("pwd");
        System.out.println(result);
        assertEquals("/root", result);
    }

}
