package dnt.monitor.engine.snmp.support;

import dnt.monitor.engine.snmp.MibRepository;
import net.happyonroad.spring.Bean;
import net.percederberg.mibble.MibLoader;
import net.percederberg.mibble.MibLoaderException;
import net.percederberg.mibble.MibLoaderLog;
import net.percederberg.mibble.value.ObjectIdentifierValue;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedOperation;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

import java.io.*;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

/**
 * <h1>The default MIB repository</h1>
 * <p/>
 * implements the mib repository based on net.percederberg.mibble
 *
 * @author Jay Xiong
 */
@Component
@ManagedResource(objectName = "dnt.monitor.engine:name=mibRepository")
class DefaultMibRepository extends Bean implements MibRepository {
    private Logger logger = LoggerFactory.getLogger(getClass());
    private MibLoader               mibLoader;
    private List<String> preparedModules;
    private List<String> loadedModules;

    public DefaultMibRepository() {
        setOrder(0);
        preparedModules = new LinkedList<String>();
        loadedModules = new LinkedList<String>();
    }

    ////
    // Lifecycle Implementations
    //

    @Override
    public void performStart() {
        mibLoader = new MibLoader();
        preLoadSystemMibs();
    }

    @Override
    public void performStop() {
        unloadMibs();
    }

    public void preLoad(Resource[] resources) {
        for (Resource resource : resources) {
            try {
                if( resource.getURL().toString().endsWith("/") ) continue;
                String filename = resource.getFilename();
                filename = modulize(filename);
                logger.debug("Pre-loading MIB {} -> {}", filename, resource.getDescription());
                mibLoader.addUrl(filename, resource.getURL());
                preparedModules.add(filename);
            } catch (IOException e) {
                logger.warn("Failed to pre-load {}, because of IOException: {}",
                            resource.getDescription(), ExceptionUtils.getRootCauseMessage(e));
            }
        }
    }

    private String modulize(String filename) {
        if(filename.indexOf(".") > 0 ) filename = filename.substring(0, filename.indexOf('.'));
        return filename;
    }

    @Override
    public void load(String... modules) {
        for (String module : modules) {
            try {
                module = modulize(module);
                logger.debug("Loading MIB {}", module);
                mibLoader.load(module);
                loadedModules.add(module);
            } catch (IOException e) {
                logger.warn("Failed to load {}, because of IOException: {}", module, e.getMessage());
            } catch (MibLoaderException e) {
                logError(module, e);
            }
        }
    }

    @Override
    public void print(PrintWriter out) {
        ObjectIdentifierValue oid = mibLoader.getRootOid();
        output(oid, out, 0);
        out.flush();
    }

    void output(ObjectIdentifierValue oid, PrintWriter out, int indent) {
        if (oid == null) return;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < indent; i++) sb.append("  ");
        out.println(sb.toString() + oid.getName() + "(" + oid.getValue() + ")");
        ObjectIdentifierValue[] children = oid.getAllChildren();
        for (ObjectIdentifierValue child : children) {
            output(child, out, indent + 1);
        }
    }

    //在启动的时候，自动搜索class path，将所有mibs下的资源作为候选的库引用起来
    //实际要加载哪些资源库，由外部调用者决定
    void preLoadSystemMibs() {
        //File mibRoot = new File(System.getProperty("app.home"), "mibs");
        //if(mibRoot.exists()) loadFromFileSystem(mibRoot);
    }

    @SuppressWarnings("UnusedDeclaration for debug")
    void loadFromFileSystem(File mibRoot) {
        mibLoader.addAllDirs(mibRoot);
        Collection<File> files = FileUtils.listFiles(mibRoot, null, true);
        for (File file : files) {
            if (file.isDirectory()) continue;
            try {
                logger.debug("Loading MIB {}", file);
                mibLoader.load(file);
            } catch (IOException e) {
                logger.warn("Failed to load MIB file {}, because of IOException: {}", file, e.getMessage());
            } catch (MibLoaderException e) {
                logError(file.getAbsolutePath(), e);
            }
        }
    }

    private void logError(String from, MibLoaderException e) {
        StringBuilder sb = new StringBuilder();
        //noinspection unchecked
        Iterator<MibLoaderLog.LogEntry> it = e.getLog().entries();
        while (it.hasNext()) {
            MibLoaderLog.LogEntry entry = it.next();
            String path;
            if (entry.getFile() != null)
                path = entry.getFile().getAbsolutePath();
            else if (entry.getURL() != null)
                path = entry.getURL().getPath();
            else
                path = "<Unknown>";
            sb.append("\t").append(entry.getMessage())
              .append(" at ")
              .append(path)
              .append("(").append(entry.getLineNumber()).append(",")
              .append(entry.getColumnNumber()).append(")").append("\n");
        }
        if (sb.length() > 0) sb.deleteCharAt(sb.length() - 1);
        logger.error("Failed to load {}, because of: {}\n{}",
                     from, e.getMessage(), sb.toString());
    }

    void unloadMibs() {
        mibLoader.unloadAll();
    }

    ////
    // Interface Implementations
    //


    public ObjectIdentifierValue getSymbol(String oid) {
        // 如果传入了实例的oid，如 "1.3.6.1.2.1.1.1.0"，将会返回null
        // 这时候，传入的应该是 "1.3.6.1.2.1.1.1"
        String[] segments = oid.split("\\.");
        if (null == mibLoader){
            mibLoader = new MibLoader();
        }
        ObjectIdentifierValue value = mibLoader.getRootOid();
        for (int i = 1; i < segments.length; i++) {
            String segment = segments[i];
            ObjectIdentifierValue next = value.getChildByValue(Integer.valueOf(segment));
            if (next == null) break;
            value = next;
        }
        return value;
    }

    /////////////////////////////////////////////
    // 可管理性
    /////////////////////////////////////////////
    @ManagedOperation
    public void dump(String fileName) throws IOException{
        PrintStream stream = new PrintStream(fileName);
        PrintWriter out = new PrintWriter(stream);
        try{
            print(out);
            out.flush();
        }finally {
            stream.close();
        }
    }


    @ManagedAttribute
    public String getMibTree(){
        StringWriter writer = new StringWriter();
        PrintWriter out = new PrintWriter(writer);
        print(out);
        return writer.toString();
    }

    @ManagedAttribute
    public String getPreparedModules(){
        return StringUtils.join(preparedModules, ",");
    }

    @ManagedAttribute
    public String getLoadedModules(){
        return StringUtils.join(loadedModules, ",");
    }

}
