package dnt.monitor.support.converter;

import dnt.monitor.service.TypeConverter;
import java.util.Date;

/**
 * <h1>将秒数的文本转换为Date类型</h1>
 *
 * @author mnnjie
 */
public class SecondToDateConverter implements TypeConverter {
    @Override
    public Object convert(String valueText,String format,Class valueType) throws Exception {
        Double seconds = Double.parseDouble(valueText);
        return new Date(seconds.longValue()*1000);
    }
}
