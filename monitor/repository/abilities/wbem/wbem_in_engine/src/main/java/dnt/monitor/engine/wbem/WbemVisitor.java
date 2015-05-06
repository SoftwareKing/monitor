package dnt.monitor.engine.wbem;

import dnt.monitor.service.Visitor;
import net.happyonroad.credential.CredentialProperties;

import javax.wbem.client.WBEMClient;

/**
 * <h1>Webem Visitor</h1>
 *
 * @author Jay Xiong
 */
public interface WbemVisitor extends Visitor<CredentialProperties> {
    WBEMClient getClient() ;

    //TODO define WebemVisitor business methods
}
