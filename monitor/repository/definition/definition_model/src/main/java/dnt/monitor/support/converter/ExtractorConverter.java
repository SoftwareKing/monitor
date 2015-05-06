package dnt.monitor.support.converter;

import dnt.monitor.service.TypeConverter;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <h1>Extract value by format</h1>
 *
 * @author Jay Xiong
 */
public class ExtractorConverter implements TypeConverter {
    @Override
    public Object convert(String valueText, String format, Class valueType) throws Exception {
        Matcher matcher = Pattern.compile(format).matcher(valueText);
        if(matcher.matches()){
            String value = matcher.group(1);
            // TODO TEMP SOLUTION
            if( Number.class.isAssignableFrom(valueType)){
                return Float.valueOf(value);// to be converted
            }else{
                return value;
            }
        }
        return null;
    }
}
