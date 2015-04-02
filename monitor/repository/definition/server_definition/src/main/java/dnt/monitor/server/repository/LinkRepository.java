/**
 * Developer: Kadvin Date: 14/12/23 下午9:54
 */
package dnt.monitor.server.repository;

import dnt.monitor.model.Link;
import dnt.monitor.model.LinkType;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * The link repository
 */
public interface LinkRepository<L extends Link> {

    List<L> findAll(@Param("resourceId") Long resourceId);

    List<L> findAllByFromAndTo(@Param("fromId") Long fromId,
                                 @Param("toId") Long toId);

    List<L> findAllByFrom(@Param("fromId") Long fromId);

    List<L> findAllByTo(@Param("toId") Long toId);

    void create(L link);

    L find(@Param("fromId")long  fromId,
           @Param("toId")long toId,
           @Param("type")LinkType type);

    void deleteById(@Param("id")long id);

}
