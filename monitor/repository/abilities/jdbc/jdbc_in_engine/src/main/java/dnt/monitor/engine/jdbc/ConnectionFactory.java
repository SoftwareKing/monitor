package dnt.monitor.engine.jdbc;

import dnt.monitor.model.Resource;
import net.happyonroad.credential.CredentialProperties;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * <h1>构建具体数据库访问能力的抽象接口</h1>
 *
 * @author Jay Xiong
 */
public interface ConnectionFactory {
    /**
     * <h2>询问是否支持特定类型的数据库</h2>
     *
     * @param type 数据库的类型，如 /app/db/mysql /app/db/oracle
     * @return 是否支持
     */
    boolean support(String type);

    /**
     * <h2>构建数据库连接</h2>
     *
     * @param resource        数据库连接的url
     * @param credential 相关参数
     * @return 数据库连接
     */
    Connection buildConnection(Resource resource, CredentialProperties credential) throws SQLException;
}
