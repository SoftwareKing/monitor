package dnt.monitor.support.converter;

import dnt.monitor.service.TypeConverter;
import dnt.monitor.service.TypeConverterService;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * <h1>数据类型转换服务实现</h1>
 *
 * @author mnnjie
 */
@SuppressWarnings("unused")
@Component
public class ConverterManager implements TypeConverterService {

    //转换器Map
    private Map<String, TypeConverter> map = new HashMap<String, TypeConverter>();

    /**
     * 预制一些基础数据类型的转换器
     */
    @PostConstruct
    public void initConverterMap() {
        DefaultConverter converter = new DefaultConverter();
        register(String.class.getName(), converter);
        register(Long.class.getName(), converter);
        register("long", converter);
        register(Integer.class.getName(), converter);
        register("int", converter);
        register(Double.class.getName(), converter);
        register("double", converter);
        register(Float.class.getName(), converter);
        register("float", converter);
        register(Boolean.class.getName(), converter);
        register("boolean", converter);
        register(Date.class.getName(), converter);
        register("secondToDate", new SecondToDateConverter());
    }

    @Override
    public void register(String name, TypeConverter converter) {
        map.put(name, converter);
    }

    @Override
    public TypeConverter get(String name) {
        return map.get(name);
    }
}
