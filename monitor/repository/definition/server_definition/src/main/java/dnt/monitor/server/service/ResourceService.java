/**
 * Developer: Kadvin Date: 14/12/26 上午10:44
 */
package dnt.monitor.server.service;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.Resource;
import net.happyonroad.platform.service.Page;
import net.happyonroad.platform.service.Pageable;

/**
 * <h1>资源服务接口</h1>
 */
public interface ResourceService<R extends Resource> {
    Class<? extends Resource> getResourceType();

    Page<R> paginateByType(String type, Pageable request);

    R findById(Long id);

    R findByAddress(String address);

    R findByLabel(String label);

    /**
     * <h2>Create a resource instance</h2>
     *
     * @param resource the resource to be created
     * @return the created resource
     */
    R create(R resource) throws ResourceException;

    /**
     * <h2>Update a resource instance</h2>
     *
     * @param legacy the resource to be updated
     * @param updating the updating resource
     * @return the updated resource
     */
    R update(R legacy, R updating) throws ResourceException;


    /**
     * <h2>Update a resource instance</h2>
     *
     * @param updating the updating resource
     * @return the updated resource
     */
    R update(R updating) throws ResourceException;

    /**
     * Delete a resource instance
     * @param resource the resource to be deleted
     * @throws ResourceException
     */
    void delete(R resource) throws ResourceException;
}
