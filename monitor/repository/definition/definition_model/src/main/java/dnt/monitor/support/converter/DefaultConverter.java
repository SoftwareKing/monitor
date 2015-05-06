package dnt.monitor.support.converter;

import dnt.monitor.service.TypeConverter;
import org.apache.commons.lang.StringUtils;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * <h1>基础数据类型的转换器</h1>
 *
 * @author mnnjie
 */
public class DefaultConverter implements TypeConverter {
    @Override
    public Object convert(String valueText, String format, Class valueType) throws Exception {
        if (String.class == valueType) {
            return valueText;
        }

        if(StringUtils.isBlank(valueText)){
            throw new Exception("valueText is null or empty");
        }

        valueText = valueText.trim();

        if (Boolean.class == valueType || boolean.class == valueType) {
            return Boolean.parseBoolean(valueText) || "1".equals(valueText);
        }
        if (Date.class == valueType) {
            if( format != null ){
                SimpleDateFormat sdf = new SimpleDateFormat(format);
                return sdf.parse(valueText);
            }else{
                return new Date(Long.valueOf(valueText));
            }
        }

        if (Integer.class == valueType || int.class == valueType) {
            Double v = Double.parseDouble(valueText);
            return v.intValue();
        }
        if (Long.class == valueType || long.class == valueType) {
            Double v = Double.parseDouble(valueText);
            return v.longValue();
        }
        if (Double.class == valueType || double.class == valueType) {
            return Double.parseDouble(valueText);
        }
        if (Float.class == valueType || float.class == valueType) {
            Double v = Double.parseDouble(valueText);
            return v.floatValue();
        }

        throw new Exception("Not support for " + valueType);
    }
}
