package dnt.monitor.engine.snmp.support;


import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.snmp.MetaOID;
import net.happyonroad.spring.Bean;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * <h1>向数据模型中填充数据</h1>
 *
 * @author LuXiong
 */
@Component
public class SnmpFieldComputer extends Bean implements FieldComputer {


    @Override
    public Object computeField(MetaField metaField, Map<String, Object> valueMap) throws SampleException {
        MetaOID metaOID = metaField.getOID();
        if (null == metaOID) {
            return null;
        }
        Object valueText = valueMap.get(metaOID.getValue());
        if (null == valueText) {
            return null;
        }
        if (metaField.getProperty().getPropertyType().getSimpleName().toLowerCase().equals("string")) {
            return String.valueOf(valueText);
        } else if (metaField.getProperty().getPropertyType().getSimpleName().toLowerCase().equals("boolean")) {
            return Boolean.valueOf(String.valueOf(valueText));
        } else if (metaField.getProperty().getPropertyType().getSimpleName().toLowerCase().equals("int")) {
            return Integer.valueOf(String.valueOf(valueText));
        } else if (metaField.getProperty().getPropertyType().getSimpleName().toLowerCase().equals("long")) {
            return Long.valueOf(String.valueOf(valueText));
        } else if (metaField.getProperty().getPropertyType().getSimpleName().toLowerCase().equals("double")) {
            return Double.valueOf(String.valueOf(valueText));
        }
        return valueText;
    }
}
