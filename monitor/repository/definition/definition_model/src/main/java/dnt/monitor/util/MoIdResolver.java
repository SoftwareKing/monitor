/**
 * Developer: Kadvin Date: 15/1/27 上午8:54
 */
package dnt.monitor.util;

import dnt.monitor.model.ManagedObject;
import net.happyonroad.util.CglibCompactClassNameIdResolver;

/**
 * The mo id resolver
 */
public class MoIdResolver extends CglibCompactClassNameIdResolver {
    public MoIdResolver() {
        super(ManagedObject.class);
    }
}
