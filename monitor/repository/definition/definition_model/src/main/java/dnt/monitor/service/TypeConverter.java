package dnt.monitor.service;

/**
 * <h1>数据类型转换器</h1>
 *
 * @author mnnjie
 */
public interface TypeConverter {

    /**
     * 进行数据类型转换
     * @param valueText 输入文本
     * @param format 格式参数
     * @param valueType 转换目标数据类型
     * @return 转换结果
     * @throws Exception 转换异常
     */
    Object convert(String valueText,String format,Class valueType) throws Exception;
}
