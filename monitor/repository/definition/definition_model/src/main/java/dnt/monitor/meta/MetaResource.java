/**
 * Developer: Kadvin Date: 15/2/4 上午9:27
 */
package dnt.monitor.meta;

import dnt.monitor.model.Resource;
import net.happyonroad.model.Category;

import java.util.ArrayList;
import java.util.List;

/**
 * <h1>各种Resource对象的元信息</h1>
 * <p/>
 * 实质是对某个Resource类的描述,
 * <p/>
 * <h2>分类(Category)与MetaResource的关系</h2>
 * <p/>
 * Category的结构与Resource的结构一致；
 * 但是，Category不会将所有的Resource的类都表达出来
 * Category的目的是让用户以比较高层的视角来进行资源的管理
 */
@SuppressWarnings("UnusedDeclaration")
public class MetaResource<T extends Resource> extends MetaModel<T> implements Comparable<MetaResource> {
    private Category category;

    public MetaResource(Class<T> klass) {
        super(klass);
    }

    /**
     * 返回所有的结构体元信息
     *
     * @return 组件结构体信息
     */
    public List<MetaRelation> getEntries() {
        List<MetaRelation> metaEntryRelations = new ArrayList<MetaRelation>();
        for (MetaMember member : metaMembers) {
            if (member instanceof MetaRelation &&
                (((MetaRelation) member).getMetaModel() instanceof MetaEntry))
                metaEntryRelations.add((MetaRelation) member);
        }
        return metaEntryRelations;
    }

    /**
     * 返回所有的组件元信息
     *
     * @return 组件元信息
     */
    public List<MetaRelation> getComponents() {
        List<MetaRelation> metaComponentRelations = new ArrayList<MetaRelation>();
        for (MetaMember member : metaMembers) {
            if (member instanceof MetaRelation &&
                (((MetaRelation) member).getMetaModel() instanceof MetaComponent))
                metaComponentRelations.add((MetaRelation) member);
        }
        return metaComponentRelations;
    }

    /**
     * 返回所有的链接元信息
     *
     * @return 链接元信息
     */
    public List<MetaRelation> getLinks() {
        List<MetaRelation> metaLinkRelations = new ArrayList<MetaRelation>();
        for (MetaMember member : metaMembers) {
            if (member instanceof MetaRelation &&
                (((MetaRelation) member).getMetaModel() instanceof MetaLink))
                metaLinkRelations.add((MetaRelation) member);
        }
        return metaLinkRelations;
    }

    /**
     * 返回所有的关联资源元信息
     *
     * @return 关联资源元信息
     */
    public List<MetaRelation> getResources() {
        List<MetaRelation> metaResourceRelations = new ArrayList<MetaRelation>();
        for (MetaMember member : metaMembers) {
            if (member instanceof MetaRelation &&
                (((MetaRelation) member).getMetaModel() instanceof MetaResource))
                metaResourceRelations.add((MetaRelation) member);
        }
        return metaResourceRelations;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Category getCategory() {
        return category;
    }

    public String getType(){
        return category.getType();
    }

    @SuppressWarnings("unchecked")
    @Override
    public int compareTo(MetaResource o) {
        if (getModelClass().isAssignableFrom(o.getModelClass())) {
            return -1;
        } else if (o.getModelClass().isAssignableFrom(getModelClass())) {
            return 1;
        } else {
            int depth = Category.depth(getType());
            int depth2 = Category.depth(o.getType());
            return depth - depth2;
        }
    }

    @Override
    public T newInstance() {
        T instance = super.newInstance();
        instance.setType(getType());
        return instance;
    }
}
