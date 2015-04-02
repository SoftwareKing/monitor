package dnt.monitor.engine.ssh.support;

import dnt.monitor.engine.ssh.SshVisitor;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.credential.SshCredential;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.io.File;

import static org.junit.Assert.*;

public class DefaultSshVisitorFactoryTest {
    DefaultSshVisitorFactory factory = new DefaultSshVisitorFactory();
    ResourceNode node = new ResourceNode();
    private SshVisitor visitor;

    @Before
    public void setUp() throws Exception {
        node.setPath("/default/ssh/test");
        Resource resource = new Resource();
        node.setResource(resource);
        resource.setAddress("dev1.itsnow.com");
    }

    @After
    public void tearDown() throws Exception {
        if( visitor != null ){
            factory.returnBack(node, visitor);
        }
    }

    @Test
    public void testVisitorByUsernameAndPassword() throws Exception {
        SshCredential credential = new SshCredential("root", "jay@dnt");
        node.setCredentials(credential);
        visitor = factory.visitor(node, credential);
        assertEquals("Linux", visitor.perform("uname"));
    }

    @Test
    @Ignore("CI or others env can't support this")
    public void testVisitorByUsernameAndPermFile() throws Exception {
        File permFile = new File(System.getProperty("user.home"), ".ssh/id_rsa");
        SshCredential credential = new SshCredential("root", permFile);
        node.setCredentials(credential);
        SshVisitor visitor = factory.visitor(node, credential);
        assertEquals("Linux", visitor.perform("uname"));
    }
}