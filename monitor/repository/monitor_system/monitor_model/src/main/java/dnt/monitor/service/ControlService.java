/**
 * Developer: Kadvin Date: 15/2/16 下午4:50
 */
package dnt.monitor.service;

import dnt.monitor.exception.EngineException;

/**
 * <h1>监控服务器对监控引擎的控制服务</h1>
 *
 * 包括如下的控制功能:
 * <ul>
 * <li> 批准，拒绝
 * <li> 升级
 * <li> 重启, 停止
 * </ul>
 */
public interface ControlService {

    void approve() throws EngineException;

    void reject()throws EngineException;

    void restart()throws EngineException;
}
