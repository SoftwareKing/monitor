package dnt.monitor.model;

import org.apache.commons.beanutils.BeanUtils;

import java.io.Serializable;

/**
 * <h1>代表资源/组件/链路上的一个结构体</h1>
 *
 * @author Jay Xiong
 */
public abstract class Entry implements Serializable {
    private static final long serialVersionUID = -3201344379432084873L;

    /**
     * 将另外一个对象的属性设置到本对象上来
     *
     * @param another 另外一个对象
     */
    public void apply( Entry another) {
        try {
            BeanUtils.copyProperties(this, another);
        } catch (Exception e) {
            throw new RuntimeException("Can't apply entry properties", e);
        }
    }

}
