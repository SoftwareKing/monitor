package dnt.monitor.model.jvm;

import dnt.monitor.annotation.jmx.ObjectName;
import dnt.monitor.model.Entry;

import java.util.Properties;

/**
 * <h1>JVM Runtime 信息</h1>
 *
 * 暂时没有将JVM作为应用程序树上面的一环
 *
 * @author Jay Xiong
 */
@ObjectName("java.lang:type=Runtime")
public class Runtime extends Entry {
    private static final long serialVersionUID = -8619848608558438174L;

    private String   name;//Name
    private String   vmName;//VmName
    private String   vmVersion;//VmVersion
    private String   vmVendor;//VmVendor
    private String   bootClassPath;
    private String   classPath;
    private String   libraryPath;
    private String[] inputArguments;
    private long     startTime;
    private Long     uptime;
    private Properties systemProperties;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVmName() {
        return vmName;
    }

    public void setVmName(String vmName) {
        this.vmName = vmName;
    }

    public String getVmVersion() {
        return vmVersion;
    }

    public void setVmVersion(String vmVersion) {
        this.vmVersion = vmVersion;
    }

    public String getVmVendor() {
        return vmVendor;
    }

    public void setVmVendor(String vmVendor) {
        this.vmVendor = vmVendor;
    }

    public String getBootClassPath() {
        return bootClassPath;
    }

    public void setBootClassPath(String bootClassPath) {
        this.bootClassPath = bootClassPath;
    }

    public String getClassPath() {
        return classPath;
    }

    public void setClassPath(String classPath) {
        this.classPath = classPath;
    }

    public String getLibraryPath() {
        return libraryPath;
    }

    public void setLibraryPath(String libraryPath) {
        this.libraryPath = libraryPath;
    }

    public String[] getInputArguments() {
        return inputArguments;
    }

    public void setInputArguments(String[] inputArguments) {
        this.inputArguments = inputArguments;
    }

    public long getStartTime() {
        return startTime;
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

    public Long getUptime() {
        return uptime;
    }

    public void setUptime(Long uptime) {
        this.uptime = uptime;
    }

    public Properties getSystemProperties() {
        return systemProperties;
    }

    public void setSystemProperties(Properties systemProperties) {
        this.systemProperties = systemProperties;
    }
}
