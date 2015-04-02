/**
 * Developer: Kadvin Date: 15/2/5 下午4:05
 */
package dnt.monitor.service;

import dnt.monitor.exception.MetaException;
import dnt.monitor.meta.MetaModel;

/**
 * Meta资源解析接口
 * @param <T>      需要解析的对象类型
 * @param <M>      返回的元模型的类型
 */
public interface MetaResolver<T, M extends MetaModel<T>> {
    /**
     * 解析某个资源
     *
     * @param klass    被解析的资源类
     */

    M resolve(Class<T> klass) throws MetaException;
}
