/**
 * Developer: Kadvin Date: 15/2/5 下午12:47
 */
package dnt.monitor.meta;

import dnt.monitor.model.ManagedObject;

import java.beans.PropertyDescriptor;

/**
 * <h1>Component/Resource/Link等对象作为某个资源的成员时的对应字段元信息</h1>
 */
public class MetaRelation extends MetaMember {
    private final MetaModel metaModel;

    public MetaRelation(Class<? extends ManagedObject> declaringClass,
                        PropertyDescriptor property, MetaModel meta) {
        super(declaringClass, property);
        this.metaModel = meta;
    }

    /**
     * <h2>对端对象的元模型(link/component/resource)</h2>
     * @return  对端对象的元模型
     */
    public MetaModel getMetaModel() {
        return metaModel;
    }
}
