package dnt.monitor.engine.shell.support;

import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.shell.MetaShell;
import dnt.monitor.meta.shell.MetaValue;
import dnt.monitor.service.TypeConverter;
import dnt.monitor.service.TypeConverterService;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.ParseUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.expression.MapAccessor;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * <h1>向数据模型中填充数据</h1>
 *
 * @author mnnjie
 */
@Component
class ShellFieldComputer extends Bean implements FieldComputer {

    @Autowired
    private TypeConverterService typeConverterService;

    private ExpressionParser elParser = new SpelExpressionParser();


    @Override
    public Object computeField(String type, MetaField metaField, Map<String, Object> valueMap) throws SampleException {
        MetaValue metaValue = getMetaValue(type, metaField);
        Class valueClass = metaField.getProperty().getPropertyType();
        boolean isNumberType = isNumberType(valueClass);

        if (metaValue == null || StringUtils.isBlank(metaValue.getValue())) {
            if (valueMap.containsKey(metaField.getName())) {
                String valueText = valueMap.get(metaField.getName()).toString();
                return computeField(type, metaField, valueText);
            }else{
                return null;
            }
        }
        Map<String, Object> context = new HashMap<String, Object>(valueMap);
        String newMetaValueText = buildContext(context, metaValue.getValue(), isNumberType);
        StandardEvaluationContext standardEvaluationContext = new StandardEvaluationContext();
        standardEvaluationContext.addPropertyAccessor(new MapAccessor());
        String valueText;
        try {
            Expression expression = elParser.parseExpression(newMetaValueText);
            valueText = expression.getValue(standardEvaluationContext, context, String.class);
        } catch (Exception ex) {
            throw new SampleException("parse SpEL exp failed,field=" + metaField.getDeclaringClass().getName() + "/" +
                                      metaField.getName() + ",exp=" + metaValue.getValue() + ",context=" +
                                      ParseUtils.toJSONString(valueMap), ex);
        }
        return computeField(type, metaField, valueText);
    }

    protected MetaValue getMetaValue(String type, MetaField metaField) {
        MetaShell metaShell = metaField.getAttribute(MetaShell.class);
        return metaShell == null ? null : metaShell.getValue(type);
    }

    private Object computeField(String type, MetaField metaField, String valueText) throws SampleException {
        if (StringUtils.isBlank(valueText)) {
            return null;
        }
        valueText = valueText.trim();
        MetaValue metaValue = getMetaValue(type, metaField);
        if (metaValue == null) {
            metaValue = new MetaValue();
        }
        Class valueClass = metaField.getProperty().getPropertyType();
        String converterName =
                StringUtils.isBlank(metaValue.getConverter()) ? valueClass.getName() : metaValue.getConverter();
        /**
         * StringExtractor extractor = ..;
         * String extractedText = extractor.extract(rawText, format);
         * Object value = converter.convert(extractedText, klass)
         */
        TypeConverter converter = typeConverterService.get(converterName);

        if (converter == null) {
            throw new SampleException("can't find converter,field=" + metaField.getDeclaringClass().getName() + "/" +
                                      metaField.getName() + ",converter=" + converterName);
        }
        Object obj;
        try {
            obj = converter.convert(valueText, metaValue.getFormat(), valueClass);
        } catch (Exception ex) {
            throw new SampleException("convert value failed,field=" + metaField.getDeclaringClass().getName() + "/" +
                                      metaField.getName() + ",converter=" + converterName + ",valueText=" + valueText +
                                      ",format=" +
                                      metaValue.getFormat() + ",valueClass=" + valueClass.getName(), ex);
        }

        if (isNumberType(valueClass) && metaValue.getUnitRate() != 0 && metaValue.getUnitRate() != 1) {
            obj = convert(((Number) obj).doubleValue() * metaValue.getUnitRate(), valueClass);
        }
        return obj;
    }


    /**
     * 判断是否为数字类型
     */
    private boolean isNumberType(Class valueClass) {
        return Number.class.isAssignableFrom(valueClass) || valueClass == int.class || valueClass == long.class ||
               valueClass == double.class || valueClass == float.class;
    }

    /**
     * 将数字结果转换为对应的数字类型
     */
    private Object convert(Double v, Class valueClass) {
        if (Integer.class == valueClass || int.class == valueClass) {
            return v.intValue();
        }
        if (Long.class == valueClass || long.class == valueClass) {
            return v.longValue();
        }
        if (Double.class == valueClass || double.class == valueClass) {
            return v;
        }
        if (Float.class == valueClass || float.class == valueClass) {
            return v.floatValue();
        }
        logger.error("not support this type:" + valueClass.getName());
        return null;
    }


    /**
     * 对SpEL表达式做转换，将${varName}部分的变量引用进行替换（因为varName中可能含空格等特殊字符）
     *
     * @param context       数据上下文
     * @param metaValueText 原始的SpEL表达式
     * @param isNumberType  指示最终计算结果是否为数字类型
     * @return 转换过的SpEL表达式
     */
    private String buildContext(Map<String, Object> context, String metaValueText, boolean isNumberType) {
        if (isNumberType) {
            for (String key : context.keySet()) {
                Object value = context.get(key);
                try {
                    context.put(key, Double.parseDouble(value.toString()));
                } catch (Exception ex) {
                    //do nothing
                }
            }
        }

        StringBuilder newMetaValueText = new StringBuilder();
        StringBuilder tempWord = new StringBuilder();
        int index = 0;
        boolean inWord = false;
        for (int i = 0; i < metaValueText.length(); i++) {
            char c = metaValueText.charAt(i);
            if (!inWord && c == '$' && i + 1 < metaValueText.length() && metaValueText.charAt(i + 1) == '{') {
                inWord = true;
                i++;
                tempWord.setLength(0);
                continue;
            }
            if (inWord) {
                if (c == '}') {
                    index++;
                    String newVarName = "var" + index;
                    newMetaValueText.append(newVarName);
                    Object value = context.get(tempWord.toString());
                    if (value != null && StringUtils.isNotBlank(value.toString())) {
                        context.put(newVarName, value);
                    }
                    inWord = false;
                    tempWord.setLength(0);
                } else {
                    tempWord.append(c);
                }
            } else {
                newMetaValueText.append(c);
            }
        }
        return newMetaValueText.toString();
    }
}
