package dnt.monitor.engine.ssh.support;

import dnt.monitor.engine.exception.SshException;
import dnt.monitor.engine.ssh.CommandExecutor;
import dnt.monitor.engine.ssh.SshVisitor;
import dnt.monitor.meta.ssh.MetaCommand;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
public class DefaultCommandExecutorTest {
    @Test
    public void testReadScriptFile() throws Exception {
        CommandExecutor executor = new DefaultCommandExecutor();
        MetaCommand metaCommand = new MetaCommand();
        metaCommand.setValue("classpath:abc");
        metaCommand.setTimeout("30s");
        SshVisitor visitor = new SshVisitor() {
            @Override
            public String perform(String script) throws SshException {
                return script;
            }

            @Override
            public String perform(String script, long timeout) throws SshException {
                return script;
            }
        };
        assertTrue(executor.execute(metaCommand,visitor).equals("abcde"));
    }
}
