package dnt.monitor.engine.shell.support;

import dnt.monitor.engine.shell.CommandExecutor;
import dnt.monitor.engine.shell.ShellVisitor;
import dnt.monitor.meta.shell.MetaCommand;
import org.easymock.EasyMock;
import org.junit.Ignore;
import org.junit.Test;

import static org.easymock.EasyMock.*;
import static org.junit.Assert.assertTrue;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
public class DefaultCommandExecutorTest {
    @Test
    @Ignore
    public void testReadScriptFile() throws Exception {
        CommandExecutor executor = new DefaultCommandExecutor();
        MetaCommand metaCommand = new MetaCommand();
        metaCommand.setValue("classpath:abc");
        metaCommand.setTimeout("30s");
        ShellVisitor visitor = EasyMock.createMock(ShellVisitor.class);
        expect(visitor.perform(anyString(), anyInt())).andReturn("abcde");
        replay(visitor);
        assertTrue(executor.execute(metaCommand, visitor).equals("abcde"));
        verify(visitor);
    }
}
