# The Workflow demo application(index)
angular.module('Monitor.ServerIndex', [
  'Platform.Index',
  'ServerIndex.Templates',
  'Resources.Templates',
  'ServerIndex.Resources',
  "ServerIndex.ManageNode",
  'ServerIndex.MonitorLogs',
  'ServerIndex.OperationLogs',
  'ServerIndex.Events',
  'ServerIndex.Topos',
  'ServerIndex.ToposManage',
  'ServerIndex.ToposManageView',
  'ResourcesIndex.Definition'
]);
