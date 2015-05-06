package dnt.monitor.server.repository;

import dnt.monitor.model.Link;
import dnt.monitor.model.LinkType;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static org.junit.Assert.assertNotNull;

@ContextConfiguration(classes = ResourceRepositoryConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class LinkRepositoryTest {
    @Autowired
    LinkRepository<Link> repository;

    @Test
    public void testFindAllByFromAndTo() throws Exception {
        List<Link> list = repository.findAllByFromAndTo(2l, 1l);
        assertNotNull(list);
    }

    @Test
    public void testAllByFrom() throws Exception {
        List<Link> list = repository.findAllByFrom(Long.getLong("1"));
        assertNotNull(list);
    }

    @Test
    public void findAllByTo() throws Exception {
        List<Link> list = repository.findAllByTo(1l);
        assertNotNull(list);
    }

    @Test
    public void testCreate() throws Exception {
        Link link = new Link();
        link.setFromId(1L);
        link.setToId(2L);
        link.setType(LinkType.Connect.name());
        link.setLabel(link.getType());
        repository.create(link);
        assertNotNull(link.getId());
    }

    @Test
    public void testFind() throws Exception {
        Link link = repository.find(2L, 1L, LinkType.Connect);
        assertNotNull(link);
        assertNotNull(link.getFrom());
        assertNotNull(link.getTo());
    }

    @Test
    public void testDelete() throws Exception {
        repository.deleteById(10L);

    }
}