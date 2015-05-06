/**
 * @author XiongJie, Date: 13-11-12
 */
package dnt.monitor.engine.jdbc.factory;

import dnt.monitor.model.Resource;
import net.happyonroad.credential.CredentialProperties;

import java.sql.Connection;
import java.sql.Driver;
import java.sql.SQLException;

/**
 * <h1>H2 Connection Factory</h1>
 */
public class H2ConnectionFactory extends AbstractConnectionFactory{

    @Override
    public Connection buildConnection(Resource resource, CredentialProperties credential) throws SQLException {
        String url = buildURL(resource.getAddress(), credential);
        String driverClass = credential.getProperty("driver", "org.h2.Driver");
        Boolean readonly = "true".equalsIgnoreCase(credential.getProperty("readonly", "true"));
        Driver driver = createDriver(driverClass);
        Connection connection = driver.connect(url, credential);
        connection.setReadOnly(readonly);
        return connection;
    }

    protected String buildURL(String address, CredentialProperties credential){
        return String.format("jdbc:h2:mem:%s", credential.getProperty("name", "test"));
    }

}
