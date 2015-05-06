/**
 * @author XiongJie, Date: 13-11-19
 */
package dnt.monitor.engine.jdbc.factory;

import dnt.monitor.engine.jdbc.ConnectionFactory;
import org.apache.commons.io.FilenameUtils;

import java.sql.Driver;
import java.sql.SQLException;

/** The abstract db connection factory */
public abstract class AbstractConnectionFactory implements ConnectionFactory {

    @Override
    public boolean support(String resourceType) {
        String db = FilenameUtils.getName(resourceType);
        return db.equalsIgnoreCase(getType());
    }

    public String getType(){
        String simpleName = getClass().getSimpleName();
        int idx = simpleName.indexOf("ConnectionFactory");
        return simpleName.substring(0, idx );
    }

    protected Driver createDriver(String driverClass) throws SQLException {
        try {
            return  (Driver) Class.forName(driverClass).newInstance();
        } catch (Exception e) {
            throw new SQLException("Can't instantiate " + driverClass, e);
        }
    }
}
