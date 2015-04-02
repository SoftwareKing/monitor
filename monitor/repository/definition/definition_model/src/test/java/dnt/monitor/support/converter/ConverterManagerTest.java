package dnt.monitor.support.converter;

import dnt.monitor.service.TypeConverter;
import dnt.monitor.service.TypeConverterService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Date;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = ConverterManagerTest.TestConfig.class)
public class ConverterManagerTest {

    @Autowired
    private TypeConverterService manager;

    @Test
    public void testManager() throws Exception {
        manager.register("abc", new NewConverter());
        Assert.assertTrue(manager.get(int.class.getName()) instanceof DefaultConverter);
        Assert.assertTrue(manager.get(Integer.class.getName()) instanceof DefaultConverter);
        Assert.assertTrue(manager.get(long.class.getName()) instanceof DefaultConverter);
        Assert.assertTrue(manager.get(Long.class.getName()) instanceof DefaultConverter);
        Assert.assertTrue(manager.get(float.class.getName()) instanceof DefaultConverter);
        Assert.assertTrue(manager.get(Float.class.getName()) instanceof DefaultConverter);
        Assert.assertTrue(manager.get(double.class.getName()) instanceof DefaultConverter);
        Assert.assertTrue(manager.get(Double.class.getName()) instanceof DefaultConverter);
        Assert.assertTrue(manager.get(boolean.class.getName()) instanceof DefaultConverter);
        Assert.assertTrue(manager.get(Boolean.class.getName()) instanceof DefaultConverter);
        Assert.assertTrue(manager.get(String.class.getName()) instanceof DefaultConverter);
        Assert.assertTrue(manager.get(Date.class.getName()) instanceof DefaultConverter);
        Assert.assertTrue(manager.get("secondToDate") instanceof SecondToDateConverter);
        Assert.assertTrue(manager.get("abc") instanceof NewConverter);
    }

    class NewConverter implements TypeConverter {
        @Override
        public Object convert(String valueText, String format, Class valueType) throws Exception {
            return null;
        }
    }

    @Configuration
    static class TestConfig {
        @Bean
        public TypeConverterService manager(){
            return new ConverterManager();
        }
    }
}
