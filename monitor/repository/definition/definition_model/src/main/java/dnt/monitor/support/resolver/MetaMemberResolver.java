package dnt.monitor.support.resolver;

import dnt.monitor.annotation.Depends;
import dnt.monitor.annotation.Keyed;
import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.MetaMember;
import dnt.monitor.meta.MetaDepends;
import dnt.monitor.meta.MetaKeyed;
import dnt.monitor.model.ManagedObject;
import net.happyonroad.util.StringUtils;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;

import static org.apache.commons.lang.StringUtils.capitalize;

/**
 * <h1>Meta Member Resolver</h1>
 *
 * @author Jay Xiong
 */
public abstract class MetaMemberResolver<M extends MetaMember> extends MetaObjectResolver {

    abstract M createMetaMember(Class klass, PropertyDescriptor descriptor, Field field) throws MetaException;

    /**
     * <h2>Resolve The meta member of klass, by specified annotation</h2>
     *
     * @param klass      the klass of the meta member defined for
     * @param descriptor the field descriptor
     * @param field      the field
     * @return the resolved meta member
     * @throws MetaException
     */
    protected M resolve(Class klass, PropertyDescriptor descriptor, Field field)
            throws MetaException {
        M member = createMetaMember(klass, descriptor, field);
        applyDefaults(klass, member);
        //Entry field without keyed
        if (ManagedObject.class.isAssignableFrom(klass)) {
            Keyed keyed = findAnnotation(descriptor, field, Keyed.class);
            if (keyed != null) {
                MetaKeyed metaKeyed = resolveMetaKeyed(keyed);
                member.setKeyed(metaKeyed);
            }
        }

        Depends depends = findAnnotation(descriptor, field, Depends.class);
        if (depends != null) {
            MetaDepends metaDepends = resolveMetaDepends(depends);
            member.setDepends(metaDepends);
        }
        return member;
    }

    /**
     * <h2>根据 配置的 messages 里面的内容，为元模型的元属性设置值</h2>
     * 仅在原来对象没有设置该属性时进行设置，包括:
     * <ol>
     * <li>label: $(class.simpleName).$(name).label
     * <li>unit: $(class.simpleName).$(name).unit
     * <li>description: $(class.simpleName).$(name).description
     * </ol>
     *
     * @param metaMember 需要配置的成员
     */
    protected void applyDefaults(Class klass, MetaMember metaMember) {
        String fieldName = metaMember.getName();
        if (StringUtils.isBlank(metaMember.getLabel())) {
            String label = message(klass, "." + fieldName + ".label", capitalize(fieldName));
            metaMember.setLabel(label);
        }
        if (StringUtils.isBlank(metaMember.getDescription())) {
            String description = message(klass, "." + fieldName + ".description");
            if (StringUtils.isNotBlank(description)) metaMember.setDescription(description);
        }
        if (metaMember instanceof MetaField) {
            MetaField metaField = (MetaField) metaMember;
            if (StringUtils.isBlank(metaField.getUnit())) {
                String unit = message(klass, "." + fieldName + ".unit");
                if (StringUtils.isNotBlank(unit)) metaField.setUnit(unit);
            }
        }
    }

}
