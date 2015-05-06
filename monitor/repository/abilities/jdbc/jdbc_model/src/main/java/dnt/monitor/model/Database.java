package dnt.monitor.model;

import dnt.monitor.annotation.Category;
import net.happyonroad.model.Credential;

/**
 * <h1>All database parent model</h1>
 *
 * @author Jay Xiong
 */
@Category(value = "db", credentials = Credential.Jdbc)
public class Database extends Application {
    private static final long serialVersionUID = -6112431198088011996L;
}
