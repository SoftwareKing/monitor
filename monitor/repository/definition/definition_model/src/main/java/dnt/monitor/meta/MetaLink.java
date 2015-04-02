/**
 * Developer: Kadvin Date: 15/2/4 上午9:29
 */
package dnt.monitor.meta;

import dnt.monitor.model.Link;

/**
 * <h1>各种Link对象的元信息</h1>
 *
 * 备注：由于Link继承出来的类型很少(主要是逻辑Link，物理链路)
 * 所以，系统不应该有许多MetaLink存在
 */
public class MetaLink<L extends Link> extends MetaModel<L>{
    public MetaLink(Class<L> klass) {
        super(klass);
    }
}
