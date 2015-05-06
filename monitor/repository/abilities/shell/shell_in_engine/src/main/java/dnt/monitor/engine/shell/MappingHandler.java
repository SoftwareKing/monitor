package dnt.monitor.engine.shell;

import dnt.monitor.engine.exception.ShellException;
import dnt.monitor.meta.shell.MetaMapping;
import net.happyonroad.model.GeneralMap;

import java.util.List;

/**
 * <h1>解析并封装指令返回结果</h1>
 *
 * @author mnnjie
 */
public interface MappingHandler {
    /**
     * 将结果封装为Map
     */
    GeneralMap<String, Object> handleMap(MetaMapping metaMapping, String resultText) throws ShellException;

    /**
     * 将结果封装为Table
     */
    List<GeneralMap<String, Object>> handleTable(MetaMapping metaMapping, String resultText) throws ShellException;
}
