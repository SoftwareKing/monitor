/**
 * Developer: Kadvin Date: 15/1/22 下午1:54
 */
package dnt.monitor.server.web;

import net.happyonroad.platform.web.SpringMvcConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <h1>The Monitor Server Spring MVC Configuration</h1>
 * <p/>
 * 这里面用到的 bean 对象, 包括import进来的configuration对象，不能够采用 service import/export 的方式
 * 因为这个类是被 platform 构造的，而不是本组件的application context构造的
 */
@Configuration
@Import(MonitorWebSocketConfig.class)
public class MonitorMvcConfig extends SpringMvcConfig {
}
