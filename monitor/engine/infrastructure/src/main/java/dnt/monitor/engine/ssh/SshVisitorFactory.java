package dnt.monitor.engine.ssh;

import dnt.monitor.engine.exception.SshException;
import dnt.monitor.model.ResourceNode;
import net.happyonroad.credential.LocalCredential;
import net.happyonroad.credential.SshCredential;

/**
 * <h1>The SSH Visitor Factory</h1>
 *
 * @author Jay Xiong
 */
public interface SshVisitorFactory {
    /**
     * <h2>采用给定的ssh认证信息获取可以访问目标ssh主机的对象</h2>
     * 这里获取来的对象，还需要根据node的信息进行配置
     *
     * @param node       资源节点，包含了主机地址，ssh相关配置参数
     * @param credential 认证方式
     * @return ssh访问者
     */
    SshVisitor visitor(ResourceNode node, SshCredential credential) throws SshException;

    /**
     * <h2>交还一个使用过的visitor(释放资源)</h2>
     *  @param node
     * @param visitor visitor对象
     */
    void returnBack(ResourceNode node, SshVisitor visitor);

    /**
     * <h2>采用本地认证信息获取可以访问本地主机的对象</h2>
     * 这里获取来的对象，还需要根据node的信息进行配置
     *
     * @param node       资源节点，包含了ssh相关配置参数
     * @param credential 认证方式
     * @return ssh访问者
     */
    SshVisitor visitor(ResourceNode node, LocalCredential credential)throws SshException;
}
