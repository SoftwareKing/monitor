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
 * <h1>Oracle Driver</h1>
 */
public class OracleConnectionFactory extends AbstractConnectionFactory {
    public static final String URL_SEPARATOR = "||";
    public static final String URL_SEPARATOR_PATTERN = "\\|\\|";

    @Override
    public Connection buildConnection(Resource resource, CredentialProperties credential) throws SQLException {
        String url = buildURL(resource.getAddress(), credential);
        String driverClass = credential.getProperty("driver", "oracle.jdbc.driver.OracleDriver");
        Boolean readonly = "true".equalsIgnoreCase(credential.getProperty("readonly", "true"));

        Driver driver = createDriver(driverClass);
        Connection connection;
        if (url.contains(URL_SEPARATOR)) {
            String[] urls = url.split(URL_SEPARATOR_PATTERN);
            try {
                connection = driver.connect(urls[0], credential);
            } catch (Exception ex) {
                //try another
                connection = driver.connect(urls[1], credential);
            }
        } else {
            connection = driver.connect(url, credential);
        }
        connection.setReadOnly(readonly);
        return connection;
    }

    protected String buildURL(String address, CredentialProperties credential){
        String database = credential.getProperty("database");
        String serviceName = credential.getProperty("serviceName");
        String sid = credential.getProperty("sid");
        if (StringUtils.isEmpty(serviceName)
            && StringUtils.isEmpty(sid)
            && StringUtils.isEmpty(database)) {
            throw new IllegalArgumentException(
                    "The oracle jdbc credential should provide serviceName or sid, even database!");
        }
        SocketAddress socketAddress = IpUtils.parseSocketAddress(address);
        if (StringUtils.hasText(serviceName)) {
            return String.format("jdbc:oracle:thin:@//%s:%d/%s",
                                 socketAddress.getHost(), socketAddress.getPort(), serviceName);
        } else if (StringUtils.hasText(sid)) {
            return String.format("jdbc:oracle:thin:@%s:%d:%s",
                                 socketAddress.getHost(), socketAddress.getPort(), sid);
        } else {
            String nUrl = String.format("jdbc:oracle:thin:@//%s:%d/%s",
                                        socketAddress.getHost(), socketAddress.getPort(), database);
            String sUrl = String.format("jdbc:oracle:thin:@%s:%d:%s",
                                        socketAddress.getHost(), socketAddress.getPort(), database);
            return nUrl + URL_SEPARATOR + sUrl;
        }
    }
}
