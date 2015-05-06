package dnt.monitor.support.resolver;

import dnt.monitor.annotation.Depends;
import dnt.monitor.annotation.Keyed;
import dnt.monitor.meta.MetaDepends;
import dnt.monitor.meta.MetaEvent;
import dnt.monitor.meta.MetaKeyed;
import dnt.monitor.model.ManagedObject;
import dnt.monitor.service.MetaService;
import net.happyonroad.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;

import static net.happyonroad.util.StringUtils.translate;

/**
 * <h1>Meta Object Resolver</h1>
 *
 * @author Jay Xiong
 */
public class MetaObjectResolver extends MetaResolverHelper {
    @Autowired
    MessageSource messageSource;
    @Autowired
    MetaService   metaService;

    protected MetaKeyed resolveMetaKeyed(Keyed keyed) {
        MetaKeyed metaKeyed = new MetaKeyed();
        metaKeyed.setValue(keyed.value());
        return metaKeyed;
    }

    protected MetaDepends resolveMetaDepends(Depends depends) {
        MetaDepends metaDepends = new MetaDepends();
        metaDepends.setValue(depends.value());
        return metaDepends;
    }


    protected void translateEventLabel(Class klass, MetaEvent event, String... extra) {
        String klassName = event.getSource();
        event.setLabel(message(klass, ".label", klassName) /* Resource.label */
                       + message("Syntax.OWN", "'s ") +
                       message(klass, event.getProperty() + ".label", event.getProperty()) /*Resource.address.label*/
                       + StringUtils.join(extra)
                       + message("Syntax.IS", "=") +
                       message(klass, event.getProperty() + "." + event.getValue(), event.getValue()) /*Resource.address.Changed*/
                      );
    }

    protected void translateEventDescription(Class<?> klass, MetaEvent event, float critical, float warning,
                                           String unit) {
        String field = message(klass, event.getProperty() + ".label", event.getProperty());
        String condition;
        boolean normal = critical > warning ;
        String GR = message("Syntax.GR", " > ");
        String LT = message("Syntax.LT", " < ");
        if( "Critical".equals(event.getValue())){
            condition = (normal ? GR : LT) + critical + unit;
            event.setDescription(field + condition);
        }else if("Warning".equals(event.getValue())){
            condition = normal ? ( GR + warning + unit + message("Syntax.And", " && ") + LT + critical + unit) :
                        ( LT + warning + unit + message("Syntax.And", " && ") + GR + critical + unit);
            event.setDescription(field + condition);
        }else if("Normal".equals(event.getValue())){
            condition = (normal ? LT : GR) + warning + unit;
            event.setDescription(field + condition);
        }else {//Unknown
            event.setDescription(field + message("Syntax.Value", "value") + message("Syntax.IS", "value") + message("Unknown", "unknown"));
        }

    }

    /**
     * 根据类型寻找资源信息，如果在当前类型上没有找到，则继续向父类型寻找
     *
     * @param klass    对象类型
     * @param suffix   属性名称后缀
     * @param defaults 缺省值
     * @return 字符串
     */
    protected String message(Class klass, String suffix, String defaults) {
        String className = reduceCglibName(klass.getSimpleName());
        try {
            String code;
            if (suffix.startsWith(".")) code = className + suffix;
            else code = className + "." + suffix;
            return translate(messageSource, code);
        } catch (NoSuchMessageException e) {
            if (ManagedObject.class.isAssignableFrom(klass.getSuperclass())) {
                return message(klass.getSuperclass(), suffix, defaults);
            } else {
                String code;
                if( suffix.startsWith(".") ) code = suffix.substring(1);
                else code = suffix;
                return message(code, defaults);
            }
        }
    }

    protected String message(Class klass, String suffix) {
        return message(klass, suffix, null);
    }

    protected String message(String code, String defaults) {
        try {
            return translate(messageSource, code);
        } catch (NoSuchMessageException e) {
            if( code.contains(".") )
                return message(code.substring(code.indexOf('.') + 1), defaults);
            else
                return defaults;
        }
    }

    static String reduceCglibName(String className) {
        int pos = className.indexOf("$$EnhancerByCGLIB");
        return pos > 0 ? className.substring(0, pos) : className;
    }
}
