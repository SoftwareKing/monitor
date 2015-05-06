package dnt.monitor.engine.wmi.support;

import dnt.monitor.engine.exception.WmiException;
import dnt.monitor.engine.support.AbstractVisitor;
import dnt.monitor.engine.wmi.WmiVisitor;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.WindowsCredential;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.SystemUtils;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.List;

/**
 * <h1>WMIC Visitor</h1>
 *
 * @author Jay Xiong
 */
class WmicVisitor extends AbstractVisitor<WindowsCredential> implements WmiVisitor {
    private final String               address;

    public WmicVisitor(ManagedNode node, Resource resource, WindowsCredential credential) {
        super(node, resource, credential);
        this.address = this.resource.getAddress();
    }

    @Override
    public String perform(String wql) throws WmiException {
        String password = getCredential().getPassword();
        String user = getCredential().getUser();
        boolean windows = SystemUtils.IS_OS_WINDOWS;
        String[] commands;
        if (StringUtils.hasText(password)) {
            if (windows) {
                commands = new String[]{"wmic", "/node:" + address, "/user:" + user, "/password:" + password, wql};
            } else {
                commands = new String[]{"wmic", "-U", user + "%" + password, "//" + address, wql};
            }
        } else {
            if (windows) {
                commands = new String[]{"wmic", "/node:" + address, "/user:" + user, wql};
            } else {
                commands = new String[]{"wmic", "-U", user, "-N", "//" + address, wql};
            }
        }
        String command = StringUtils.arrayToDelimitedString(commands, " ");
        logger.info(command);
        List<String> lines;
        try {
            Process p = Runtime.getRuntime().exec(commands);
            lines = IOUtils.readLines(p.getInputStream());
            if (lines.isEmpty()) {
                List<String> errors = IOUtils.readLines(p.getErrorStream());
                throw new WmiException("Can't perform `" + command + "`, get error: " +
                                      StringUtils.arrayToDelimitedString(errors.toArray(), "\n"));
            }
        } catch (IOException e) {
            throw new WmiException(e);
        }
        return StringUtils.arrayToDelimitedString(lines.toArray(), "\n");
    }

    @Override
    public boolean isAvailable() {
        return true;//TODO by recent error
    }
}
