/**
 * @author XiongJie, Date: 13-11-12
 */
package dnt.monitor.engine.jdbc.factory;

import dnt.monitor.model.Resource;
import net.happyonroad.credential.CredentialProperties;
import net.happyonroad.model.SocketAddress;
import net.happyonroad.util.IpUtils;

import java.sql.Connection;
import java.sql.Driver;
import java.sql.SQLException;

/**
 * <h1><Mysql Connection Factory/h1>
 */
public class MysqlConnectionFactory extends AbstractConnectionFactory {

    @Override
    public Connection buildConnection(Resource resource, CredentialProperties credential) throws SQLException {
        String url = buildUrl(resource, credential);
        String driverClass = credential.getProperty("driver", "com.mysql.jdbc.Driver");
        Boolean readonly = "true".equalsIgnoreCase(credential.getProperty("readonly", "true"));
        Driver driver = createDriver(driverClass);
        Connection connection = driver.connect(url, credential);
        connection.setReadOnly(readonly);
        return connection;
    }

    protected String buildUrl(Resource resource, CredentialProperties credential) {
        SocketAddress socketAddress = IpUtils.parseSocketAddress(resource.getAddress());
        String dbName = credential.getProperty("database");
        return String.format("jdbc:mysql://%s:%d/%s?useUnicode=true&amp;" +
                                   "characterEncoding=UTF-8&amp;" +
                                   "characterSetResults=UTF-8&amp;" +
                                   "allowMultiQueries=true",
                                   socketAddress.getHost(), socketAddress.getPort(), dbName);
    }
}
