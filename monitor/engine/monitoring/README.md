资源监控模块
===========

本模块的输入为：

 1. NodeStore的node信息
 2. PolicyStore的policy信息

本模块的输出为：

 1. ResourceStore里面的Resource
 2. Resource的可用性状态事件
 3. Resource的各种指标事件

本模块的主要内容为:

 Resource Monitoring Task

如下输入将会影响到这些Task：

 1. Resource Node Added
   if state == Running, create a new task
 2. Resource Node Removed
   if has corresponding task, remove it
 3. Resource Node Updated
   if has corresponding task, adjust it
 4. Group Node Updated
   iterate all tasks, check task's node is descendants of the updating node
   check the task node's is affected or not
   if affected, adjust it
 5. Policy Added
 6. Policy Removed
 7. Policy Updated
   iterate all tasks of corresponding type
   calculate the task's node policy against all policies
   check the policy is changed or not
   if changed, adjust the task
   if not changed, check the policy is updated or not
   if updated, adjust the task
