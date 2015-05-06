/**
 * Developer: Kadvin Date: 15/2/4 上午9:29
 */
package dnt.monitor.meta;

import dnt.monitor.model.Component;

/**
 * <h1>各种组件的元信息</h1>
 *
 * 实质是对某个Component类的描述
 */
public class MetaComponent<C extends Component> extends MetaModel<C>{
    MetaAnchor anchor;
    MetaKeyed  keyed;

    public MetaComponent(Class<C> klass) {
        super(klass);
    }

    public MetaAnchor getAnchor() {
        return anchor;
    }

    public void setAnchor(MetaAnchor anchor) {
        this.anchor = anchor;
    }

    public MetaKeyed getKeyed() {
        return keyed;
    }

    public void setKeyed(MetaKeyed keyed) {
        this.keyed = keyed;
    }
}
