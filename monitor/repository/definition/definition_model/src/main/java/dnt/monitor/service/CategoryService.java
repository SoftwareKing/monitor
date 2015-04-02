/**
 * Developer: Kadvin Date: 14/12/27 下午9:23
 */
package dnt.monitor.service;

import dnt.monitor.model.Resource;
import net.happyonroad.model.Category;

import java.util.List;
import java.util.Set;

/**
 * <h1>提供资源分类管理功能</h1>
 * <p/>
 * <ul>
 * <li>面向Model Feature Resolver，登记发现的资源</li>
 * </ul>
 */
public interface CategoryService {
    /**
     * Resolve type from resource class
     * @param klass the resource class
     * @return the full type
     */
    String resolveType(Class<? extends Resource> klass);
    /**
     * <h2>解析@Category</h2>
     *
     * @param klass 分类的属性
     * @return 解析到的分类
     */
    Category resolve(Class<? extends Resource> klass);

    /**
     * <h2>获取当前所有的根类别</h2>
     *
     * @return 根类别列表，使用者可以从这些根类别对象上获取其子类别
     */
    @SuppressWarnings("UnusedDeclaration")
    List<Category> getCategories();


    /**
     * <h2>获取当前所有的认证方式</h2>
     *
     * @return 认证方式名称集合
     */
    Set<String> getCredentials();

    /**
     * <h2>将某个类别名称解析为相应的类别对象</h2>
     *
     * @param type 类似于: host.linux这样的类别名称
     * @return 解析出来的类别对象
     * @throws java.lang.IllegalArgumentException 如果不存在对应的分类，将会抛出该异常
     */
    Category parseCategory(String type) throws IllegalArgumentException;

    /**
     * <h2>动态注册类别</h2>
     * <ul>
     * <li>如果注册成功，返回true</li>
     * <li>如果注册失败，例如：类别已经存在，则返回false</li>
     * </ul>
     *
     * @param category   注册的类别
     * @param parentType 父类别类型，如果是根类别，则该参数可以不传
     * @return 是否注册成功
     * @throws java.lang.IllegalArgumentException 如果设定了错误的父类别，将会抛出该异常
     */
    boolean register(Category category, String parentType) throws IllegalArgumentException;

    /**
     * <h2>获得所有的类型</h2>
     * 根类型在前，叶子类型在后
     *
     * @return 所有的类型
     */
    List<String> getTypes();
}
