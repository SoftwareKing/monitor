/**
 * Developer: Kadvin Date: 14/12/29 下午5:58
 */
package dnt.monitor.server.util;

/**
 * <h1>类型分类的在服务器端的元信息</h1>
 *
 * Properties内容如：
 * <ul>
 * <li>view.detail: "hosts/detail.jade"
 * <li>view.new : "hosts/new.jade"
 * <li>view.edit : "windows/edit.jade"
 * <li>view.list: "windows/list.jade"
 * <li>api.list: "GET /api/hosts"
 * <li>api.detail: "GET /api/hosts/{address}"
 * </ul>
 */
public interface CategoryConstants {
    final String VIEW_DETAIL = "view.detail";
    final String VIEW_NEW = "view.new";
    final String VIEW_EDIT = "view.edit";
    final String VIEW_LIST = "view.list";
    final String API_LIST = "api.list";
    final String API_DETAIL = "api.detail";// GET By Address
    final String API_DETAIL2 = "api.detail2";// GET By ID
    final String[] PROPERTY_NAMES = new String[]{
            VIEW_DETAIL,VIEW_NEW, VIEW_EDIT, VIEW_LIST, API_LIST, API_DETAIL, API_DETAIL2
    };

}
