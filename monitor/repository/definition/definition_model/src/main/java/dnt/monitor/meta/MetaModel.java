/**
 * Developer: Kadvin Date: 15/2/4 上午9:31
 */
package dnt.monitor.meta;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dnt.monitor.meta.snmp.MetaGroup;
import dnt.monitor.meta.snmp.MetaTable;
import dnt.monitor.meta.ssh.MetaCommand;
import dnt.monitor.meta.ssh.MetaMapping;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;

import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

/**
 * <h1>资源/组件/链接等对象的元信息的父类</h1>
 * 对应于 ManagedObject 的元信息
 */
@ManagedResource
@SuppressWarnings("UnusedDeclaration")
public class MetaModel<Model> extends MetaObject {
    // 唯一性名称，显示名称，描述说明，详细分类
    // 一般而言
    //   name 是从类反射中解析出来，为英文
    //   label, description是从message resource中映射出来
    protected String       name;
    //对应的实例资源类
    private   Class<Model> klass;

    // 指向其他字段的元成员
    protected List<MetaMember> metaMembers;

    protected MetaGroup         snmpGroup;
    protected MetaTable         snmpTable;
    // 命令模型
    protected List<MetaCommand> commands;
    // 里面可能是 Mapping, Tabular或者null
    protected List<MetaMapping> mappings;


    public MetaModel(Class<Model> klass) {
        this.klass = klass;
        this.metaMembers = new LinkedList<MetaMember>();
    }

    public Class<Model> getModelClass() {
        return klass;
    }

    @Override
    public String getName() {
        return name;
    }

    @ManagedAttribute
    public void setName(String name) {
        this.name = name;
    }

    ////////////////////////////////////////////////
    // Snmp Meta Information
    ////////////////////////////////////////////////

    public MetaGroup getSnmpGroup() {
        return snmpGroup;
    }

    public void setSnmpGroup(MetaGroup snmpGroup) {
        this.snmpGroup = snmpGroup;
    }

    public MetaTable getSnmpTable() {
        return snmpTable;
    }

    public void setSnmpTable(MetaTable snmpTable) {
        this.snmpTable = snmpTable;
    }

    public List<MetaCommand> getCommands() {
        return commands;
    }

    public void setCommands(List<MetaCommand> commands) {
        this.commands = commands;
    }

    public List<MetaMapping> getMappings() {
        return mappings;
    }

    public void setMappings(List<MetaMapping> mappings) {
        this.mappings = mappings;
    }

    @JsonIgnore
    public List<MetaMember> getMembers() {
        return Collections.unmodifiableList(this.metaMembers);
    }

    @JsonIgnore
    public List<MetaField> getFields() {
        List<MetaField> fields = new ArrayList<MetaField>(this.metaMembers.size());
        for (MetaMember member : metaMembers) {
            if( member instanceof  MetaField ) fields.add((MetaField) member);
        }
        return fields;
    }

    /**
     * 返回所有的度量元信息
     *
     * @return 度量元信息
     */
    public List<MetaMetric> getMetrics() {
        List<MetaMetric> metaMetrics = new ArrayList<MetaMetric>();
        for (MetaMember member : metaMembers) {
            if (member instanceof MetaMetric) metaMetrics.add((MetaMetric) member);
        }
        return metaMetrics;
    }

    /**
     * 返回所有的配置元信息
     *
     * @return 配置元信息
     */
    public List<MetaConfig> getConfigs() {
        List<MetaConfig> metaConfigs = new ArrayList<MetaConfig>();
        for (MetaMember member : metaMembers) {
            if (member instanceof MetaConfig) metaConfigs.add((MetaConfig) member);
        }
        return metaConfigs;
    }

    /**
     * 返回所有的指标元信息
     *
     * @return 指标元信息
     */
    public List<MetaIndicator> getIndicators() {
        List<MetaIndicator> metaIndicators = new ArrayList<MetaIndicator>();
        for (MetaMember member : metaMembers) {
            if (member instanceof MetaIndicator) metaIndicators.add((MetaIndicator) member);
        }
        return metaIndicators;
    }


    @Override
    protected MetaModel clone() throws CloneNotSupportedException {
        return (MetaModel) super.clone();
    }

    @JsonIgnore
    public ObjectName getObjectName() {
        try {
            return new ObjectName("dnt.monitor:type=" + getClass().getSimpleName() + ",name=" + klass.getSimpleName());
        } catch (MalformedObjectNameException e) {
            throw new Error("Coding error for:" + e.getMessage());
        }
    }

    public void register(MetaMember metaMember) {
        metaMembers.add(metaMember);
    }

    public MetaMember getMember(String name) {
        for (MetaMember member : metaMembers) {
            if(member.getName().equals(name)) return member;
        }
        return null;
    }
}
