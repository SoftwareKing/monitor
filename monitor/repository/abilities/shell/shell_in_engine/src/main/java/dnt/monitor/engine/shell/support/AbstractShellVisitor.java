package dnt.monitor.engine.shell.support;

import dnt.monitor.engine.exception.ShellException;
import dnt.monitor.engine.shell.ShellVisitor;
import dnt.monitor.engine.support.AbstractVisitor;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.LocalCredential;
import net.happyonroad.credential.ShellCredential;
import org.apache.commons.io.IOUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

/**
 * <h1>Abstract Shell Visitor</h1>
 *
 * @author Jay Xiong
 */
abstract class AbstractShellVisitor extends AbstractVisitor<ShellCredential> implements ShellVisitor<ShellCredential> {

    public AbstractShellVisitor(ManagedNode node, Resource resource, ShellCredential credential) {
        super(node, resource, credential);
    }

    @Override
    public boolean isAvailable() {
        List<String> lines;
        try {
            Process exec = Runtime.getRuntime().exec(availableCommand());
            exec.waitFor();
            lines = IOUtils.readLines(exec.getInputStream());
            return !lines.isEmpty() && !lines.get(0).isEmpty();
        } catch (Exception ex) {
            return false;
        }
    }

    /**
     * <h2>判断shell是否可用的命令</h2>
     *
     * @return 判断shell是否可用的命令
     */
    protected abstract String availableCommand();

    /**
     * <h2>组装命令</h2>
     *
     * @param script 需要执行的命令
     * @param args   参数
     * @return 命令数组
     */
    protected abstract String[] assemble(String script, Object[] args);

    @Override
    public String perform(String script, Object... args) throws ShellException {
        return perform(0, script, args);
    }

    @Override
    public String perform(long timeout, String script, Object... args) throws ShellException {
        try {
            StringBuilder errors;
            StringBuilder output;
            int exit;
            String[] commands = assemble(script, args);
            Process process = Runtime.getRuntime().exec(commands);
            errors = new StringBuilder();
            Thread copyErrThread = new CopyStream(errors, process.getErrorStream());
            copyErrThread.start();

            output = new StringBuilder();
            Thread copyOutThread = new CopyStream(output, process.getInputStream());
            copyOutThread.start();

            exit = process.waitFor();

            copyErrThread.join(timeout);
            copyOutThread.join(timeout);
            if (exit == 0)
                return output.toString();
            else
                throw new ShellException(errors.toString(), exit);
        } catch (IOException e) {
            throw new ShellException("Failed to execute " + script, e);
        } catch (InterruptedException e) {
            throw new ShellException("Execute " + script + " timeout " + timeout);
        }
    }

    private class CopyStream extends Thread {
        private final StringBuilder result;
        private final InputStream   stream;

        public CopyStream(StringBuilder result, InputStream stream) {
            this.result = result;
            this.stream = stream;
        }

        @Override
        public void run() {
            try {
                result.append(convertStream(stream));
            } catch (IOException e) {
                result.append(e.getMessage());
            }
        }

        private String convertStream(InputStream is) throws IOException {
            String output;
            StringBuilder outputBuffer = new StringBuilder();
            BufferedReader streamReader = new BufferedReader(
                    new InputStreamReader(is));
            while ((output = streamReader.readLine()) != null) {
                outputBuffer.append(output);
                outputBuffer.append("\n");
            }
            return outputBuffer.toString();
        }
    }
}
