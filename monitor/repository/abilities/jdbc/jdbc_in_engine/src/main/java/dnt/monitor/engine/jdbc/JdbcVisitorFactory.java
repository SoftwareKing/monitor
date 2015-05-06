package dnt.monitor.engine.jdbc;

import dnt.monitor.engine.service.VisitorFactory;
import net.happyonroad.credential.CredentialProperties;

/**
 * <h1>JDBC Connection Visitor Factory</h1>
 *
 * @author Jay Xiong
 */
public interface JdbcVisitorFactory extends VisitorFactory<CredentialProperties, JdbcVisitor>{
}
