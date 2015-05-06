/**
 * Developer: Kadvin Date: 14/12/28 上午11:28
 */
package dnt.monitor.server.service;

import dnt.monitor.exception.ResourceException;
import dnt.monitor.model.Link;
import dnt.monitor.model.Resource;

/**
 * The resource / link service locator
 */
public interface ServiceLocator {
    /**
     * Locate the resource service for the resource instance
     *
     * @param resource the resource instance
     * @return the service implementation
     */
    ResourceService locate(Resource resource) throws ResourceException;

    /**
     * Locate the resource service by the resource type
     *
     * @param type the resource type
     * @return corresponding resource service
     * @throws ResourceException
     */
    ResourceService locate(String type) throws ResourceException;

    /**
     * Locate the resource service by the resource type
     *
     * @param klass the resource class
     * @return corresponding resource service
     * @throws ResourceException
     */
    ResourceService locate(Class<? extends Resource> klass) throws ResourceException;

    /**
     * Locate the link service for the link instance
     *
     * @param link the link instance
     * @return the link service located
     * @throws ResourceException
     */
    LinkService locateLinkService(Link link) throws ResourceException;

    /**
     * Locate the link service by the link type
     *
     * @param type the link type
     * @return corresponding link service
     * @throws ResourceException
     */
    LinkService locateLinkService(String type) throws ResourceException;
}
