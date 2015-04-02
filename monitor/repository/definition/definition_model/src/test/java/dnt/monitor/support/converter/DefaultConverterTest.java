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
public class DefaultConverterTest {
    @Test
    public void testConvert() throws Exception {
        TypeConverter converter = new DefaultConverter();
        String input = "   111.234  ";
        Assert.assertTrue(converter.convert(input,null,int.class).equals(111));
        Assert.assertTrue(converter.convert(input,"aaa",Integer.class).equals(111));
        Assert.assertTrue(converter.convert(input,"",long.class).equals(111l));
        Assert.assertTrue(converter.convert(input,"aaa",Long.class).equals(111l));
        Assert.assertTrue(converter.convert(input,"aaa",double.class).equals(111.234));
        Assert.assertTrue(converter.convert(input,"aaa",Double.class).equals(111.234));
        Assert.assertTrue(converter.convert(input,"aaa",float.class).equals(111.234f));
        Assert.assertTrue(converter.convert(input,"aaa",Float.class).equals(111.234f));
        Assert.assertTrue(converter.convert(input,"aaa",String.class).equals(input));
        Assert.assertTrue(converter.convert("2015","yyyy",Date.class) instanceof Date);
        Assert.assertTrue((Boolean)converter.convert("true","",boolean.class));
        Assert.assertTrue((Boolean)converter.convert(" true   ","",Boolean.class));
    }
}
