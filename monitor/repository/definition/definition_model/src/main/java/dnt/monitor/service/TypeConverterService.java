package dnt.monitor.service;

/**
 * <h1>数据类型转换服务</h1>
 *
 * @author mnnjie
 */
public interface TypeConverterService {
    /**
     * 注册数据类型转换器
     * @param name 注册名称
     * @param converter 转换器
     */
    void register(String name,TypeConverter converter);

    /**
     * 获得数据类型转换器
     * @param name 注册名称
     * @return 转换器
     */
    TypeConverter get(String name);
}
