package dnt.monitor.support.converter;

import dnt.monitor.service.TypeConverter;
import org.junit.Assert;
import org.junit.Test;

import java.util.Date;

/**
 * <h1>Class Title</h1>
 *
 * @author mnnjie
 */
public class SecondToDateConverterTest {
    @Test
    public void testConvert() throws Exception {
        TypeConverter converter = new SecondToDateConverter();
        long now = new Date().getTime()/1000;
        Assert.assertTrue(((Date)converter.convert(now+"","",Date.class)).getTime()/1000==now);
    }
}
