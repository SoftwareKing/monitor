package dnt.monitor.meta.sampling;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * <h1>Meta Match</h1>
 *
 * @author Jay Xiong
 */
public abstract class MetaRoot implements Serializable {
    private List<MetaOS> osList = new ArrayList<MetaOS>();

    public List<MetaOS> getOsList() {
        return osList;
    }

    public void setOsList(List<MetaOS> osList) {
        this.osList = osList;
    }

    public MetaOS getMetaOs(String type) {
        if (osList == null) {
            return null;
        }
        List<MetaOS> matchedList = new ArrayList<MetaOS>();
        for (MetaOS os : osList) {
            if (type.equals(os.getType())) {
                return os;
            }
            if (type.contains(os.getType()) || os.getType().equals("*"))
                matchedList.add(os);
        }
        if (matchedList.size() > 0) {
            Collections.sort(matchedList);
            return matchedList.get(0);
        }
        return null;
    }

    private static final long serialVersionUID = -5515710302707914761L;
}
