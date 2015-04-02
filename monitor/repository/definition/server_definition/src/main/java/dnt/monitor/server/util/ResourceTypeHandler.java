/**
 * Developer: Kadvin Date: 15/1/27 下午4:46
 */
package dnt.monitor.server.util;

import dnt.monitor.model.Resource;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.TypeHandler;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Description here
 */
public class ResourceTypeHandler implements TypeHandler<Resource> {
    @Override
    public void setParameter(PreparedStatement ps, int i, Resource parameter, JdbcType jdbcType) throws SQLException {

    }

    @Override
    public Resource getResult(ResultSet rs, String columnName) throws SQLException {
        return null;
    }

    @Override
    public Resource getResult(ResultSet rs, int columnIndex) throws SQLException {
        return null;
    }

    @Override
    public Resource getResult(CallableStatement cs, int columnIndex) throws SQLException {
        return null;
    }
}
