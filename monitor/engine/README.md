Engine Architecture
======================

1. 整体结构
-----------

```
                          <discover>
                     ________________________
                    /                        \
                   /       +---------+     +--------------+   +--------------+  +-----------------+
                  /        | Devices |     | Applications |   | Hosts<agent> |  | Network Devices |
                 /         +---------+     +--------------+   +--------------+  +-----------------+
                /          /          \             /                     /<pushing>/<snmp trap, syslog>
               /          /            \           /                     /         /
              /<discover>/              \<polling>/                     /         /
            +-------------+            +------------+             +------------+ /
            | Discovering |            | Monitoring |\___         | Receiving  |/
            +-------------+            +------------+    \        +------------+
                   \                  /      \            \               /
                    \                /        \            \             /
                     \              /          \            \           /
                      \            /            \            \         /
                       \ <using>  /              \            \<store>/
  +--------------+    +------------+   +-------------------+   \ +----------------+    +--------------+   +-----------+  +-------------+
  | Policy Store |    | Node Store |   |MonitoringTaskStore|    \| Resource Store |    | Metric Store |   | Log Store |  | Alarm Store |
  +--------------+    +------------+   +-------------------+     +----------------+    +--------------+   +-----------+  +-------------+
                                                                  /       \                     /
                                                 <metric events> /         \<resource events>  /
                                                                /           \                 /
        +----------------+                      +--------------+           +---------------+ /
        | Infrastructure |                      | Thresholding |           |    Recording  |/
        +----------------+                      +--------------+           +---------------+


```

2. 存储说明
----------

引擎内主要分为如下几块存储信息：

1、 Node Store

 存储Server发过来的管理节点，里面主要代表了节点的管理策略
 这部分信息的流向为 Server -> Engine，不应该出现 Engine -> Server的流向。

2、 Resource Store

 存储Engine采集到的各种资源的当前快照信息，并基于该信息生成指标事件；这部分信息的流向为 Engine -> Server，不应该出现 Server -> Engine的流向。

3、 Policy Store

 存储由Server同步给引擎的各种资源管理策略，这部分信息为 Server -> Engine单向流动

4、 Monitoring Task Store

 存储监控模块的面向资源的监控任务

5、 Metric Store

 由记录模块存储的指标历史记录，采用RRD方案存储。

6、 Alarm Store

 告警信息，虽然在引擎侧不进行存储，都是产生了之后立刻向服务器发生，但对于网络临时断开等场景，引擎需要缓存最近1小时(或者其他方式指配)的告警。

7、 Log Store

 各个模块产生的日志信息，都存储于该部分，定期上传给监控服务器

3. 模块说明
----------

1、 Infrastructure

 基础模块，各种对象Store都由该模块提供；另外，负责引擎的身份管理，连接管理。
 NodeStore, Policy Store, ResourceStore的维护者，负责管理Node/Resource/Policy对象(查阅/添加/删除/修改)

2、 Sample

 根据Node的管理信息+策略和资源的元模型，负责执行对资源，组件的采集，本模块主要是对各种采集能力的支持，包括：
 snmp/ssh/wbem/jdbc/wmi/jmx等
 本模块同时也提供了自定义采集的能力

3、 Discovering

 负责执行搜索和发现，Node Store里面的nodes是其输入，Resource Store里面的resource是其输出；

4、 Monitoring

 负责按照Node信息，以及Policy信息，维护资源的可用性状态，并使用Sample模块，对可用的资源进行定期轮询式监控
 其将会定期更新Resource Store里面的resource信息，从而在内部产生Metric事件，并维护(更新)MO的性能/配置状态。

5、 Receiving

 该模块的作用与Monitoring模块类似，只是其机制为等待外部对象（Agnet, Syslogd, Snmp Trapd）等发送数据/事件

6、 Thresholding

 该模块主要是基于Resource的各种事件(Metric, Status Event)，按照Policy信息执行相应的告警生成；

7、 Recording

 该模块主要是在Resource的更新事件，参考Metric Event，采用RRD技术记录各种对象的指标组。

8、 Release

 该模块为最终组装模块，负责将引擎组装为一个可运行的程序。

10、Repositories

 这些为整体扩展包，包括了能力扩展和资源模型扩展两大类。