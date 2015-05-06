package dnt.monitor.engine.support;

import dnt.monitor.engine.service.*;
import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.*;
import dnt.monitor.meta.sampling.*;
import dnt.monitor.model.Component;
import dnt.monitor.model.Entry;
import dnt.monitor.model.Resource;
import dnt.monitor.service.Visitor;
import dnt.monitor.service.sampling.CommandHandler;
import dnt.monitor.service.sampling.Loader;
import dnt.monitor.service.sampling.TransformerHandler;
import dnt.monitor.support.sampling.DefaultTransformerHandler;
import net.happyonroad.model.GeneralMap;
import net.happyonroad.support.DefaultGeneralMap;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.Array;
import java.util.*;
import static org.apache.commons.lang.exception.ExceptionUtils.getRootCauseMessage;

/**
 * <h1>SampleManager抽象实现类</h1>
 *
 * @author mnnjie
 */
@SuppressWarnings("unchecked")
public abstract class DefaultGenericSampleManager2<V extends Visitor, W extends MetaRoot> extends
                                                                                          AbstractSampleManager implements
                                                                                                                GenericSampleService<V> {

    @Autowired
    private Loader loader;

    private Class<? extends MetaRoot> wClass;

    protected DefaultGenericSampleManager2(Class<? extends MetaRoot> wClass) {
        this.wClass = wClass;
    }

    protected abstract CommandHandler defaultCommandHandler();

    protected TransformerHandler defaultTransformerHandler() {
        return new DefaultTransformerHandler();
    }

    protected Loader defaultLoader() {
        return loader;
    }

    protected String getResourceType(Visitor visitor) {
        return visitor.getResource().getType();
    }


    @Override
    public Resource sampleResource(Visitor visitor, MetaResource metaResource) throws SampleException {
        Resource resource = buildResource(metaResource, visitor.getResource());
        String resourceType = getResourceType(visitor);

        //执行Model上的MetaRoot，对于Resource来说，Model上的MetaRoot存在继承，应由父到子进行逐遍执行
        W[] metaRoots = (W[]) metaResource.getAttribute(Array.newInstance(wClass, 0).getClass());
        if (metaRoots != null) {
            GeneralMap<String, Object> modelDataMap = new DefaultGeneralMap<String, Object>();
            for (W metaRoot : metaRoots) {
                MetaOS metaOS = metaRoot.getMetaOs(resourceType);
                if (metaOS == null) {
                    continue;
                }
                PacksData data = extract((V)visitor,metaOS);
                if (data != null) {
                    MetaTransformer metaTransformer = metaOS.getTransformer();
                    TransformerHandler transformerHandler =
                            getHandler(metaTransformer.getClazz(), defaultTransformerHandler());

                    GeneralMap<String, Object> osDataMap = transformerHandler.transformToMap(resourceType,metaTransformer, data);
                    if (osDataMap != null) {
                        modelDataMap.putAll(osDataMap);
                    }
                }
            }
            LoadModel(wClass, resourceType, metaResource, resource, modelDataMap);
        }
        sampleFields((V)visitor,metaResource, resource, resourceType, null);

        Set<String> needSampleSet = needSample(metaResource);
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
            //执行Relation上的MetaRoot，此时有以下情况
            //1. Relation上有Command信息，此时Relation上的MetaRoot将覆盖relModel上的MetaRoot
            //2. Relation上没有Command信息,此时如果Relation上有args信息，args将被传递给relModel上的MetaRoot

            if (DataType.array.equals(metaRelation.getDataType())) { //多实例时
                List<Object> list = sampleMultiple((V)visitor, metaRelation);
                if (list.size() > 0) {
                    if (List.class
                            .isAssignableFrom(
                                    metaRelation.getProperty().getPropertyType())) { //是List时
                        setProperty(resource, metaRelation.getName(), list);
                    } else { //是数组时
                        Class<?> propertyClass = metaRelation.getMetaModel().getModelClass();
                        Object array = Array.newInstance(propertyClass, list.size());
                        for (int i = 0; i < list.size(); i++) {
                            Array.set(array, i, list.get(i));
                        }
                        setProperty(resource, metaRelation.getName(), array);
                    }
                }
            } else if (DataType.single.equals(metaRelation.getDataType())) { //单实例时
                Object relObj = sampleSingle((V)visitor, metaRelation);
                setProperty(resource, metaRelation.getName(), relObj);
            } else {
                throw new UnsupportedOperationException("Generic sample manager can't support map type now");
            }
        }
        return resource;
    }

    private List<String> mergeArgs(List<String> args,Object[] extraArgs){
        if(args==null){
            args = new ArrayList<String>();
        }
        for (Object extraArg:extraArgs){
            if(extraArg!=null){
                args.add(extraArg.toString());
            }
        }
        return args;
    }

    private <T> List<T> sampleMultiple(V visitor, MetaRelation relation,Object...extraArgs) throws SampleException {
        String resourceType = getResourceType(visitor);
        MetaModel relModel = relation.getMetaModel();
        W relRoot = (W) relation.getAttribute(wClass);
        MetaOS relOS = getMetaOS(relRoot, resourceType);
        List<String> args = getArgs(relRoot, resourceType);
        if (relOS == null) {
            //如果Relation上没有Command信息，则使用relModel上的信息
            //此时如果Relation上有参数，则relModel上的参数应被覆盖
            relRoot = (W) relModel.getAttribute(wClass);
            relOS = getMetaOS(relRoot, resourceType);
            if (relOS != null){
                if(args != null) {
                    relOS.setArgs(mergeArgs(args,extraArgs));
                }else{
                    relOS.setArgs(mergeArgs(relOS.getArgs(),extraArgs));
                }
            }
        }

        List<T> list = new ArrayList<T>();
        if (relOS == null) {  //多实例无法仅通过Field上的Command生成
            return list;
        }
        PacksData data = extract(visitor,relOS);
        if (data == null) {
            return list;
        }
        MetaTransformer metaTransformer = relOS.getTransformer();
        TransformerHandler transformerHandler =
                getHandler(metaTransformer.getClazz(), defaultTransformerHandler());
        List<GeneralMap<String, Object>> osDataMapList =
                transformerHandler.transformToTable(resourceType,metaTransformer, data);
        if (osDataMapList == null || osDataMapList.size() == 0) {
            return list;
        }
        for (GeneralMap<String, Object> osDataMap : osDataMapList) {
            T relObj = buildModel(relModel);
            LoadModel(wClass, resourceType, relModel, relObj, osDataMap);
            sampleFields(visitor,relModel, relObj, resourceType, mergeArgs(args,extraArgs));
            list.add(relObj);
        }
        return list;
    }

    private <T> T sampleSingle(V visitor, MetaRelation relation) throws SampleException {
        String resourceType = getResourceType(visitor);
        MetaModel relModel = relation.getMetaModel();
        W relRoot = (W) relation.getAttribute(wClass);
        MetaOS relOS = getMetaOS(relRoot, resourceType);
        List<String> args = getArgs(relRoot, resourceType);
        if (relOS == null) {
            //如果Relation上没有Command信息，则使用relModel上的信息
            //此时如果Relation上有参数，则relModel上的参数应被覆盖
            relRoot = (W) relModel.getAttribute(wClass);
            relOS = getMetaOS(relRoot, resourceType);
            if (relOS != null && args != null) {
                relOS.setArgs(args);
            }
        }

        T relObj = buildModel(relModel);
        if (relOS != null) {
            PacksData data = extract(visitor,relOS);
            if (data != null) {
                MetaTransformer metaTransformer = relOS.getTransformer();
                TransformerHandler transformerHandler =
                        getHandler(metaTransformer.getClazz(), defaultTransformerHandler());
                GeneralMap<String, Object> osDataMap = transformerHandler.transformToMap(resourceType,metaTransformer, data);
                if (osDataMap != null) {
                    LoadModel(wClass, resourceType, relModel, relObj, osDataMap);
                }
            }
        }
        sampleFields(visitor,relModel, relObj, resourceType, args);
        return relObj;
    }

    private MetaOS getMetaOS(W metaRoot, String resourceType) {
        if (metaRoot != null) {
            MetaOS metaOS = metaRoot.getMetaOs(resourceType);
            if (metaOS != null && metaOS.getMetaCommands() != null && metaOS.getMetaCommands().size() > 0) {
                return metaOS;
            }
        }
        return null;
    }

    private List<String> getArgs(W metaRoot, String resourceType) {
        if (metaRoot != null) {
            MetaOS metaOS = metaRoot.getMetaOs(resourceType);
            if (metaOS != null && metaOS.getArgs() != null && metaOS.getArgs().size() > 0) {
                return metaOS.getArgs();
            }
        }
        return null;
    }

    private void sampleFields(V visitor,MetaModel metaModel, Object model, String resourceType, List<String> args)
            throws SampleException {
        List<MetaField> fieldList = metaModel.getFields();
        for (MetaField field : fieldList) {
            //执行Field上的MetaRoot
            W metaRoot = (W) field.getAttribute(wClass);
            if (metaRoot == null) {
                continue;
            }
            MetaOS metaOS = metaRoot.getMetaOs(resourceType);
            if (metaOS == null) {
                continue;
            }
            if (args != null) {
                metaOS.setArgs(args);
            }
            PacksData data = extract(visitor,metaOS);
            if (data == null) {
                continue;
            }
            MetaTransformer metaTransformer = metaOS.getTransformer();
            TransformerHandler transformerHandler =
                    getHandler(metaTransformer.getClazz(), defaultTransformerHandler());
            GeneralMap<String, Object> osDataMap = transformerHandler.transformToMap(resourceType,metaTransformer, data);
            if (osDataMap == null) {
                continue;
            }
            defaultLoader().load(wClass, resourceType, field, model, osDataMap);
        }
    }

    private PacksData extract(V visitor,MetaOS metaOS) throws SampleException {
        PacksData data = null;
        List<MetaCommand> commands = metaOS.getMetaCommands();
        String[] args;
        if (metaOS.getArgs() != null && metaOS.getArgs().size() > 0) {
            args = metaOS.getArgs().toArray(new String[metaOS.getArgs().size()]);
        } else {
            args = new String[0];
        }

        for (MetaCommand command : commands) {
            CommandHandler commandHandler = getHandler(command.getClazz(), defaultCommandHandler());
            if (data == null) {
                data = commandHandler.execute(visitor,command, args);
            } else {
                data.merge(commandHandler.execute(visitor,command, args));
            }
        }
        return data;
    }

    private <T> T getHandler(Class<? extends T> handlerClass, T defaultHandler) throws SampleException {
        if (handlerClass != null && !handlerClass.isInterface()) {
            try {
                return handlerClass.newInstance();
            } catch (Exception ex) {
                throw new SampleException("create instance of handler[" + handlerClass.getName() + "] failed", ex);
            }
        } else {
            return defaultHandler;
        }
    }

    @Override
    public List<Component> sampleComponents(V visitor, MetaRelation relation, Object... args) throws SampleException {
        return sampleMultiple(visitor, relation,args);
    }

    @Override
    public Component sampleComponent(V visitor, MetaRelation relation) throws SampleException {
        return sampleSingle(visitor, relation);
    }

    @Override
    public Component sampleComponent(Visitor visitor, MetaRelation relation, Object identifier)
            throws SampleException {
        //TODO 关于identifier的含义还需要确定
        throw new SampleException("not support sample with identifier");
    }

    @Override
    public List<Entry> sampleEntries(V visitor, MetaRelation relation) throws SampleException {
        return sampleMultiple(visitor, relation);
    }

    @Override
    public Entry sampleEntry(V visitor, MetaRelation relation) throws SampleException {
        return sampleSingle(visitor, relation);
    }


    protected void LoadModel(Class<? extends MetaRoot> rootClass, String resourceType, MetaModel model, Object target,
                             GeneralMap<String, Object> data) throws SampleException {
        Loader loader = defaultLoader();
        for (MetaField field : (List<MetaField>) model.getFields()) {
            loader.load(rootClass, resourceType, field, target, data);
        }
    }

    /**
     * 获得需要采集的memberName集合
     */
    protected Set<String> needSample(MetaModel metaModel) {
        Set<String> needSampleSet = new HashSet<String>();
        List<MetaMember> members = metaModel.getMembers();
        for (MetaMember metaMember : members) {
            if (!isKeyed(metaMember)) { //非keyed的属性不采集
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

    /**
     * 创建Resource，如果node中有Resource，则更新node中的Resource
     */
    private Resource buildResource(MetaResource metaResource, Resource origin) throws SampleException {
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
    protected boolean isKeyed(MetaMember member) {
        MetaKeyed keyed = member.getKeyed();
        if (keyed == null) {
            return false;
        }
        //TODO 以后会扩展Keyed中value值的含义
        return true;
    }
}
