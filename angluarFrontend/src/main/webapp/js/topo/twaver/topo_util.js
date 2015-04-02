(function (angular, $) {


    <!-- 获取状态图片 开始 -->
    GetElementStatus = {
        nodeStatusImg: function (classify, currentStatus) {
            switch (classify) {
                case 'applyStauts' :
                case 'aix' :
                case 'app' :
                case 'apply' :
                case 'array' :
                case 'bus' :
                case 'business' :
                case 'clariion' :
                case 'database' :
                case 'eva' :
                case 'f5' :
                case 'host' :
                case 'hpux' :
                case 'http' :
                case 'iis' :
                case 'jifang' :
                case 'linux' :
                case 'lsi' :
                case 'monitor' :
                case 'mssql' :
                case 'mw' :
                case 'network' :
                case 'oracle' :
                case 'router' :
                case 'security' :
                case 'service' :
                case 'singfor' :
                case 'solaris' :
                case 'storage' :
                case 'switch2' :
                case 'switch3' :
                case 'sybase' :
                case 'symmetrix' :
                case 'topfw' :
                case 'topidp' :
                case 'topids' :
                case 'topsec' :
                case 'UPS' :
                case 'weblogic' :
                case 'windows' :
                case 'wsmq' :
                case '光电感应' :
                case '油机' :
                case '温湿度':
                case '漏水' :
                case '精密空调' :
                case '蓄电池' :
                    return  "./img/topo/" + classify + "_" + currentStatus + ".png";
                default:
                    return  "./img/topo/default.png";
            }
        },
        nodeStatusImgFullScreen: function (classify, currentStatus) {
            switch (classify) {
                case 'applyStauts' :
                case 'aix' :
                case 'app' :
                case 'apply' :
                case 'array' :
                case 'bus' :
                case 'business' :
                case 'clariion' :
                case 'database' :
                case 'eva' :
                case 'f5' :
                case 'host' :
                case 'hpux' :
                case 'http' :
                case 'iis' :
                case 'jifang' :
                case 'linux' :
                case 'lsi' :
                case 'monitor' :
                case 'mssql' :
                case 'mw' :
                case 'network' :
                case 'oracle' :
                case 'router' :
                case 'security' :
                case 'service' :
                case 'singfor' :
                case 'solaris' :
                case 'storage' :
                case 'switch2' :
                case 'switch3' :
                case 'sybase' :
                case 'symmetrix' :
                case 'topfw' :
                case 'topidp' :
                case 'topids' :
                case 'topsec' :
                case 'UPS' :
                case 'weblogic' :
                case 'windows' :
                case 'wsmq' :
                case '光电感应' :
                case '油机' :
                case '温湿度':
                case '漏水' :
                case '精密空调' :
                case '蓄电池' :
                    return  "./../../../img/topo/" + classify + "_" + currentStatus + ".png";
                default:
                    return  "./../../../img/topo/default.png";
            }
        },
        LinkStatusColor: function (currentStatus) {
            switch (currentStatus) {
                case 'red' :
                    return  '255,0,0';
                case 'orange' :
                    return  '255,128,0';
                case 'green' :
                    return  '0,255,0';
                case 'off' :
                    return  '192,192,192';
                case 'on' :
                    return  '0,255,0';
                case 'up' :
                    return  '0,255,0';
                case 'down' :
                    return  '0,255,0';
                case 'testing' :
                    return  '0,255,0';
                case 'unknown' :
                    return  '0,255,0';
                case 'dormant' :
                    return  '0,255,0';
                case 'notPresent' :
                    return  '0,255,0';
                case 'lowerLayerDown' :
                    return  '0,255,0';
                default:
                    return  '0,255,0';
            }
        }
    };
    <!-- 获取状态图片 结束 -->

    topoCommon = {
        currentLink: -1,
        currentLinkName: "",
        currentNode: -1,
        currentNodeName: "",
        currentNodeDisplayName: "",
        currentNodeType: "",
        currentNodeSize: "",
        currentNodeDrill: -1,
        currentView: "-1,-1",
        currentViewName: "-1,-1",
        currentViewPId: "-1,-1",
        currentViewSort: "-1,-1",
        locationChange: {},
        topoViewMenuData:[],
        elIndicatorsData:[],
        elAlarmData:[],
        elMetricColors:[],
        nodesStatus:[],
        linksStatus:[],
        historyRule30:[],
        historyRuleInterval:[],
        topoViewMenuIndicator: ["NIO","Interface"],
        topoViewMenuMetric: ["RTX","IfOctets"],
        topoMenuLayout: -80,
        UpPoints: 0//补点
    };
})(angular, jQuery);