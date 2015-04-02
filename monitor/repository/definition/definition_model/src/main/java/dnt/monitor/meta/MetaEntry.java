/**
 * Developer: Kadvin Date: 15/2/4 上午9:29
 */
package dnt.monitor.meta;

import dnt.monitor.model.Entry;

/**
 * <h1>各种组件的元信息</h1>
 *
 * 实质是对某个Component类的描述
 */
public class MetaEntry<E extends Entry> extends MetaModel<E>{

    public MetaEntry(Class<E> klass) {
        super(klass);
    }

}
