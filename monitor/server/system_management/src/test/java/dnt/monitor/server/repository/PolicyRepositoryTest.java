package dnt.monitor.server.repository;

import dnt.monitor.policy.*;
import net.happyonroad.type.Priority;
import net.happyonroad.type.Severity;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@ContextConfiguration(classes = PolicyRepositoryConfig.class)
@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
public class PolicyRepositoryTest {

    @Autowired
    PolicyRepository repository;

    ResourcePolicy policy;
    ComponentPolicy[] cpuPolicies;

    @After
    public void tearDown() throws Exception {
        if (policy.getId() != null)
            repository.deleteById(policy.getId());
        for (ComponentPolicy cpuPolicy : cpuPolicies) {
            if( cpuPolicy.getId() != null )
                repository.deleteComponentPolicy(cpuPolicy);
        }
    }

    @Test
    public void testFindAllByResourceType() throws Exception {
        assertEquals(3, repository.findAllByResourceType("/dev/host").size());
    }

    @Test
    public void testFindById() throws Exception {
        ResourcePolicy policy = repository.findById(1L);
        assertNotNull(policy);
    }

    @Test
    public void testCreate() throws Exception {
        repository.create(policy);
        assertNotNull(policy.getId());
    }

    @Test
    public void testCreateComponentPolicy() throws Exception {
        repository.create(policy);
        for (ComponentPolicy cpuPolicy : cpuPolicies) {
            cpuPolicy.setResourcePolicyId(policy.getId());
            repository.createComponentPolicy(cpuPolicy);
        }
        ResourcePolicy newPolicy = repository.findById(policy.getId());
        assertNotNull(newPolicy.getComponents());
        assertEquals(1, newPolicy.getComponents().length);
    }

    @Test
    public void testUpdate() throws Exception {
        repository.create(policy);
        policy.setLabel("new-policy");
        repository.update(policy);
        ResourcePolicy anotherInstance = repository.findById(policy.getId());
        assertEquals("new-policy", anotherInstance.getLabel());
    }

    @Test
    public void testUpdateComponentPolicy() throws Exception {
        repository.create(policy);
        for (ComponentPolicy cpuPolicy : cpuPolicies) {
            cpuPolicy.setResourcePolicyId(policy.getId());
            repository.createComponentPolicy(cpuPolicy);
        }
        cpuPolicies[0].setCriteria("new-criteria");
        repository.updateComponentPolicy(cpuPolicies[0]);

        ResourcePolicy newPolicy = repository.findById(policy.getId());
        assertNotNull(newPolicy.getComponents());
        assertEquals(1, newPolicy.getComponents().length);
        assertEquals("new-criteria", newPolicy.getComponents()[0].getCriteria());
    }

    @Test
    public void testDeleteById() throws Exception {
        repository.create(policy);
        repository.deleteById(policy.getId());
        policy.setId(null);
    }

    @Test
    public void testDeleteComponentPolicy() throws Exception {
        repository.create(policy);
        for (ComponentPolicy cpuPolicy : cpuPolicies) {
            cpuPolicy.setResourcePolicyId(policy.getId());
            repository.createComponentPolicy(cpuPolicy);
        }

        repository.deleteComponentPolicy(cpuPolicies[0]);

        ResourcePolicy newPolicy = repository.findById(policy.getId());
        assertNotNull(newPolicy.getComponents());
        assertEquals(0, newPolicy.getComponents().length);

    }

    @Before
    public void setUp() throws Exception {
        policy = new ResourcePolicy();
        policy.setLabel("a-test-policy");
        policy.setPriority(Priority.High);
        policy.setEnabled(true);
        policy.setResourceType("/dev/host");
        policy.setCriteria("domain = 'dnt'");
        MetricPolicy[] metrics = new MetricPolicy[1];
        metrics[0] = new MetricPolicy();
        metrics[0].setFieldName("processCount");
        metrics[0].setKeyed(true);
        metrics[0].setCritical(90);
        metrics[0].setWarning(75);
        metrics[0].setOccurrences(3);
        metrics[0].setUnit("%");
        policy.setMetrics(metrics);

        ConfigPolicy[] configs = new ConfigPolicy[2];
        configs[0] = new ConfigPolicy();
        configs[0].setFieldName("hostname");
        configs[0].setKeyed(true);
        configs[1] = new ConfigPolicy();
        configs[1].setFieldName("domain");
        policy.setConfigs(configs);

        AlarmPolicy[] alarms = new AlarmPolicy[1];
        alarms[0] = new AlarmPolicy();
        alarms[0].setTitle("test-alarm");
        alarms[0].setDescription("a test alarm");
        alarms[0].setEnabled(true);
        alarms[0].setPriority(Priority.High);
        alarms[0].setSeverity(Severity.CRITICAL);
        policy.setAlarms(alarms);


        NotificationPolicy[] notifications = new NotificationPolicy[1];
        notifications[0] = new NotificationPolicy();
        notifications[0].setTitle("notify-rule");
        notifications[0].setEnabled(true);
        notifications[0].setComment("a-notify-rule");
        List<String> alarmNames = new ArrayList<String>();
        alarmNames.add("test-alarm");
        notifications[0].setAlarms(alarmNames);
        notifications[0].setLimitation("once in one hour");
        notifications[0].setWindow("08:00:00-18:00:00");
        Set<String> methods = new HashSet<String>();
        methods.add("SMS");
        methods.add("WeChat");
        methods.add("Web");
        methods.add("SoundBox");
        notifications[0].setMethods(methods);
        Set<String> receivers = new HashSet<String>();
        receivers.add("admins");
        receivers.add("monitors");
        notifications[0].setReceivers(receivers);
        policy.setNotifications(notifications);

        ActionPolicy[] actions = new ActionPolicy[1];
        actions[0] = new ActionPolicy();
        actions[0].setTitle("test-action");
        actions[0].setEnabled(true);
        actions[0].setAlarms(alarmNames);
        actions[0].setComment("A test action");
        policy.setActions(actions);

        cpuPolicies = new ComponentPolicy[1];
        cpuPolicies[0] = new ComponentPolicy();
        cpuPolicies[0].setFieldName("CPU");
        cpuPolicies[0].setKeyed(true);

        MetricPolicy[] cpuMetrics = new MetricPolicy[2];
        MetricPolicy usageMetric = new MetricPolicy();
        usageMetric.setFieldName("usage");
        usageMetric.setKeyed(true);
        usageMetric.setUnit("%");
        usageMetric.setOccurrences(4);
        usageMetric.setCritical(95);
        usageMetric.setWarning(85);
        cpuMetrics[0] = usageMetric;

        MetricPolicy usrUsageMetric = new MetricPolicy();
        usrUsageMetric.setFieldName("usrUsage");
        usrUsageMetric.setKeyed(true);
        usrUsageMetric.setUnit("%");
        usrUsageMetric.setOccurrences(3);
        usrUsageMetric.setCritical(70);
        usrUsageMetric.setWarning(60);
        cpuMetrics[1] = usrUsageMetric;

        cpuPolicies[0].setMetrics(cpuMetrics);

        ConfigPolicy[] cpuConfigs = new ConfigPolicy[2];
        ConfigPolicy freqConfig = new ConfigPolicy();
        freqConfig.setFieldName("frequency");
        freqConfig.setKeyed(true);
        cpuConfigs[0] =  freqConfig;

        ConfigPolicy modelNameConfig = new ConfigPolicy();
        modelNameConfig.setFieldName("modelName");
        modelNameConfig.setKeyed(true);
        cpuConfigs[1] = modelNameConfig;

        cpuPolicies[0].setConfigs(cpuConfigs);

        policy.setComponents(cpuPolicies);
        //System.out.println(ParseUtils.toJSONString(policy));
    }
}