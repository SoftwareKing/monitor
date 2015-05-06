package dnt.monitor.engine.jdbc;

import dnt.monitor.engine.exception.JdbcException;
import dnt.monitor.service.Visitor;
import net.happyonroad.credential.CredentialProperties;

import java.sql.Connection;
import java.util.Map;

/**
 * <h1>JDBC Visitor based on Connection</h1>
 *
 * @author Jay Xiong
 */
public interface JdbcVisitor extends Visitor<CredentialProperties> {

    /**
     * <h2>visitor的底层资源</h2>
     *
     * @return 底层资源
     */
    Connection getConnection();

    /**
     * <h2>执行特定的SQL语句，并以默认的格式化策略，将结果集返回</h2>
     *
     * @param sql       待执行的SQL语句
     * @param arguments Sql语句需要植入的参数
     * @param array     是否是数组
     * @return 按照默认格式化策略返回的数据 <br/>
     * 默认的单行格式化策略为：
     * <ol>
     * <li>如果结果集没数据，返回null</li>
     * <li>如果结果集有超过一行数据，仅对第一行进行转换</li>
     * <li>如果结果集仅有一列，则返回单个对象</li>
     * <li>如果结果集有多列，则返回Map对象</li>
     * </ol>
     * 默认的多行格式化策略为：
     * <ol>
     * <li>如果结果集没数据，返回空array</li>
     * <li>其中每行数据，按照单行数据格式化策略</li>
     * </ol>
     * @throws dnt.monitor.engine.exception.JdbcException 执行异常，或者格式化异常
     */
    <T> T query(String sql, Map<String, Object> arguments, boolean array) throws JdbcException;
}
