/**
 * @author XiongJie, Date: 13-11-12
 */
package dnt.monitor.engine.jdbc.factory;

import dnt.monitor.model.Resource;
import net.happyonroad.credential.CredentialProperties;
import net.happyonroad.model.SocketAddress;
import net.happyonroad.util.IpUtils;
import org.springframework.util.StringUtils;

import java.sql.Connection;
import java.sql.Driver;
import java.sql.SQLException;

/**
 * <h1><Microsoft SQL Server/h1>
 */
public class MssqlConnectionFactory extends AbstractConnectionFactory {
    @Override
    public Connection buildConnection(Resource resource, CredentialProperties credential) throws SQLException {
        String url = buildURL(resource.getAddress(), credential);
        String driverClass = credential.getProperty("driver", "net.sourceforge.jtds.jdbc.Driver");
        Boolean readonly = "true".equalsIgnoreCase(credential.getProperty("readonly", "true"));
        Driver driver = createDriver(driverClass);
        Connection connection = driver.connect(url, credential);
        connection.setReadOnly(readonly);
        return connection;
    }

    /**
     * <h2>构建访问Microsoft SQL Server的URL</h2>
     * @param address    MsSQL的地址，包括主机和端口信息，形式如: host:port
     * @param credential 对数据库访问的相关信息
     * @return the url
     */
    protected String buildURL(String address, CredentialProperties credential){
        SocketAddress socketAddress = IpUtils.parseSocketAddress(address);
        String database = credential.getProperty("database");
        String instance = credential.getProperty("instance");

        String url;
        if(StringUtils.hasText(instance)){
            url = String.format("jdbc:jtds:sqlserver://%s:%d;DatabaseName=%s;instance=%s",
                                socketAddress.getHost(), socketAddress.getPort(), database, instance);

        }else{
            url = String.format("jdbc:jtds:sqlserver://%s:%d;DatabaseName=%s",
                                socketAddress.getHost(), socketAddress.getPort(), database);
        }
        return url;
    }
}