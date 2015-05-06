package dnt.monitor.engine.ssh.support;

import dnt.monitor.engine.ssh.SshVisitor;
import dnt.monitor.model.Resource;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.credential.SshCredential;
import net.happyonroad.util.TempFile;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.FileOutputStream;

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
        resource.setAddress("ci.dev.itsnow.com");
    }

    @After
    public void tearDown() throws Exception {
        if( visitor != null ){
            factory.returnBack(visitor);
        }
    }

    @Test
    public void testVisitorByUsernameAndPassword() throws Exception {
        SshCredential credential = new SshCredential("root", "dev@dnt");
        node.setCredentials(credential);
        visitor = factory.visitor(node, credential);
        assertEquals("Linux", visitor.perform("uname"));
    }

    @Test
    public void testVisitorByUsernameAndPermFile() throws Exception {
        File file = TempFile.tempFile("id");
        FileOutputStream fos = new FileOutputStream(file);
        try {
            IOUtils.write("-----BEGIN RSA PRIVATE KEY-----\n" +
                          "MIIEoAIBAAKCAQEAu/J+K0pgOKQKRb8o0B9ARYE5jPc9B7zrco3w2ZWlvMLV5yGs\n" +
                          "ICKSLL5yKm8tG2hCGda0HTlZ4y436C6/mZYo1/4hAd+fY/Rnz20uEBHV6xTw7RHM\n" +
                          "+Y/uDPlRAsXNByXCvlSTzUp7lP9CNO0fneAlf6J94UDnwJvOFTVkALgyEGV/Wrd7\n" +
                          "UPNUTsbkVJK2wULY5VIs2r44zb5foQuPWDEo/PRV1f9kQbhV3Wm0UjZphMtSkMC/\n" +
                          "BMP6/s4UyamkepvxA+z0HPjUST9xTX8wy+TBphvhi7EcVTkbTcZjPSpRKk6/LsFf\n" +
                          "fbJzE3Ut8ur9UhlLoHDcKZkMY8BDGvS26aUeiQIBIwKCAQBFzxjrggZ7cCESl3WP\n" +
                          "IYzmnbZKTTPs7mYUmx7xuz2PQQ2e/eDYvGIt4FZKRo0YzvP69/nBtjdUYZ+8o6ZA\n" +
                          "XFhQOdG+3ggAjfqsITz+p4n4Ovpmrtca3bAwtF/rFkTWxOHu7Dbl2dYhZh/nxcnq\n" +
                          "Lq7XosEKhdJsHJ0AkCx1S7rS4zr5TjrjkxXQIWM0XhgEQf1h3Q9RSXfxzMpAU3ga\n" +
                          "7nINFEP6shSZ8BS1aExvfuR4Vt7Z771qBnvyjghafXIBSMvNQsytl6+RB8P0/vlB\n" +
                          "/y1SEmaUQnC8nDXjGWmSdhrJC2WtvTf3GBCPu3AQEvKThugPw2yYwEvlhsfytWsF\n" +
                          "HGALAoGBAPQEmw+zRVx+7HBtGvlfXT5OlSGOABEuhQiHebzqz2kn+09+dCfSXkoA\n" +
                          "X/LPkO2PIQo7NugFUjf3yEgBv2dNmfxZtRfLOb4aLTvgewMBsoWVwN8ShSfZOaAi\n" +
                          "M2osajOb3uGHA5/MkWBjeeCW/Wlu9W4QHX4riGhne2Ed16jKt2cRAoGBAMUtDrlg\n" +
                          "XQvalEFuK6QbW1LeB2voDAwUOV32OvGHVe87mxQ+cLYzXYVXGFYvFMYUItyoUyfO\n" +
                          "TJy1EUAjDqfHFpTkDdylxD2BOGDtGqJnSCSCKXglFp2T5MK0dfCGbnL7AmlxhTy1\n" +
                          "aiEtAql/a8u4aeLvu2EAWbBDiz3SIO39ee/5AoGAfX62JVTh18w/FT9s9Ub8wPU2\n" +
                          "wMyvk87IEwPYNUWPPWUE5w3VVk7uqbcMxgRZKbdS0g/TGD1AOgpnAHXtaFPLiRgx\n" +
                          "P2/UjacP8uh5xwgv7O3uKZR+/oz5EIaeGVirpYNcrn/zPD1SFFBqkMKuNjkQgb8l\n" +
                          "HFDnER9GxDs7teSY1esCgYAys9CWEXcDDFICMkW8fBArQGhO8obBRwdv7tv09uo2\n" +
                          "M+YMhRWrMceXUOkAN/4HDH3+Oel/Q61M3hpg8xJlqDkBtvxADV5Y9Vej5TK8C+36\n" +
                          "wmJvWf6ASpno7JNbG0D4/rd6MyJCz5BRrH0HA4IecT/MpAucmbCpqvfrU0pL03cg\n" +
                          "cwKBgC4kHJMdQqdw2mHBqtL/Dw2sygs31M+s1JQcYCe73SCCvJjaPZ4uY5dHJ60Z\n" +
                          "A5Pgqwy+dwWBR6S1E/1G2gVW8IZrObvMMZwPPKurtSYpQHopgLLQL99Q6z3bnSXs\n" +
                          "be8VkFzWx3rvlFR7qWeeLqXUZgUwgDt9+NDm6u6IBJs467Jt\n" +
                          "-----END RSA PRIVATE KEY-----", fos);
            SshCredential credential = new SshCredential("root", file);
            node.setCredentials(credential);
            SshVisitor visitor = factory.visitor(node, credential);
            assertEquals("Linux", visitor.perform("uname"));
        } finally {
            IOUtils.closeQuietly(fos);
            FileUtils.deleteQuietly(file);
        }
    }
}