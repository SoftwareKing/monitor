package dnt.monitor.engine.support;

import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.engine.service.GenericSampleService;
import dnt.monitor.service.Visitor;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.*;
import dnt.monitor.model.Component;
import dnt.monitor.model.Entry;
import dnt.monitor.model.Resource;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.util.MiscUtils;
import net.happyonroad.util.ParseUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Array;
import java.util.*;

/**
 * <h1>SampleManager抽象实现类</h1>
 *
 * @author mnnjie
 */
@SuppressWarnings("unchecked")
public abstract class DefaultGenericSampleManager<V extends Visitor> extends AbstractSampleManager implements GenericSampleService<V> {

    protected String getResourceType(Visitor visitor){
        return visitor.getResource().getType();
    }

    @Override
    public Resource sampleResource(Visitor visitor, MetaResource metaResource) throws SampleException {
        Set<String> needSampleSet = needSample(metaResource);

        Resource resource = (Resource) buildSingleInstance((V)visitor, metaResource, null, true);
        //采集组件和Entry
        List<MetaRelation> metaComponentRelationList = metaResource.getComponents();
        List<MetaRelation> metaEntryRelationList = metaResource.getEntries();
        List<MetaRelation> relationList = new ArrayList<MetaRelation>();
        relationList.addAll(metaComponentRelationList);
        relationList.addAll(metaEntryRelationList);
        for (MetaRelation metaRelation : relationList) {
            if (!needSampleSet.contains(metaRelation.getName())) { //不在采集范围内的组件和Entry
                continue;
            }
            MetaModel relModel = metaRelation.getMetaModel();
            if (DataType.array.equals(metaRelation.getDataType())) { //多实例时
                List<Object> listObj = buildMultipleInstance((V)visitor, metaRelation.getMetaModel(), metaRelation, true);
                if (List.class.isAssignableFrom(metaRelation.getProperty().getPropertyType())) { //是List时
                    setProperty(resource, metaRelation.getName(), listObj);
                } else { //是数组时
                    Class<?> propertyClass = metaRelation.getMetaModel().getModelClass();
                    Object arrayObj = Array.newInstance(propertyClass, listObj.size());
                    for (int i = 0; i < listObj.size(); i++) {
                        Array.set(arrayObj, i, listObj.get(i));
                    }
                    setProperty(resource, metaRelation.getName(), arrayObj);
                }
            } else if ( DataType.single.equals(metaRelation.getDataType())){ //单实例时
                Object singleObj = buildSingleInstance((V)visitor, relModel, metaRelation, true);
                setProperty(resource, metaRelation.getName(), singleObj);
            }else{
                throw new UnsupportedOperationException("Generic sample manager can't support map type now");
            }
        }
        return resource;
    }

    @Override
    public List<Component> sampleComponents(Visitor visitor, MetaRelation relation, Object... args) throws SampleException {
        MetaModel metaModel = relation.getMetaModel();
        return buildMultipleInstance((V)visitor, metaModel, relation, true, args);
    }

    @Override
    public Component sampleComponent(Visitor visitor, MetaRelation relation) throws SampleException {
        MetaModel metaModel = relation.getMetaModel();
        return (Component) buildSingleInstance((V)visitor, metaModel, relation, true);
    }

    @Override
    public Component sampleComponent(Visitor visitor, MetaRelation relation, Object identifier)
            throws SampleException {
        //TODO 关于identifier的含义还需要确定
        throw new SampleException("not support sample with identifier");
    }

    @Override
    public List<Entry> sampleEntries(Visitor visitor, MetaRelation relation) throws SampleException {
        MetaModel metaModel = relation.getMetaModel();
        return buildMultipleInstance((V)visitor, metaModel, relation, true);
    }

    @Override
    public Entry sampleEntry(Visitor visitor, MetaRelation relation) throws SampleException {
        MetaModel metaModel = relation.getMetaModel();
        return (Entry) buildSingleInstance((V)visitor, metaModel, relation, true);
    }

    /**
     * 用于资源、单实例组件、单实例Entry
     * 解析并执行类上的采集指令，如果存在继承，则按照父类->子类的顺序执行，执行结果顺序放在List中
     *
     * @param visitor   访问器
     * @param metaModel 模型
     * @param metaRelation  被采集对象如果属于资源下的组件/结构体，其属性字段，如果是顶级资源，则留空
     * @param onlyKeyed 是否只采集关键指标、组件、Entry  @return 对于组件和Entry只有一个Map；对于资源，本身和每个父类均是一个Map，List中的顺序为父类->子类
     * @throws SampleException
     */
    protected abstract GeneralMap<String, Object> sampleSingleInstance(V visitor, MetaModel metaModel,
                                                                             MetaRelation metaRelation,
                                                                             boolean onlyKeyed)
            throws SampleException;

    /**
     * 用于多实例组件、多实例Entry
     * 解析并执行类上的采集指令
     *
     * @param visitor   访问器
     * @param metaModel 被采集的目标对象模型，如组件模型，Entry模型
     * @param metaRelation  被采集对象如果属于资源下的组件/结构体，其属性字段，如果是顶级资源，则留空
     * @param onlyKeyed 是否只采集关键指标、组件、Entry  @return 每个Map代表一个实例
     * @param args 参数
     * @throws SampleException
     */
    protected abstract List<GeneralMap<String, Object>> sampleMultipleInstance(V visitor, MetaModel metaModel,
                                                                               MetaRelation metaRelation,
                                                                               boolean onlyKeyed,
                                                                               Object... args)
            throws SampleException;

    /**
     * 解析并执行Field上的采集指令
     *
     * @param visitor   访问器
     * @param model     模型
     * @param metaField Field模型
     * @param onlyKeyed 是否只采集关键指标
     * @return 不支持Field采集或无需采集的Field，返回null即可
     * @throws SampleException
     */
    protected abstract GeneralMap<String, Object> sampleField(V visitor, MetaModel metaModel,
                                                              Object model, MetaField metaField, boolean onlyKeyed)
            throws SampleException;

    /**
     * 获得Field值计算器实现
     */
    protected abstract FieldComputer getFieldComputer();

    /**
     * 获得需要采集的memberName集合
     */
    protected Set<String> needSample(MetaModel metaModel) {
        Set<String> needSampleSet = new HashSet<String>();
        List<MetaMember> members = metaModel.getMembers();
        for (MetaMember metaMember : members) {
            if (!isKeyed(metaMember) ) { //非keyed的属性不采集
                continue;
            }
            resolveDepends(needSampleSet, metaModel, metaMember);
        }
        return needSampleSet;
    }

    /**
     * 递归寻找需要采集的member
     */
    private void resolveDepends(Set<String> needSampleSet, MetaModel metaModel, MetaMember metaMember) {
        if (metaMember.getDepends() == null) {
            needSampleSet.add(metaMember.getName());
            return;
        }
        String[] depends = metaMember.getDepends().getValue();
        if (depends == null || depends.length == 0) {
            return;
        }
        for (String dependsMemberName : depends) {
            if (StringUtils.isNotBlank(dependsMemberName)) {
                MetaMember dependsMember = metaModel.getMember(dependsMemberName);
                if (dependsMember != null) {
                    resolveDepends(needSampleSet, metaModel, dependsMember);
                }
            }
        }
    }


    /**
     * 计算Field的值
     */
    private Object computeField(String type, MetaField metaField, Map<String, Object> dataMap) throws SampleException {
        return getFieldComputer().computeField(type, metaField, dataMap);
    }

    /**
     * <h2>采集并创建单实例对象</h2>
     *
     * @param visitor 访问对象的访问器
     * @param metaModel 需要采集的对象模型
     * @param metaRelation 被采集对象如果属于资源下的组件，其属性字段，如果是顶级资源，则留空
     * @param onlyKeyed 是否只采集关键组件/字段
     */
    Object buildSingleInstance(V visitor, MetaModel metaModel, MetaRelation metaRelation, boolean onlyKeyed)
            throws SampleException {
        String type = getResourceType(visitor);
        Object model;
        if (metaModel instanceof MetaResource) {
            model = buildModel((MetaResource) metaModel, visitor.getResource());
        } else {
            model = buildModel(metaModel);
        }
        List<MetaField> fieldList = metaModel.getFields();

        //执行类上的指令
        GeneralMap<String, Object> theMap = sampleSingleInstance(visitor, metaModel, metaRelation, onlyKeyed);
        for (MetaField field : fieldList) {
            buildField(type, model, field, theMap);
        }

        //执行Field上的指令
        for (MetaField field : fieldList) {
            Map<String, Object> dataMap = sampleField(visitor, metaModel, model, field, onlyKeyed);
            if (dataMap != null) {
                buildField(type, model, field, dataMap);
            }
        }
        return model;
    }

    /**
     * <h2>采集并创建多实例对象</h2>
     *  @param visitor 访问对象的访问器
     * @param metaModel 需要采集的对象模型
     * @param metaRelation 被采集对象如果属于资源下的组件，其属性字段，如果是顶级资源，则留空
     * @param onlyKeyed 是否只采集关键组件/字段
     * @param args  额外的参数
     */
    <X> List<X> buildMultipleInstance(V visitor,
                                      MetaModel metaModel,
                                      MetaRelation metaRelation,
                                      boolean onlyKeyed,
                                      Object... args)
            throws SampleException {
        String type = getResourceType(visitor);
        List<X> resultList = new ArrayList<X>();
        List<MetaField> fieldList = metaModel.getFields();
        //执行类上的指令
        List<GeneralMap<String, Object>> dataList = sampleMultipleInstance(visitor, metaModel, metaRelation, onlyKeyed, args);
        for (Map<String, Object> dataMap : dataList) {
            Object model = buildModel(metaModel);
            resultList.add((X) model);
            for (MetaField field : fieldList) {
                buildField(type, model, field, dataMap);
            }
            //执行Field上的指令
            for (MetaField field : fieldList) {
                Map<String, Object> fieldDataMap = sampleField(visitor, metaModel, model, field, onlyKeyed);
                if (fieldDataMap != null) {
                    buildField(type, model, field, fieldDataMap);
                }
            }
        }
//        if (metaModel.getName().equals("NIC")) {
//            updateNICProperty(node.getResource(), resultList, dataList);
//        }
        return resultList;
    }

    private void buildField(String type, Object model, MetaField field, Map<String, Object> dataMap) {
        Object fieldValue;
        try {
            fieldValue = computeField(type, field, dataMap);
        } catch (Exception ex) {
            logger.warn("{}.{} = computeField({}), reason={}",
                         model.getClass().getName(), field.getName(),
                         ParseUtils.toJSONString(dataMap), MiscUtils.describeException(ex));
            return;
        }
        if (fieldValue != null) {
            setProperty(model, field.getName(), fieldValue);
        }
    }

    /**
     * 设置资源对象的属性
     */
    private void setProperty(Object owner, String fieldName, Object value) {
        try {
            PropertyUtils.setProperty(owner, fieldName, value);
        } catch (Exception ex) {
            logger.error("{}.{} = {} failed, reason={},cause={}",
                         owner.getClass().getName(), fieldName, value, MiscUtils.describeException(ex));
        }
    }

    /**
     * 创建Resource，如果node中有Resource，则更新node中的Resource
     */
    private Resource buildModel(MetaResource metaResource, Resource origin) throws SampleException {
        try {
            Resource mo = metaResource.newInstance();
            if (origin != null) {
                String moType = mo.getType();//has been assigned by meta resource
                // maybe override moType
                mo.apply(origin);
                // type of meta resource specified by caller
                mo.setType(moType);
            }
            return mo;
        } catch (Exception ex) {
            throw new SampleException("build MetaModel instance failed:" + metaResource.getName(), ex);
        }
    }

    /**
     * 由MetaModel创建ManagedObject
     */
    private <X> X buildModel(MetaModel metaModel) throws SampleException {
        try {
            return (X) metaModel.newInstance();
        } catch (Exception ex) {
            throw new SampleException("build MetaModel instance failed:" + metaModel.getName(), ex);
        }
    }

    /**
     * 判断是否为key属性
     */
    protected boolean isKeyed(MetaMember member){
        MetaKeyed keyed = member.getKeyed();
        if (keyed == null) {
            return false;
        }
        //TODO 以后会扩展Keyed中value值的含义
        return true;
    }
}
