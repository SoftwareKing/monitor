package dnt.monitor.engine.ssh.support;

import dnt.monitor.engine.service.FieldComputer;
import dnt.monitor.meta.MetaField;
import dnt.monitor.meta.MetaRelation;
import dnt.monitor.meta.MetaResource;
import dnt.monitor.meta.ssh.MetaValue;
import dnt.monitor.model.LinuxHost;
import dnt.monitor.service.MetaService;
import dnt.monitor.support.MetaManagerConfig;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertTrue;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SshFieldComputerTest.TestConfig.class)
public class SshFieldComputerTest {

    @Autowired
    private FieldComputer fieldComputer;

    @Autowired
    private MetaService metaService;

    private MetaResource linux;

    @Before
    public void initLinux() throws Exception {
        linux = (MetaResource) metaService.resolve(LinuxHost.class);
    }

    @Test
    public void testFillMemory() throws Exception {
        MetaRelation metaRelation = (MetaRelation) linux.getMember("memory");
        MetaField field = (MetaField) metaRelation.getMetaModel().getMember("usage");
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("used", "111");
        data.put("total", "111");
        assertTrue(fieldComputer.computeField(field, data).equals(1f));
    }

    @Test
    public void testConverterFormat() throws Exception {
        String format = "yyyy-MM-dd";
        String value = "2015-03-26";
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        Date now = sdf.parse(value);
        Map<String, Object> dataMap = new HashMap<String, Object>();
        dataMap.put("localTime", value);
        MetaField field = (MetaField) linux.getMember("localTime");
        MetaValue metaValue = new MetaValue();
        metaValue.setFormat(format);
        field.setValue(metaValue);
        assertTrue(((Date) fieldComputer.computeField(field, dataMap)).getTime() == now.getTime());
    }

    @Test
    public void testFillAndUnitRate() throws Exception {
        MetaField field = (MetaField) linux.getMember("cpuCount");
        MetaValue metaValue = new MetaValue();
        metaValue.setUnitRate(10);
        field.setValue(metaValue);

        Map<String, Object> dataMap = new HashMap<String, Object>();
        dataMap.put("cpuCount", "333.111");
        assertTrue(fieldComputer.computeField(field, dataMap).equals(3330));
    }

    @Test
    public void testFillMap() throws Exception {
        MetaField field = (MetaField) linux.getMember("cpuCount");
        MetaValue metaValue = new MetaValue();
        metaValue.setValue("abc1+${abc2}*abc3");
        field.setValue(metaValue);

        Map<String, Object> data = new HashMap<String, Object>();
        data.put("abc1", "50");
        data.put("abc2", "10");
        data.put("abc3", "10.5");
        assertTrue(fieldComputer.computeField(field, data).equals(155));
    }

    @Configuration
    @Import(MetaManagerConfig.class)
    @ComponentScan("dnt.monitor.engine.ssh.support")
    static class TestConfig {

    }
}
