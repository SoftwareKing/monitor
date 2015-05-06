angular.module("Resources.Windows", ["Lib.ChartUtils"])

.controller("WindowsDetailCtrl", ["$scope", "$stateParams", "$resource", "ChartService","$location", "params", "parentScope",
    ($scope,   $stateParams,   $resource,  ChartService, $location,   params,   parentScope)->
      console.log "Init WindowsDetailCtrl"
      $scope.path = $location.path()
      $scope.close = parentScope.close
      echartService=new ChartService()

      $(document).ready ->
        $resource("api/hosts/by_address?address=#{params.address}").get (data)->
          $scope.host = data
          host=data
          $scope.$on "ngRepeatFinished", (ngRepeatFinishedEvent) ->
            $.each host.cpus, (key, cpu) ->
              #cpu使用率柱状图
              cpuBarChart=echarts.init(document.getElementById("zcpuBar#{cpu.idx}"));
              cpuBarDatas=[cpu.usage*100,cpu.usrUsage*100,cpu.sysUsage*100,cpu.idle * 100 ,cpu.ioWait*100]
              cpuBarChart.setOption(echartService.getCpuBarOption(cpuBarDatas))
              #cpu一段时间记录图
              cpuChart = echarts.init(document.getElementById("zcpu#{cpu.idx}"));
              cpuChart.setOption(echartService.getCpuLineOption())
              echartService.setCpuDatas(cpuChart,cpu)
            $.each host.partitions, (key, partition) ->
              partitionPie = echarts.init(document.getElementById(partition.id))
              usedData={name:'已使用'+partition.used+'MB',value:partition.used}
              freeData={name:'可用'+partition.free+'MB',value:partition.used}
              partitionPie.setOption(echartService.getPieOption(usedData,freeData,"磁盘"))
            #总cpu柱状图
            cpuBarChart=echarts.init(document.getElementById("cpuBar#{host.cpu.idx}"));
            cpuBarDatas=[host.cpu.usage*100,host.cpu.usrUsage*100,host.cpu.sysUsage*100,host.cpu.idle * 100 ,host.cpu.ioWait*100]
            cpuBarChart.setOption(echartService.getCpuBarOption(cpuBarDatas))
            #总cpu历史记录
            cpuChart = echarts.init(document.getElementById("cpu#{host.cpu.idx}"));
            cpuChart.setOption(echartService.getCpuLineOption())
            echartService.setCpuDatas(cpuChart,host.cpu)

          #物理内存
          ramPie = echarts.init(document.getElementById("ramPie"));
          ramused={name:'已使用'+host.memory.used+'MB',value:host.memory.used}
          ramfree={name:'可用'+host.memory.free+'MB',value:host.memory.free}
          ramPie.setOption(echartService.getPieOption(ramused,ramfree,"物理内存"))
          #虚拟内存
          vmPie = echarts.init(document.getElementById("vmPie"));
          vmused={name:'已使用'+host.memory.virtualUsed+'MB',value:host.memory.virtualUsed}
          vmfree={name:'可用'+host.memory.virtualFree+'MB',value:host.memory.virtualFree}
          vmPie.setOption(echartService.getPieOption(vmused,vmfree,"虚拟内存"))

  ])
