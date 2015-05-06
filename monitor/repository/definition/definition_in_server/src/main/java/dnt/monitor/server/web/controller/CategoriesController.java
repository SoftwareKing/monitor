/**
 * Developer: Kadvin Date: 14/12/29 上午11:07
 */
package dnt.monitor.server.web.controller;

import dnt.monitor.service.CategoryService;
import net.happyonroad.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

/**
 * <h1>系统类型控制器</h1>
 * <pre>
 * <b>HTTP    URI                                方法         含义  </b>
 *  GET      /api/categories/**                  show        查询系统资源分类信息
 *  GET      /api/categories/credentials         credentials 查询系统所有认证方式信息
 * </pre>
 */
@RestController
@RequestMapping("/api/categories")
class CategoriesController extends GreedyPathController {
    @Autowired
    CategoryService categoryService;

    @RequestMapping("**")
    public Category show() {
        logger.trace("Showing {}", targetPath);
        Category category = categoryService.parseCategory(targetPath);
        logger.debug("Found   {}", category);
        return category;
    }

    @RequestMapping("credentials")
    public Set<String> credentials() {
        logger.trace("Showing  credentials");
        Set<String> credentials = categoryService.getCredentials();
        logger.debug("Found {} credentials", credentials.size());
        return credentials;
    }

}
