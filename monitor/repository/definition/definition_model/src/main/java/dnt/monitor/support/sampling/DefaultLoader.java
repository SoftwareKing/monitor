package dnt.monitor.support.sampling;

import dnt.monitor.meta.sampling.MetaOS;
import dnt.monitor.meta.sampling.MetaRoot;
import dnt.monitor.meta.sampling.MetaValue;
import dnt.monitor.service.sampling.Loader;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.service.TypeConverter;
import dnt.monitor.service.TypeConverterService;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.spring.Bean;
import net.happyonroad.util.ParseUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.expression.MapAccessor;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

import static org.apache.commons.lang.exception.ExceptionUtils.getRootCauseMessage;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
@Component
public class DefaultLoader extends Bean implements Loader {
    @Override
    public void load(Class<? extends MetaRoot> rootClass, String resourceType,MetaField field, Object target,GeneralMap<String, Object> data) throws SampleException {
        Object fieldValue;
        try {
            fieldValue = computeField(rootClass, resourceType,field, data);
        } catch (Exception ex) {
            logger.debug("{}.{} = computeField({}), reason={}",
                         field.getDeclaringClass().getName(), field.getName(),
                         ParseUtils.toJSONString(data), getRootCauseMessage(ex));
            return;
        }
        if (fieldValue != null) {
            setProperty(target, field.getName(), fieldValue);
        }
    }

    @Autowired
    private TypeConverterService typeConverterService;
    private ExpressionParser elParser = new SpelExpressionParser();

    /**
     * 设置资源对象的属性
     */
    private void setProperty(Object owner, String fieldName, Object value) {
        try {
            PropertyUtils.setProperty(owner, fieldName, value);
        } catch (Exception ex) {
            logger.error("{}.{} = {} failed, reason={},cause={}",
                         owner.getClass().getName(), fieldName, value, getRootCauseMessage(ex));
        }
    }

    private MetaValue getMetaValue(Class<? extends MetaRoot> rootClass, MetaField metaField, String resourceType) {
        MetaRoot metaRoot = metaField.getAttribute(rootClass);
        if (metaRoot != null) {
            MetaOS metaOS = metaRoot.getMetaOs(resourceType);
            if (metaOS != null && metaOS.getMetaValue() != null) {
                return metaOS.getMetaValue();
            }
        }
        return null;
    }

    private Object computeField(Class<? extends MetaRoot> rootClass, String resourceType, MetaField metaField,
                                GeneralMap<String, Object> data) throws SampleException {
        Class valueClass = metaField.getProperty().getPropertyType();
        String expText = metaField.getName();
        MetaValue metaValue = getMetaValue(rootClass, metaField, resourceType);

        if (metaValue == null) { //没有放value标记时，按字段名进行匹配
            Object valueText = data.get(expText);
            if (valueText != null) {
                valueText = convertValue(metaField, valueClass, valueText.toString());
            }
            return valueText;
        } else {
            if (metaValue.getConstantValue() != null) {  //使用常量属性时，直接返回常量
                return convertValue(metaField, valueClass, metaValue.getConstantValue().toString());
            }
            if (StringUtils.isNotBlank(metaValue.getValue())) { //将value属性的值作为EL表达式解析
                expText = metaValue.getValue();
            }
        }

        StandardEvaluationContext standardEvaluationContext = new StandardEvaluationContext();
        standardEvaluationContext.addPropertyAccessor(new MapAccessor());
        String valueText;
        try {
            Expression expression = elParser.parseExpression(expText);
            valueText =
                    expression.getValue(standardEvaluationContext, data, String.class);
        } catch (Exception ex) {
            logger.debug("parse SpEL exp failed,field=" + metaField.getDeclaringClass().getName() + "/" +
                        metaField.getName() + ",exp=" + expText + ",context=" +
                        ParseUtils.toJSONString(data) + ",because of:" + ex.getMessage());
            return null;
        }
        return convertValue(metaField, valueClass, valueText);
    }

    private Object convertValue(MetaField metaField, Class valueClass, String valueText) throws SampleException {
        String converterName = valueClass.getName();
        TypeConverter converter = typeConverterService.get(converterName);
        if (converter == null) {
            throw new SampleException(
                    "can't find converter,field=" + metaField.getDeclaringClass().getName() + "/" +
                    metaField.getName() + ",converter=" + valueClass.getName()
            );
        }
        try {
            return converter.convert(valueText, null, valueClass);
        } catch (Exception ex) {
            throw new SampleException(
                    "convert value failed,field=" + metaField.getDeclaringClass().getName() + "/" +
                    metaField.getName() + ",converter=" + valueClass.getName() + ",valueText=" + valueText +
                    ",valueClass=" + valueClass.getName(), ex
            );
        }
    }

}
