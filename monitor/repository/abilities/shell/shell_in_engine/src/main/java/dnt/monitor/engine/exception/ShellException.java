package dnt.monitor.engine.exception;

import dnt.monitor.exception.SampleException;

/**
 * <h1>Shell Exception</h1>
 *
 * @author Jay Xiong
 */
public class ShellException extends SampleException{
    private static final long serialVersionUID = 9073630010370478322L;

    private int exitCode = 255;

    public ShellException(String message) {
        super(message);
    }

    public ShellException(Exception cause) {
        super(cause);
    }

    public ShellException(String message, Exception cause) {
        super(message, cause);
    }

    public ShellException(String message, int exitCode) {
        super(message);
        this.exitCode = exitCode;
    }

    public ShellException(int code, String message, Exception ex) {
        super(message, ex);
        this.exitCode = code;
    }

    public ShellException(int code, String message) {
        this(code, message, null);
    }

    public int getExitCode() {
        return exitCode;
    }
}
