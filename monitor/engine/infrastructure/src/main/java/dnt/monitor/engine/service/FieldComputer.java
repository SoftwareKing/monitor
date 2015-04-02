package dnt.monitor.engine.service;

import dnt.monitor.exception.SampleException;
import dnt.monitor.meta.MetaField;

import java.util.Map;

/**
 * <h1>计算Field的值</h1>
 *
 * @author LuXiong
 */
public interface FieldComputer {
    /**
     * 计算field的值
     * @param metaField field模型
     * @param valueMap map值
     */
    Object computeField(MetaField metaField, Map<String, Object> valueMap) throws SampleException;
}
