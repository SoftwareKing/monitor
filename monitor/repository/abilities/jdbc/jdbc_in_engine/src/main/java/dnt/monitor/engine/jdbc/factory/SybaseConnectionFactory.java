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
 * <h1><The Sybase connection factory/h1>
 */
public class SybaseConnectionFactory extends AbstractConnectionFactory {
    @Override
    public Connection buildConnection(Resource resource, CredentialProperties credential) throws SQLException {
        String url = buildURL(resource.getAddress(), credential);
        String driverClass = credential.getProperty("driver", "com.sybase.jdbc4.jdbc.SybDriver");
        Boolean readonly = "true".equalsIgnoreCase(credential.getProperty("readonly", "true"));
        Driver driver = createDriver(driverClass);
        Connection connection = driver.connect(url, credential);
        connection.setReadOnly(readonly);
        return connection;
    }

    protected String buildURL(String address, CredentialProperties credential){
        String database = credential.getProperty("database");
        SocketAddress socketAddress = IpUtils.parseSocketAddress(address);
        String url = String.format("jdbc:sybase:Tds:%s:%d?ServiceName=%s",
                                   socketAddress.getHost(), socketAddress.getPort(), database);
        String charset = credential.getProperty("CHARSET");
        if(charset != null)
            url = url + "&CHARSET=" + charset;
        return url;
    }
}