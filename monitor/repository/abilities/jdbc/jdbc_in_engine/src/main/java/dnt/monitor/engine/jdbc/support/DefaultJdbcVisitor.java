package dnt.monitor.engine.jdbc.support;

import dnt.monitor.engine.exception.JdbcException;
import dnt.monitor.engine.jdbc.JdbcVisitor;
import dnt.monitor.engine.support.AbstractVisitor;
import dnt.monitor.model.ManagedNode;
import dnt.monitor.model.Resource;
import net.happyonroad.credential.CredentialProperties;
import net.happyonroad.type.TimeInterval;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <h1>Default JDBC Visitor</h1>
 *
 * @author Jay Xiong
 */
class DefaultJdbcVisitor extends AbstractVisitor<CredentialProperties> implements JdbcVisitor {
    private final Connection           connection;

    public DefaultJdbcVisitor(ManagedNode node, Resource resource, CredentialProperties credential, Connection connection) {
        super(node, resource, credential);
        this.connection = connection;
    }

    @Override
    public Connection getConnection() {
        return connection;
    }

    @Override
    public boolean isAvailable() {
        try {
            int timeout = TimeInterval.parseInt(credential.getProperty("jdbc.connect.timeout", "30s"));
            return !connection.isValid(timeout);
        } catch (SQLException e) {
            return false;
        }
    }

    @SuppressWarnings("unchecked")
    public <T> T query(String sql, Map<String, Object> arguments, boolean array) throws JdbcException {
        SingleConnectionDataSource ds = new SingleConnectionDataSource(connection, true);
        NamedParameterJdbcTemplate ps = new NamedParameterJdbcTemplate(ds);
        SqlRowSet rowSet = ps.queryForRowSet(sql, arguments);
        if (array) {
            List<Object> mappedList = new ArrayList<Object>();
            rowSet.beforeFirst();
            while (rowSet.next()) {
                mappedList.add(map(rowSet));
            }
            return (T) mappedList.toArray();
        } else {//single
            return rowSet.next() ? (T) map(rowSet) : null;
        }
    }

    private Object map(SqlRowSet rowSet) {
        SqlRowSetMetaData metaData = rowSet.getMetaData();
        if (metaData.getColumnCount() == 1) {
            return rowSet.getObject(1);
        } else {
            Map<String, Object> map = new HashMap<String, Object>();
            for (int i = 0; i < metaData.getColumnCount(); i++) {
                String label = metaData.getColumnLabel(i + 1);
                Object value = rowSet.getObject(i + 1);
                map.put(label, value);
            }
            return map;
        }
    }
}
