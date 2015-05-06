package dnt.monitor.engine.support;

import dnt.monitor.engine.util.BoundaryCronTrigger;
import net.happyonroad.type.TimeInterval;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class TriggerManagerTest {

    TriggerManager manager;

    @Before
    public void setUp() throws Exception {
        manager = new TriggerManager();
    }

    @Test
    public void testCreate() throws Exception {
        BoundaryCronTrigger trigger = manager.create(new TimeInterval("5m"), null, null);
        Assert.assertEquals("0 0/5 * * * *", trigger.getExpression()) ;
    }

    @Test
    public void testCreateWithOffset() throws Exception {
        TimeInterval frequency = new TimeInterval("5m");
        BoundaryCronTrigger trigger = manager.create(frequency, null, null);
        Assert.assertEquals("0 0/5 * * * *", trigger.getExpression()) ;
        trigger = manager.create(frequency, null, null);
        Assert.assertEquals("30 0/5 * * * *", trigger.getExpression()) ;
        trigger = manager.create(frequency, null, null);
        Assert.assertEquals("0 1/5 * * * *", trigger.getExpression()) ;
        trigger = manager.create(frequency, null, null);
        Assert.assertEquals("30 1/5 * * * *", trigger.getExpression()) ;
        trigger = manager.create(frequency, null, null);
        Assert.assertEquals("0 2/5 * * * *", trigger.getExpression()) ;
        trigger = manager.create(frequency, null, null);
        Assert.assertEquals("30 2/5 * * * *", trigger.getExpression()) ;
        trigger = manager.create(frequency, null, null);
        Assert.assertEquals("0 3/5 * * * *", trigger.getExpression()) ;
        trigger = manager.create(frequency, null, null);
        Assert.assertEquals("30 3/5 * * * *", trigger.getExpression()) ;
        trigger = manager.create(frequency, null, null);
        Assert.assertEquals("0 4/5 * * * *", trigger.getExpression()) ;
        trigger = manager.create(frequency, null, null);
        Assert.assertEquals("30 4/5 * * * *", trigger.getExpression()) ;
        trigger = manager.create(frequency, null, null);
        Assert.assertEquals("0 0/5 * * * *", trigger.getExpression()) ;

    }
}