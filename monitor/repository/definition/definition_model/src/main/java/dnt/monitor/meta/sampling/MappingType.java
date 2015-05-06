package dnt.monitor.meta.sampling;

/**
 * <h1>表达Command的执行结果经过Mapping处理后的数据结构</h1>
 *
 * @author mnnjie
 */
public enum MappingType {
    /**
     * 处理结果是Table形式，类型为 List&lt;GeneralMap&lt;String, Object&gt;&gt;
     */
    TABLE,
    /**
     * 处理结果是Map形式，类型为 GeneralMap&lt;String, Object&gt;
     */
    MAP;
}
