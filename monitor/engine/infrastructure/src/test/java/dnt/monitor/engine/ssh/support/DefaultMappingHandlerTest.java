package dnt.monitor.engine.ssh.support;

import dnt.monitor.engine.ssh.MappingHandler;
import dnt.monitor.meta.ssh.MetaMapping;
import net.happyonroad.model.GeneralMap;
import org.junit.Test;
import java.util.List;
import static org.junit.Assert.assertTrue;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
public class DefaultMappingHandlerTest {
    @Test
    public void testMapping() throws Exception {
        MappingHandler handler = new DefaultMappingHandler();
        MetaMapping mapping = new MetaMapping();
        mapping.setColSeparator("\\s+");
        mapping.setRowSeparator("\\s*\\r?\\n\\s*");
        mapping.setSkipLines(1);
        mapping.setValue(new String[0]);
        List<GeneralMap<String,Object>> data = handler.handleTable(mapping, "headers \n aa bb cc \n 11 22 33 \n 44 55 66");
        assertTrue(data.get(1).get("bb").equals("55"));
    }
}
