package dnt.monitor.engine.ssh.support;

import com.trilead.ssh2.InteractiveCallback;

/**
 * <h1>SSH Authentication Callback</h1>
 *
 * @author Jay Xiong
 */
class SshAuthCallback implements InteractiveCallback {
    private final String password;

    public SshAuthCallback(String password) {
        this.password = password;
    }

    public String[] replyToChallenge(String name, String instruction,
                                     int numPrompts,
                                     String[] prompt, boolean[] echo) throws Exception {

        String[] ret = new String[numPrompts];

        for (int i = 0; i < numPrompts; i++) {
            if (echo[i]) {
                ret[i] = "";
            } else {
                ret[i] = password;
            }
        }
        return ret;
    }
}
