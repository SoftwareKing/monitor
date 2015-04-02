angular.module('Lib.ChartUtils', [])

  #ng渲染数据完毕指令
  .directive("onFinishRender", ($timeout) ->
    restrict: "A"
    link: (scope, element, attr) ->
      if scope.$last is true
        $timeout ->
          scope.$emit "ngRepeatFinished"
  )

  .factory('ChartTreeService', [->
      class ChartTreeService
        constructor:() ->
          @domID=''
          @chartDomId=''
          @tree={}
          @treeNodes={}
        getSetting:(nodeService,chartDomID,chartService)->
          self=this
          showIconForTree =(treeId, treeNode) ->
            !treeNode.isParent
          onClick =(event, treeId, treeNode, clickFlag) ->
            console.log treeNode
            console.log "根据node获取展示图数据"
            if treeNode.type is "single"
              self.createGraph(chartDomID,chartService)
          setting =
            view: showIcon: showIconForTree
#            data: simpleData: enable: true//json以数组或者对象的形式控制
            callback: onClick: onClick
          return setting

        initTree:(domID,nodeService,chartDomID,chartService)->
          @domID=domID
          @chartDomId=chartDomID
          @chartService
#          @tree=$.fn.zTree.init $(domID), @getSetting(nodeService,chartDomID,chartService), @treeNodes



        getChartData:(chartDomID,nodeService,treeNode)->

        createGraph:(chartDomID,chartService)->
          chart = echarts.init(document.getElementById(chartDomID));
          if chartDomID is "realTimeLineGraph"
            xdata=[1,2,3,4,5,6,7,8,9,10,11,12,13,14]
            ydata=[10,20,30,40,5,60,70,6,50,40,30,10,70,20]
          else
            xdata=[1,2,3,4,5,6,7,8,9,10,11,12,13,14]
            ydata=[1,2,3,4,5,6,7,6,5,4,30,10,70,20]
          chart.setOption(chartService.getLineOption(xdata,ydata))
        #根据meta展示资源树和chart图
        setRealAndModelData:(modelData,realData)->
           realmodel=@contactRealDataToModel(modelData,realData)
#           treeNodes=@getTreeNodes(modelData,realmodel)
           treeNodes=@getTreeObject(modelData,realmodel)
           @tree=$.fn.zTree.init $("#realTimeTree"), @getSetting(null,'realTimeLineGraph',@chartService), treeNodes
           tree1=$.fn.zTree.init $("#twoDaysTree"), @getSetting(null,'twoDaysLineGraph',@chartService), treeNodes
           tree2=$.fn.zTree.init $("#oneWeekTree"), @getSetting(null,'oneWeekLineGraph',@chartService), treeNodes
           tree3=$.fn.zTree.init $("#oneMonthTree"), @getSetting(null,'oneMonthLineGraph',@chartService), treeNodes
           tree4=$.fn.zTree.init $("#twoYearsTree"), @getSetting(null,'twoYearsLineGraph',@chartService), treeNodes

        #模型和数据建立联系
        contactRealDataToModel:(modelData,realData)->
          realDatas={}
          modelDatas={}
          realDataModels={realDatas,modelDatas}
          root=realData.label
          realDatas[modelData.label]=root
          modelDatas[modelData.label]=modelData
          for  compenent in modelData.components
               compenentName=compenent.name.toLowerCase()
               data=realData[compenentName]
               modelDatas[compenentName]=compenent
               realDatas[compenentName]=data
          return realDataModels

        setChartService:(chartService)->
          @chartService=chartService

        #得到根据模型得到数据并处理成树节点（json对象的形式）
        getTreeObject:(modelData,realDataModels)->
          rootChildren=[]
          compenents=modelData.components
          for compenent in compenents
            compenentData=realDataModels.realDatas[compenent.name.toLowerCase()]
            continue  if compenentData is null
            if compenent.dataType is "single"
              compenentObject={name:compenentData.label,type:"single",data:compenentData,isParent:false}
            else
              compenentChildren=[]
              for data in compenentData
                compenentObject={name:data.label,type:"single",data:data,isParent:false}
                compenentChildren.push(compenentObject)
              compenentObject={name:compenent.label,type:"arry",isParent:true,children:compenentChildren}
            rootChildren.push(compenentObject)
          treeObject={name:realDataModels.realDatas[modelData.label],type:"root",open:true,isParent:true,children:rootChildren}
          return treeObject
        #得到根据模型得到数据并处理成树节点（对象数组的形式）
        getTreeNodes:(modelData,realDataModels)->
          treeNodes= new Array()
          node={ id:1, pId:0, name:"", open:true,type:"",isParent:true,data:{}}
          node.name=realDataModels.realDatas[modelData.label]
          node.type="root"
          treeNodes.push(node)
          compenents=modelData.components
          id=1
          getchildren=(datas,node,treeNodes)->
            id=node.id
            for data in datas
              vnode={ id:0, pId:0, name:"",type:"",data:{},isParent:false}
              chirldid="arry"
              id=id+1
              chirldid=chirldid+id
              vnode.pId=node.id
              vnode.id=chirldid
              vnode.data=data
              vnode.name=data.label
              vnode.type="single"
              treeNodes.push(vnode)
          for compenent in compenents
            compenentData=realDataModels.realDatas[compenent.name.toLowerCase()]
            continue  if compenentData is null
            vnode={ id:0, pId:0, name:"",type:"",data:{},isParent:false}
            vnode.pId=node.id
            id=id+1
            vnode.id=id
            vnode.data=compenentData
            vnode.name=compenent.label
            if compenent.dataType is "single"
              vnode.name=compenentData.label
            vnode.type=compenent.dataType
            treeNodes.push(vnode)
            if compenent.dataType is "array"
              vnode.isParent=true
              getchildren(compenentData,vnode,treeNodes)
          return treeNodes



  ])
  .factory('ChartService', [->
        class ChartService
          constructor: ->

          getLineOption:(xdata,ydata)->
            option =
              tooltip: trigger: 'axis'
              legend: data: [ '使用率' ]
              toolbox:
                show: true
                feature:
#                  mark: show: true
#                  dataZoom: show: true
                  dataView: show: true
                  magicType:
                    show: true
                    type: [ 'line','bar']
                  restore: show: true
                  saveAsImage: show: true
              calculable: false
              xAxis: [ {type: 'category',boundaryGap: false,data: xdata} ]
              yAxis: [ { type: 'value',axisLabel:{formatter: '{value} %'} ,'max':100} ]
              series:[{name:'使用率',type:'line',data:ydata}]
            return option

          getCpuLineOption :()->
            CpuLineOption=
              tooltip: {trigger: 'axis'}
              legend: {data:['CPU使用率','用户使用率','系统使用率','空闲率','IO等待率'],orient : 'vertical',x : 'left',textStyle:{fontSize:11},itemWidth :10, itemHeight:9}
              xAxis : [{type : 'category',boundaryGap : false,data : ["0","1","2","3","4","5","6"]}]
              yAxis : [{type : 'value','name':'占用百分比（%）','max':100}]
              calculable : true
              grid:{backgroundColor:"rgba(0,0,0,0)",borderColor:'#ccc',x:'40%',y:'40%'}
              series : [
                {name: "CPU使用率",type: "line",data: [0, 0, 0, 0, 0, 0, 0],smooth: true}
                {name: "用户使用率",type: "line",data: [0, 0, 0, 0, 0, 0, 0],smooth: true}
                {name: "系统使用率",type: "line",data: [0, 0, 0, 0, 0, 0, 0],smooth: true}
                {name: "空闲率",type: "line",data: [0, 0, 0, 0, 0, 0, 0],smooth: true}
                {name: "IO等待率",type: "line",data: [0, 0, 0, 0, 0, 0, 0],smooth: true}
              ]
            return CpuLineOption

          getCpuBarOption :(cpuDatas)->
            CpuBarOption=
              tooltip: {trigger: 'item'}
              legend: {data:['资源利用率']}
              xAxis : [{type : 'category',data:['CPU','用户','系统','空闲','IO'],textStyle:{fontSize:5}}]
              yAxis : [{type : 'value',max:100}]
              calculable : true
              series : [
                {
                  name: "cpu资源使用率",
                  type: "bar",
                  itemStyle: {
                    normal: {
                      label : {
                        show : true,
                        textStyle : {fontSize : '12',fontFamily : '微软雅黑',fontWeight : 'bold' }
                      }
                    }
                  }
                  data:[cpuDatas[0],cpuDatas[1],cpuDatas[2],cpuDatas[3],cpuDatas[4]]
                }
              ]
            return CpuBarOption
          getPieOption:(usedData,freeData,name)->
#            if color is 'Normal'
#              color='rbga(0,255,0,1)'
#            else if color is 'Warning'
#              color='rbga(255,255,0,1)'
#            else if color is 'Critical'
#              color='rbga(255,0,0,1)'
#            else if color is 'Unknown'
#              color='rbga(0,0,255,1)'
            PieOption =
              legend: {data:[usedData.name,freeData.name],orient : 'vertical',x : 'left',textStyle:{fontSize:12},itemWidth :10, itemHeight:9,selectedMode:false}
              tooltip: {trigger: 'item',formatter: "{a} <br/>{b}({d}%)",textStyle:{fontSize:7}}
              calculable: false
              series : [
                name:name
                type:"pie"
                radius:'60%'
                center:['50%','60%']
                itemStyle :
                  emphasis :
                    label : {show : true,formatter : "{b}\n{d}%"}
                  normal :
                    label :
                      position : 'inner',
                      formatter :
                        (a, b, c, d) ->
                          (d - 0).toFixed(0) + "%"
                    labelLine :{show : false}
                data:[usedData, freeData]
              ]
            return PieOption
          setCpuDatas:(cpuChart,cpu)->
            cpuChart.addData [
              [
                0 # 系列索引
                cpu.usage*100 # 新增数据
                true # 新增数据是否从队列头部插入
                false # 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
              ]
              [
                1 # 系列索引
                cpu.usrUsage*100 # 新增数据
                true # 新增数据是否从队列头部插入
                false # 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
              ]
              [
                2 # 系列索引
                cpu.sysUsage*100 # 新增数据
                true # 新增数据是否从队列头部插入
                false # 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
              ]
              [
                3 # 系列索引
                cpu.idle * 100 # 新增数据
                true # 新增数据是否从队列头部插入
                false # 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
              ]
              [
                4 # 系列索引
                cpu.ioWait*100 # 新增数据
                true # 新增数据是否从队列头部插入
                false # 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
              ]
            ]

    ])
