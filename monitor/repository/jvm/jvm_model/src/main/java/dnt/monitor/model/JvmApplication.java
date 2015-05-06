package dnt.monitor.model;

import dnt.monitor.annotation.Category;
import dnt.monitor.annotation.Keyed;
import dnt.monitor.model.jvm.*;
import dnt.monitor.model.jvm.Memory;
import dnt.monitor.model.jvm.Runtime;
import net.happyonroad.model.Credential;

import java.util.HashSet;
import java.util.Set;

/**
 * <h1>JVM Application</h1>
 *
 * @author Jay Xiong
 */
@Category(value = "jvm", credentials = Credential.Jmx)
public class JvmApplication extends Application {

    private static final long serialVersionUID = -9174322938239141951L;
    @Keyed
    private OperationSystem    operationSystem;
    @Keyed
    private Runtime            jvm;
    @Keyed
    private Memory             memory;
    @Keyed
    private GarbageCollector[] garbageCollectors;
    @Keyed
    private MemoryPool[]       memoryPools;
    @Keyed
    private Threading          threading;
    @Keyed
    private ClassLoading       classLoading;
    @Keyed
    private Compilation        compilation;

    public OperationSystem getOperationSystem() {
        return operationSystem;
    }

    public void setOperationSystem(OperationSystem operationSystem) {
        this.operationSystem = operationSystem;
    }

    public Runtime getJvm() {
        return jvm;
    }

    public void setJvm(Runtime runtime) {
        this.jvm = runtime;
    }

    public Memory getMemory() {
        return memory;
    }

    public void setMemory(Memory memory) {
        this.memory = memory;
    }

    public GarbageCollector[] getGarbageCollectors() {
        return garbageCollectors;
    }

    public void setGarbageCollectors(GarbageCollector[] garbageCollectors) {
        this.garbageCollectors = garbageCollectors;
    }

    public MemoryPool[] getMemoryPools() {
        return memoryPools;
    }

    public void setMemoryPools(MemoryPool[] memoryPools) {
        this.memoryPools = memoryPools;
    }

    public Threading getThreading() {
        return threading;
    }

    public void setThreading(Threading threading) {
        this.threading = threading;
    }

    public ClassLoading getClassLoading() {
        return classLoading;
    }

    public void setClassLoading(ClassLoading classLoading) {
        this.classLoading = classLoading;
    }

    public Compilation getCompilation() {
        return compilation;
    }

    public void setCompilation(Compilation compilation) {
        this.compilation = compilation;
    }

    @Override
    public String getHome() {
        String home = super.getHome();
        if( home == null && jvm != null && jvm.getSystemProperties() != null ){
            return jvm.getSystemProperties().getProperty("user.dir");
        }
        return home;
    }

    @Override
    public Set<Integer> getPids() {
        Set<Integer> pids = super.getPids();
        if( pids == null && jvm != null){
            String jvmName = jvm.getName();
            String pid = jvmName.substring(0, jvmName.indexOf('@'));
            pids = new HashSet<Integer>();
            pids.add(Integer.valueOf(pid));
            return pids;
        }
        return pids;
    }

    @Override
    public String getLabel() {
        String label = super.getLabel();
        if( label == null && jvm != null ){
            return jvm.getName();
        }
        return label;
    }
}
