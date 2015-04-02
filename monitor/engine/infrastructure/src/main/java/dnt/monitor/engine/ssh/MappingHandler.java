package dnt.monitor.engine.ssh;

import dnt.monitor.engine.exception.SshException;
import dnt.monitor.meta.ssh.MetaMapping;
import net.happyonroad.model.GeneralMap;

import java.util.List;
import java.util.Map;

/**
 * <h1>解析并封装指令返回结果</h1>
 *
 * @author mnnjie
 */
public interface MappingHandler {
    /**
     * 将结果封装为Map
     */
    GeneralMap<String, Object> handleMap(MetaMapping metaMapping, String resultText) throws SshException;

    /**
     * 将结果封装为Table
     */
    List<GeneralMap<String, Object>> handleTable(MetaMapping metaMapping, String resultText) throws SshException;
}
