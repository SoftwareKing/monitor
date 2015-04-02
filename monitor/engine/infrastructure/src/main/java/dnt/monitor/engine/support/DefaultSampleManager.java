package dnt.monitor.engine.support;

import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.engine.service.Visitor;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.*;
import dnt.monitor.meta.misc.MetaKeyed;
import dnt.monitor.model.*;
import dnt.monitor.service.SampleService;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.spring.Bean;
import net.happyonroad.type.Availability;
import net.happyonroad.util.IpUtils;
import net.happyonroad.util.ParseUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Array;
import java.util.*;

import static org.apache.commons.lang.exception.ExceptionUtils.getRootCause;

/**
 * <h1>SampleManager抽象实现类</h1>
 *
 * @author mnnjie
 */
@SuppressWarnings("unchecked")
public abstract class DefaultSampleManager extends Bean implements SampleService {

    @Override
    public List<Component> sampleComponents(ResourceNode node, MetaRelation relation) throws SampleException {
        Visitor visitor = visitor(node);
        MetaModel metaModel = relation.getMetaModel();
        try {
            return buildMultipleInstance(visitor, node, metaModel, true);
        } finally {
            returnBackVisitor(node, visitor);
        }
    }

    @Override
    public Component sampleComponent(ResourceNode node, MetaRelation relation) throws SampleException {
        Visitor visitor = visitor(node);
        MetaModel metaModel = relation.getMetaModel();
        try {
            return (Component) buildSingleInstance(visitor, node, metaModel, true);
        } finally {
            returnBackVisitor(node, visitor);
        }
    }

    @Override
    public Component sampleComponent(ResourceNode node, MetaRelation relation, Object identifier)
            throws SampleException {
        //TODO 关于identifier的含义还需要确定
        throw new SampleException("not support sample with identifier");
    }

    @Override
    public List<Entry> sampleEntries(ResourceNode node, MetaRelation relation) throws SampleException {
        Visitor visitor = visitor(node);
        MetaModel metaModel = relation.getMetaModel();
        try {
            return buildMultipleInstance(visitor, node, metaModel, true);
        } finally {
            returnBackVisitor(node, visitor);
        }
    }

    @Override
    public Entry sampleEntry(ResourceNode node, MetaRelation relation) throws SampleException {
        Visitor visitor = visitor(node);
        MetaModel metaModel = relation.getMetaModel();
        try {
            return (Entry) buildSingleInstance(visitor, node, metaModel, true);
        } finally {
            returnBackVisitor(node, visitor);
        }
    }

    @Override
    public Resource sampleResource(ResourceNode node, MetaResource metaResource) throws SampleException {
        Visitor visitor = visitor(node);
        try {
            Set<String> needSampleSet = needSample(metaResource);

            Resource resource = (Resource) buildSingleInstance(visitor, node, metaResource, true);
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
                if ("array".equalsIgnoreCase(metaRelation.getDataType())) { //多实例时
                    List<Object> listObj = buildMultipleInstance(visitor, node, metaRelation.getMetaModel(), true);
                    if (List.class.isAssignableFrom(metaRelation.getProperty().getPropertyType())) { //是List时
                        setProperty(node, resource, metaRelation.getName(), listObj);
                    } else { //是数组时
                        Class<?> propertyClass = metaRelation.getMetaModel().getModelClass();
                        Object arrayObj = Array.newInstance(propertyClass, listObj.size());
                        for (int i = 0; i < listObj.size(); i++) {
                            Array.set(arrayObj, i, listObj.get(i));
                        }
                        setProperty(node, resource, metaRelation.getName(), arrayObj);
                    }
                } else { //单实例时
                    Object singleObj = buildSingleInstance(visitor, node, relModel, true);
                    setProperty(node, resource, metaRelation.getName(), singleObj);
                }
            }
            return resource;
        } finally {
            returnBackVisitor(node, visitor);
        }
    }

    /**
     * 获得Visitor
     */
    protected abstract Visitor visitor(ResourceNode node) throws SampleException;

    /**
     * 归还Visitor
     */
    protected abstract void returnBackVisitor(ResourceNode node, Visitor visitor);

    /**
     * 用于资源、单实例组件、单实例Entry
     * 解析并执行类上的采集指令，如果存在继承，则按照父类->子类的顺序执行，执行结果顺序放在List中
     *
     * @param visitor   访问器
     * @param node      资源node(记录log时使用)
     * @param metaModel 模型
     * @param onlyKeyed 是否只采集关键指标、组件、Entry
     * @return 对于组件和Entry只有一个Map；对于资源，本身和每个父类均是一个Map，List中的顺序为父类->子类
     * @throws SampleException
     */
    protected abstract List<GeneralMap<String, Object>> sampleSingleInstance(Visitor visitor, ResourceNode node,
                                                                             MetaModel metaModel, boolean onlyKeyed)
            throws SampleException;

    /**
     * 用于多实例组件、多实例Entry
     * 解析并执行类上的采集指令
     *
     * @param visitor   访问器
     * @param node      资源node(记录log时使用)
     * @param metaModel 模型
     * @param onlyKeyed 是否只采集关键指标、组件、Entry
     * @return 每个Map代表一个实例
     * @throws SampleException
     */
    protected abstract List<GeneralMap<String, Object>> sampleMultipleInstance(Visitor visitor, ResourceNode node,
                                                                               MetaModel metaModel, boolean onlyKeyed)
            throws SampleException;

    /**
     * 解析并执行Field上的采集指令
     *
     * @param visitor   访问器
     * @param node      资源node(记录log时使用)
     * @param model     模型
     * @param metaField Field模型
     * @param onlyKeyed 是否只采集关键指标
     * @return 不支持Field采集或无需采集的Field，返回null即可
     * @throws SampleException
     */
    protected abstract GeneralMap<String, Object> sampleField(Visitor visitor, ResourceNode node, MetaModel metaModel,
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
            if(metaMember.getKeyed() == null){ //非keyed的属性不采集
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
    private Object computeField(MetaField metaField, Map<String, Object> dataMap) throws SampleException {
        return getFieldComputer().computeField(metaField, dataMap);
    }

    /**
     * 采集并创建单实例对象
     */
    private Object buildSingleInstance(Visitor visitor, ResourceNode node, MetaModel metaModel, boolean onlyKeyed)
            throws SampleException {
        Object model;
        if (metaModel instanceof MetaResource) {
            model = buildModel((MetaResource) metaModel, node);
        } else {
            model = buildModel(metaModel);
        }
        List<MetaField> fieldList = metaModel.getFields();

        //执行类上的指令
        List<GeneralMap<String, Object>> dataList = sampleSingleInstance(visitor, node, metaModel, onlyKeyed);
        for (Map<String, Object> dataMap : dataList) {
            for (MetaField field : fieldList) {
                buildField(node, model, field, dataMap);
            }
        }

        //执行Field上的指令
        for (MetaField field : fieldList) {
            Map<String, Object> dataMap = sampleField(visitor, node, metaModel, model, field, onlyKeyed);
            if (dataMap != null) {
                buildField(node, model, field, dataMap);
            }
        }
        return model;
    }

    /**
     * 采集并创建多实例对象
     */
    private <T> List<T> buildMultipleInstance(Visitor visitor, ResourceNode node, MetaModel metaModel,
                                              boolean onlyKeyed)
            throws SampleException {

        List<T> resultList = new ArrayList<T>();
        List<MetaField> fieldList = metaModel.getFields();
        //执行类上的指令
        List<GeneralMap<String, Object>> dataList = sampleMultipleInstance(visitor, node, metaModel, onlyKeyed);
        for (Map<String, Object> dataMap : dataList) {
            Object model = buildModel(metaModel);
            resultList.add((T) model);
            for (MetaField field : fieldList) {
                buildField(node, model, field, dataMap);
            }
            //执行Field上的指令
            for (MetaField field : fieldList) {
                Map<String, Object> fieldDataMap = sampleField(visitor, node, metaModel, model, field, onlyKeyed);
                if (fieldDataMap != null) {
                    buildField(node, model, field, fieldDataMap);
                }
            }
        }
        if (metaModel.getName().equals("NIC")) {
            updateNICProperty(node.getResource(), resultList, dataList);
        }
        return resultList;
    }

    private void updateNICProperty(Resource resource, List objectList, List<GeneralMap<String, Object>> tableValue) {
        for (Object nic : objectList) {
            NIC theNic = (NIC) nic;
            theNic.setType("/interface");
            theNic.setResource((Device) resource);
            for (GeneralMap<String, Object> dataMap : tableValue) {
                if (null != dataMap.get("PhysAddress") &&
                    dataMap.get("PhysAddress").toString().equals(theNic.getAddress())) {
                    theNic.setLabel(dataMap.get("Descr").toString());
                    Integer operStatus = Integer.valueOf(dataMap.get("OperStatus").toString());
                    Availability availability;
                    if (operStatus == 1) {
                        availability = Availability.Unavailable;
                    } else if (operStatus == 2) {
                        availability = Availability.Available;
                    } else if (operStatus == 3) {
                        availability = Availability.Testing;
                    } else {
                        availability = Availability.Unknown;
                    }
                    theNic.setAvailability(availability);
                    theNic.setAddress(IpUtils.regularMAC(theNic.getAddress()));
                }
            }
        }
    }

    private void buildField(ResourceNode node, Object model, MetaField field, Map<String, Object> dataMap) {
        Object fieldValue;
        try {
            fieldValue = computeField(field, dataMap);
        } catch (Exception ex) {
            logger.error("compute field value failed,node={},model={},field={},dataMap={},reason={},cause={}",
                         getNodeName(node),
                         model.getClass().getName(), field.getName(), ParseUtils.toJSONString(dataMap), ex.getMessage(),
                         getRootCause(ex));
            return;
        }
        if (fieldValue != null) {
            setProperty(node, model, field.getName(), fieldValue);
        }
    }

    /**
     * 设置资源对象的属性
     */
    private void setProperty(ResourceNode node, Object owner, String fieldName, Object value) {
        try {
            PropertyUtils.setProperty(owner, fieldName, value);
        } catch (Exception ex) {
            logger.error("set property failed,node={},model={},field={},value={},reason={},cause={}", getNodeName(node),
                         owner.getClass().getName(), fieldName, value, ex.getMessage(),
                         getRootCause(ex));
        }
    }

    /**
     * 创建Resource，如果node中有Resource，则更新node中的Resource
     */
    private Resource buildModel(MetaResource metaResource, ResourceNode resourceNode) throws SampleException {
        try {
            Resource mo = (Resource) metaResource.getModelClass().newInstance();
            if (resourceNode.getResource() != null) {
                String originType = mo.getType();
                mo.apply(resourceNode.getResource());
                mo.setType(originType);
            }
            resourceNode.setResource(mo);
            return mo;
        } catch (Exception ex) {
            throw new SampleException("build MetaModel instance failed:" + metaResource.getName(), ex);
        }
    }

    /**
     * 由MetaModel创建ManagedObject
     */
    private <T> T buildModel(MetaModel metaModel) throws SampleException {
        try {
            return (T) metaModel.getModelClass().newInstance();
        } catch (Exception ex) {
            throw new SampleException("build MetaModel instance failed:" + metaModel.getName(), ex);
        }
    }

    /**
     * 判断是否为key属性
     */
    protected boolean isKey(MetaKeyed metaKeyed) {
        if (metaKeyed == null) {
            return false;
        }
        //TODO 以后会扩展Keyed中value值的含义
        return true;
    }

    /**
     * 获得node的显示名（ip地址优先于label）
     */
    protected String getNodeName(ResourceNode node) {
        if (node == null) {
            return "";
        }
        if (node.getResource() != null && StringUtils.isNotBlank(node.getResource().getAddress())) {
            return node.getResource().getAddress();
        } else {
            return node.getLabel();
        }
    }
}
