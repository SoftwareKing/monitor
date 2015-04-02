/**
 * Developer: Kadvin Date: 15/1/6 上午9:19
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.MonitorEngine;
import net.happyonroad.platform.web.exception.WebServerSideException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * <h1>管理节点控制器</h1>
 * <pre>
 * <b>HTTP    URI                         方法      含义  </b>
 *  POST     /engine/self                 create   引擎安装好第一次启动时，向服务器注册自身
 *  PUT      /engine/self                 update   引擎安装了新的资源包，安装新的补丁包之后，也就是发生了配置变更，需要通过该接口向服务器主动声明自身的变化
 *  DELETE   /engine/self                 delete   引擎被卸载之前，通过安装卸载工具向服务器申告注销
 *  原本考虑有这么一个接口：
 *  PUT      /engine/self/status/{status} status   引擎状态变化
 *  但后来发现，引擎就是一个资源，所有的资源都有状态变化
 * </pre>
 */
@RestController
@RequestMapping("/engine/self")
class EngineController extends SouthController {
    /**
     * <h2>引擎安装好第一次启动时，向服务器注册自身</h2>
     * <p>
     * POST /engine/self
     * <br>
     * 引擎能够提供的数据包括：
     * <ul>
     * <li> address
     * <li> home
     * <li> pids
     * <li> host对象
     * </ul>
     * </p>
     *
     * @return 注册成功之后的引擎对象(此时该引擎尚未被批准)，主要包括了
     * <ul>
     * <li>engine_id: 引擎收到该id之后，应该保存下来，并作为以后通讯的身份识别依据
     * </ul>
     *
     * 本接口无需做认证
     * 如果引擎已经有id，且系统中也存在该id，则应该拒绝创建；
     * 如果引擎虽然有id，但系统中不存在对应的id，则应该输出警告，但接受其创建请求，分配新的id给它
     */
    @RequestMapping(method = RequestMethod.POST)
    public MonitorEngine create(@Valid @RequestBody MonitorEngine engine){
        logger.info("Registering {}", engine);
        try {
            MonitorEngine created = engineService.create(engine);
            logger.info("Registered  {}", created);
            return created;
        } catch (ResourceException e) {
            logger.warn("Register failed", e);
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    /**
     * <h2>引擎通过该接口向服务器主动声明自身的变化</h2>
     * <p>
     * PUT /engine/self
     * </p>
     * 安装了新的资源包，安装新的补丁包之后，也就是发生了配置变更，需要通过该接口通知服务器变更
     * 本接口需做认证
     *
     * @return 更新成功之后的引擎对象信息
     */
    @RequestMapping(method = RequestMethod.PUT)
    public MonitorEngine update(@Valid @RequestBody MonitorEngine engine){
        logger.info("Updating {}", engine);
        try {
            MonitorEngine updated = engineService.update(this.engine, engine);
            logger.info("Updated  {}", engine);
            return updated;
        } catch (ResourceException e) {
            logger.warn("Update failed", e);
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    /**
     * <h2>安装卸载工具向服务器申告引擎注销</h2>
     * <p>
     * DELETE /engine/self
     * </p>
     * 引擎被卸载之前，通过安装卸载工具向服务器申告注销
     * 本接口需做认证
     *
     */
    @RequestMapping(method = RequestMethod.DELETE)
    public void delete(){
        logger.warn("Deleting  {}", engine);
        try {
            engineService.delete(engine);
            logger.warn("Deleted  {}", engine);
        } catch (ResourceException e) {
            logger.warn("Update failed", e);
            throw new WebServerSideException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
