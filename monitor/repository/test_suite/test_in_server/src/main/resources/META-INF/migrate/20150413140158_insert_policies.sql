-- // insert_policies
-- Migration SQL that makes the change goes here.

INSERT INTO resource_policies (id, label, priority, enabled, resource_type, criteria, metrics, configs, alarms, notifications, actions)
VALUES
  (1, '主机缺省规则', 0, TRUE, '/dev/host', NULL,
   '[{"@class":"dnt.monitor.policy.MetricPolicy","fieldName":"processCount","keyed":true,"critical":90.0,"warning":75.0,"occurrences":3,"unit":"%"}]',
   '[{"@class":"dnt.monitor.policy.ConfigPolicy","fieldName":"hostname","keyed":true,"unit":null},{"@class":"dnt.monitor.policy.ConfigPolicy","fieldName":"domain","keyed":false,"unit":null}]',
   '[{"@class":"dnt.monitor.policy.AlarmPolicy","title":"test-alarm","description":"a test alarm","enabled":true,"severity":"CRITICAL","priority":"High"}]',
   '[{"@class":"dnt.monitor.policy.NotificationPolicy","enabled":true,"title":"notify-rule","comment":"a-notify-rule","methods":["SoundBox","WeChat","Web","SMS"],"receivers":["monitors","admins"],"limitation":"once in one hour","alarms":["test-alarm"],"window":"08:00:00-18:00:00"}]',
   '[{"@class":"dnt.monitor.policy.ActionPolicy","enabled":true,"title":"test-action","comment":"A test action","alarms":["test-alarm"],"execution":null}]'),
  (2, '主机定制规则', 1, TRUE, '/dev/host', NULL,
   '[{"@class":"dnt.monitor.policy.MetricPolicy","fieldName":"processCount","keyed":false,"critical":89.0,"warning":70.0,"occurrences":2,"unit":"%"}]',
   '[{"@class":"dnt.monitor.policy.ConfigPolicy","fieldName":"hostname","keyed":true,"unit":null},{"@class":"dnt.monitor.policy.ConfigPolicy","fieldName":"domain","keyed":true,"unit":null}]',
   '[{"@class":"dnt.monitor.policy.AlarmPolicy","title":"second-alarm","description":"a second alarm","enabled":true,"severity":"CRITICAL","priority":"Normal"}]',
   '[{"@class":"dnt.monitor.policy.NotificationPolicy","enabled":true,"title":"another-notify-rule","comment":"another-notify-rule","methods":["SoundBox","WeChat","Web","SMS"],"receivers":["monitors","admins"],"limitation":"once in one hour","alarms":["second-alarm"],"window":"08:00:00-18:00:00"}]',
   '[{"@class":"dnt.monitor.policy.ActionPolicy","enabled":true,"title":"another-action","comment":"Another test action","alarms":["another-alarm"],"execution":null}]'),
  (3, '主机局部规则', 2, TRUE, '/dev/host', 'address in 192.168.12.0/24',
   '[{"@class":"dnt.monitor.policy.MetricPolicy","fieldName":"processCount","keyed":false,"critical":95.0,"warning":90.0,"occurrences":4,"unit":"%"}]',
   '[{"@class":"dnt.monitor.policy.ConfigPolicy","fieldName":"hostname","keyed":true,"unit":null},{"@class":"dnt.monitor.policy.ConfigPolicy","fieldName":"domain","keyed":true,"unit":null}]',
   '[{"@class":"dnt.monitor.policy.AlarmPolicy","title":"critical-alarm","description":"critical alarm","enabled":true,"severity":"CRITICAL","priority":"VeryHigh"}]',
   '[{"@class":"dnt.monitor.policy.NotificationPolicy","enabled":true,"title":"critical-notify-rule","comment":"critical-notify-rule","methods":["SoundBox","WeChat","Web","SMS"],"receivers":["monitors","admins"],"limitation":"once in one hour","alarms":["critical-alarm"],"window":"00:00:00-23:59:59"}]',
   '[{"@class":"dnt.monitor.policy.ActionPolicy","enabled":true,"title":"critical-action","comment":"critical action","alarms":["critical-alarm"],"execution":null}]');

INSERT INTO component_policies (id, resource_policy_id, field_name, criteria, frequency, state, keyed, metrics, configs)
VALUES
 (1, 1, 'CPU', NULL, '3m', 'Running', TRUE,
  '[{"@class":"dnt.monitor.policy.MetricPolicy","fieldName":"usage","keyed":true,"critical":95.0,"warning":85.0,"occurrences":4,"unit":"%"},{"@class":"dnt.monitor.policy.MetricPolicy","fieldName":"usrUsage","keyed":true,"critical":70.0,"warning":60.0,"occurrences":3,"unit":"%"}]',
  '[{"@class":"dnt.monitor.policy.ConfigPolicy","fieldName":"frequency","keyed":true,"unit":null},{"@class":"dnt.monitor.policy.ConfigPolicy","fieldName":"modelName","keyed":true,"unit":null}]}]'),
 (2, 1, 'CPUs', '(idx % 2) == 0', '30m', 'Running', TRUE,
  '[{"@class":"dnt.monitor.policy.MetricPolicy","fieldName":"usage","keyed":true,"critical":99.0,"warning":90.0,"occurrences":4,"unit":"%"},{"@class":"dnt.monitor.policy.MetricPolicy","fieldName":"usrUsage","keyed":true,"critical":90.0,"warning":70.0,"occurrences":5,"unit":"%"}]',
  '[{"@class":"dnt.monitor.policy.ConfigPolicy","fieldName":"frequency","keyed":true,"unit":null},{"@class":"dnt.monitor.policy.ConfigPolicy","fieldName":"modelName","keyed":true,"unit":null}]}]');

-- //@UNDO
-- SQL to undo the change goes here.
TRUNCATE TABLE component_policies;
TRUNCATE TABLE resource_policies;

