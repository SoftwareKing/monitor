var dashboard_settings = {
    host:{
        windows:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["系统名称","系统版本","计算机名称","序列号","CPU总数", "启动时间", "运行时间","本机时间","进程数量"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["SystemName","SystemVersion","ComputerName","OSSN","TotalCPU", "StartTime", "UpTime","LocalTime","Processes"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            cpuPies:[
                {indicator:"CPU", metric:"Usage"}
            ],
            cpuBars:[
                {indicator:"CPU", metric:"UsrUsage"},
                {indicator:"CPU", metric:"SysUsage"},
                {indicator:"CPU", metric:"Idle"},
                {indicator:"CPU", metric:"WIO"}
            ],
            memPies:[
                {indicator:"MEM", metric:"UsedUsage",bottom:["Total","Used","Free"]},
                {indicator:"MEM", metric:"VirUsedUsage",bottom:["VirTotal","VirUsed","VirFree"]}
            ],
            trend:{indicator:"CPU", metric:"Usage",title:"前24小时CPU总使用率趋势"},
            tables:[
                {
                    indicator:"FS",
                    columnDefs:[
                        { "mDataProp": "Vol", "aTargets":[0]},
                        { "mDataProp": "Type", "aTargets":[1] },
                        { "mDataProp": "Size", "aTargets":[2] },
                        { "mDataProp": "Free", "aTargets":[3] },
                        { "mDataProp": "Used", "aTargets":[4] },
                        { "mDataProp": "Usage", "aTargets":[5] },
                        { "mDataProp": "MountPoint", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "卷名"},
                        { sTitle: "文件系统类型"},
                        { sTitle: "总大小"},
                        { sTitle: "可用大小"},
                        { sTitle: "使用大小"},
                        { sTitle: "使用率"},
                        { sTitle: "挂载点"}
                    ]
                },
                {
                    indicator:"DIO",
                    columnDefs:[
                        { "mDataProp": "Disk", "aTargets":[0]},
                        { "mDataProp": "RPS", "aTargets":[1] },
                        { "mDataProp": "WPS", "aTargets":[2] },
                        { "mDataProp": "TPS", "aTargets":[3] },
                        { "mDataProp": "RBPS", "aTargets":[4] },
                        { "mDataProp": "WBPS", "aTargets":[5] },
                        { "mDataProp": "TBPS", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "每秒读次数"},
                        { sTitle: "每秒写次数"},
                        { sTitle: "每秒传输次数"},
                        { sTitle: "每秒读字节"},
                        { sTitle: "每秒写字节数"},
                        { sTitle: "每秒传输字节数"}
                    ]
                },
                {
                    indicator:"NIO",
                    columnDefs:[
                        { "mDataProp": "Interface", "aTargets":[0]},
                        { "mDataProp": "BandWidth", "aTargets":[1] },
                        { "mDataProp": "BandUsage", "aTargets":[2] },
                        { "mDataProp": "IPAddr", "aTargets":[3] },
                        { "mDataProp": "QueLength", "aTargets":[4] },
                        { "mDataProp": "RX", "aTargets":[5] },
                        { "mDataProp": "TX", "aTargets":[6] },
                        { "mDataProp": "RTX", "aTargets":[7] },
                        { "mDataProp": "InPkts", "aTargets":[8] },
                        { "mDataProp": "InErrs", "aTargets":[9] },
                        { "mDataProp": "OutPkts", "aTargets":[10] },
                        { "mDataProp": "OutErrs", "aTargets":[11] },
                        { "mDataProp": "Coll", "aTargets":[12] }
                    ],
                    columns:[
                        { sTitle: "网络接口名称"},
                        { sTitle: "当前带宽"},
                        { sTitle: "带宽使用率"},
                        { sTitle: "IP地址"},
                        { sTitle: "发送队列大小"},
                        { sTitle: "每秒接收的字节数"},
                        { sTitle: "每秒发出的字节数"},
                        { sTitle: "每秒总的收发字节数"},
                        { sTitle: "每秒接收的包数"},
                        { sTitle: "每秒接收的错误包数"},
                        { sTitle: "每秒发出的包数"},
                        { sTitle: "每秒发出的错误包数"},
                        { sTitle: "每秒冲突包数"}
                    ]
                },
                {
                    indicator:"Process",
                    columnDefs:[
                        { "mDataProp": "Name", "aTargets":[0]},
                        { "mDataProp": "Handles", "aTargets":[1] },
                        { "mDataProp": "PID", "aTargets":[2] },
                        { "mDataProp": "PPID", "aTargets":[3] },
                        { "mDataProp": "Time", "aTargets":[4] },
                        { "mDataProp": "BeginTime", "aTargets":[5] },
                        { "mDataProp": "PhyMem", "aTargets":[6] },
                        { "mDataProp": "VirMem", "aTargets":[7] },
                        { "mDataProp": "Command", "aTargets":[8] },
                        { "mDataProp": "CpuUsage", "aTargets":[9] }
                    ],
                    columns:[
                        { sTitle: "进程名"},
                        { sTitle: "句柄数"},
                        { sTitle: "进程ID"},
                        { sTitle: "父进程ID"},
                        { sTitle: "持续运行时间"},
                        { sTitle: "进程开始时间"},
                        { sTitle: "物理内存使用大小"},
                        { sTitle: "虚拟内存使用大小"},
                        { sTitle: "完整的进程命令行"},
                        { sTitle: "CPU使用率"}
                    ]
                },
                {
                    indicator:"InterfaceStatus",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfStatus", "aTargets":[1]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "连接状态"}
                    ]
                }
            ]
        },
        linux:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["系统名称","系统版本","计算机名称","序列号","CPU总数", "启动时间", "运行时间","本机时间","进程数量"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["SystemName","SystemVersion","ComputerName","OSSN","TotalCPU", "StartTime", "UpTime","LocalTime","Processes"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            cpuPies:[
                {indicator:"CPU", metric:"Usage"}
            ],
            cpuBars:[
                {indicator:"CPU", metric:"UsrUsage"},
                {indicator:"CPU", metric:"SysUsage"},
                {indicator:"CPU", metric:"Idle"},
                {indicator:"CPU", metric:"WIO"}
            ],
            memPies:[
                {indicator:"MEM", metric:"UsedUsage",bottom:["Total","Used","Free"]},
                {indicator:"MEM", metric:"VirUsedUsage",bottom:["VirTotal","VirUsed","VirFree"]}
            ],
            trend:{indicator:"CPU", metric:"Usage",title:"前24小时CPU总使用率趋势"},
            tables:[
                {
                    indicator:"FS",
                    columnDefs:[
                        { "mDataProp": "Vol", "aTargets":[0]},
                        { "mDataProp": "Type", "aTargets":[1] },
                        { "mDataProp": "Size", "aTargets":[2] },
                        { "mDataProp": "Free", "aTargets":[3] },
                        { "mDataProp": "Used", "aTargets":[4] },
                        { "mDataProp": "Usage", "aTargets":[5] },
                        { "mDataProp": "MountPoint", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "卷名"},
                        { sTitle: "类型"},
                        { sTitle: "总大小"},
                        { sTitle: "可用大小"},
                        { sTitle: "使用大小"},
                        { sTitle: "使用率"},
                        { sTitle: "挂载点"}
                    ]
                },
                {
                    indicator:"DIO",
                    columnDefs:[
                        { "mDataProp": "Disk", "aTargets":[0]},
                        { "mDataProp": "RPS", "aTargets":[1] },
                        { "mDataProp": "WPS", "aTargets":[2] },
                        { "mDataProp": "TPS", "aTargets":[3] },
                        { "mDataProp": "RBPS", "aTargets":[4] },
                        { "mDataProp": "WBPS", "aTargets":[5] },
                        { "mDataProp": "TBPS", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "每秒读次数"},
                        { sTitle: "每秒写次数"},
                        { sTitle: "每秒传输次数"},
                        { sTitle: "每秒读字节"},
                        { sTitle: "每秒写字节数"},
                        { sTitle: "每秒传输字节数"}
                    ]
                },
                {
                    indicator:"NIO",
                    columnDefs:[
                        { "mDataProp": "Interface", "aTargets":[0]},
                        { "mDataProp": "BandWidth", "aTargets":[1] },
                        { "mDataProp": "BandUsage", "aTargets":[2] },
                        { "mDataProp": "IPAddr", "aTargets":[3] },
                        { "mDataProp": "QueLength", "aTargets":[4] },
                        { "mDataProp": "RX", "aTargets":[5] },
                        { "mDataProp": "TX", "aTargets":[6] },
                        { "mDataProp": "RTX", "aTargets":[7] },
                        { "mDataProp": "InPkts", "aTargets":[8] },
                        { "mDataProp": "InErrs", "aTargets":[9] },
                        { "mDataProp": "OutPkts", "aTargets":[10] },
                        { "mDataProp": "OutErrs", "aTargets":[11] },
                        { "mDataProp": "Coll", "aTargets":[12] }
                    ],
                    columns:[
                        { sTitle: "网络接口名称"},
                        { sTitle: "当前带宽"},
                        { sTitle: "带宽使用率"},
                        { sTitle: "IP地址"},
                        { sTitle: "发送队列大小"},
                        { sTitle: "每秒接收的字节数"},
                        { sTitle: "每秒发出的字节数"},
                        { sTitle: "每秒总的收发字节数"},
                        { sTitle: "每秒接收的包数"},
                        { sTitle: "每秒接收的错误包数"},
                        { sTitle: "每秒发出的包数"},
                        { sTitle: "每秒发出的错误包数"},
                        { sTitle: "每秒冲突包数"}
                    ]
                },
                {
                    indicator:"Process",
                    columnDefs:[
                        { "mDataProp": "Name", "aTargets":[0]},
                        { "mDataProp": "PID", "aTargets":[1] },
                        { "mDataProp": "PPID", "aTargets":[2] },
                        { "mDataProp": "Time", "aTargets":[3] },
                        { "mDataProp": "BeginTime", "aTargets":[4] },
                        { "mDataProp": "PhyMem", "aTargets":[5] },
                        { "mDataProp": "VirMem", "aTargets":[6] },
                        { "mDataProp": "Command", "aTargets":[7] },
                        { "mDataProp": "CpuUsage", "aTargets":[8] },
                        { "mDataProp": "State", "aTargets":[9] }
                    ],
                    columns:[
                        { sTitle: "进程名"},
                        { sTitle: "进程ID"},
                        { sTitle: "父进程ID"},
                        { sTitle: "持续运行时间"},
                        { sTitle: "进程开始时间"},
                        { sTitle: "物理内存使用大小"},
                        { sTitle: "虚拟内存使用大小"},
                        { sTitle: "完整的进程命令行"},
                        { sTitle: "CPU使用率"},
                        { sTitle: "状态"}
                    ]
                },
                {
                    indicator:"PV",
                    columnDefs:[
                        { "mDataProp": "PVName", "aTargets":[0]},
                        { "mDataProp": "TotalPE", "aTargets":[1] },
                        { "mDataProp": "FreePE", "aTargets":[2] },
                        { "mDataProp": "CurLV", "aTargets":[3] },
                        { "mDataProp": "PESize", "aTargets":[4] },
                        { "mDataProp": "Size", "aTargets":[5] },
                        { "mDataProp": "FreeSize", "aTargets":[6] },
                        { "mDataProp": "VGName", "aTargets":[7] },
                        { "mDataProp": "Allocatable", "aTargets":[8] }
                    ],
                    columns:[
                        { sTitle: "卷名"},
                        { sTitle: "总划分的物理分区个数"},
                        { sTitle: "空闲物理分区个数"},
                        { sTitle: "当前LV个数"},
                        { sTitle: "物理范围大小"},
                        { sTitle: "物理卷总大小"},
                        { sTitle: "可用空间"},
                        { sTitle: "所属卷组"},
                        { sTitle: "是否可分配"}
                    ]
                },
                {
                    indicator:"VG",
                    columnDefs:[
                        { "mDataProp": "VGName", "aTargets":[0]},
                        { "mDataProp": "Permission", "aTargets":[1] },
                        { "mDataProp": "Status", "aTargets":[2] },
                        { "mDataProp": "PESize", "aTargets":[3] },
                        { "mDataProp": "TotalPE", "aTargets":[4] },
                        { "mDataProp": "AllocPE", "aTargets":[5] },
                        { "mDataProp": "FreePE", "aTargets":[6] },
                        { "mDataProp": "Size", "aTargets":[7] },
                        { "mDataProp": "TotalPV", "aTargets":[8] },
                        { "mDataProp": "OpenLV", "aTargets":[9] },
                        { "mDataProp": "CurLV", "aTargets":[10] },
                        { "mDataProp": "ActPV", "aTargets":[11] },
                        { "mDataProp": "FreeSize", "aTargets":[12] },
                        { "mDataProp": "Usage", "aTargets":[13] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "访问权限"},
                        { sTitle: "状态"},
                        { sTitle: "物理分区大小"},
                        { sTitle: "总划分的物理分区"},
                        { sTitle: "已分配的物理分区"},
                        { sTitle: "空闲物理分区"},
                        { sTitle: "总容量"},
                        { sTitle: "包括PV个数"},
                        { sTitle: "打开LV数"},
                        { sTitle: "当前LV数量"},
                        { sTitle: "激活PV数量"},
                        { sTitle: "可用容量"},
                        { sTitle: "使用率"}
                    ]
                },
                {
                    indicator:"LV",
                    columnDefs:[
                        { "mDataProp": "LVName", "aTargets":[0]},
                        { "mDataProp": "AllocPE", "aTargets":[1] },
                        { "mDataProp": "Size", "aTargets":[2] },
                        { "mDataProp": "VGName", "aTargets":[3] },
                        { "mDataProp": "Status", "aTargets":[4] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "物理分区个数"},
                        { sTitle: "逻辑卷总大小"},
                        { sTitle: "卷组名称"},
                        { sTitle: "状态"}
                    ]
                },
                {
                    indicator:"InterfaceStatus",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfStatus", "aTargets":[1]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "连接状态"}
                    ]
                }
            ]
        },
        hpux:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["系统名称","系统版本","计算机名称","序列号","CPU总数", "启动时间", "运行时间","本机时间","进程数量"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["SystemName","SystemVersion","ComputerName","OSSN","TotalCPU", "StartTime", "UpTime","LocalTime","Processes"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            cpuPies:[
                {indicator:"CPU", metric:"Usage"}
            ],
            cpuBars:[
                {indicator:"CPU", metric:"UsrUsage"},
                {indicator:"CPU", metric:"SysUsage"},
                {indicator:"CPU", metric:"Idle"},
                {indicator:"CPU", metric:"WIO"}
            ],
            memPies:[
                {indicator:"MEM", metric:"UsedUsage",bottom:["Total","Used","Free"]},
                {indicator:"MEM", metric:"VirUsedUsage",bottom:["VirTotal","VirUsed","VirFree"]}
            ],
            trend:{indicator:"CPU", metric:"Usage",title:"前24小时CPU总使用率趋势"},
            tables:[
                {
                    indicator:"FS",
                    columnDefs:[
                        { "mDataProp": "Vol", "aTargets":[0]},
                        { "mDataProp": "Type", "aTargets":[1] },
                        { "mDataProp": "Size", "aTargets":[2] },
                        { "mDataProp": "Free", "aTargets":[3] },
                        { "mDataProp": "Used", "aTargets":[4] },
                        { "mDataProp": "Usage", "aTargets":[5] },
                        { "mDataProp": "MountPoint", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "卷名"},
                        { sTitle: "文件系统类型"},
                        { sTitle: "总大小"},
                        { sTitle: "可用大小"},
                        { sTitle: "使用大小"},
                        { sTitle: "使用率"},
                        { sTitle: "挂载点"}
                    ]
                },
                {
                    indicator:"DIO",
                    columnDefs:[
                        { "mDataProp": "Disk", "aTargets":[0]},
                        { "mDataProp": "TPS", "aTargets":[1] },
                        { "mDataProp": "TBPS", "aTargets":[2] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "每秒传输次数"},
                        { sTitle: "每秒传输字节数"}
                    ]
                },
                {
                    indicator:"NIO",
                    columnDefs:[
                        { "mDataProp": "Interface", "aTargets":[0]},
                        { "mDataProp": "BandWidth", "aTargets":[1] },
                        { "mDataProp": "BandUsage", "aTargets":[2] },
                        { "mDataProp": "IPAddr", "aTargets":[3] },
                        { "mDataProp": "QueLength", "aTargets":[4] },
                        { "mDataProp": "RX", "aTargets":[5] },
                        { "mDataProp": "TX", "aTargets":[6] },
                        { "mDataProp": "RTX", "aTargets":[7] },
                        { "mDataProp": "InPkts", "aTargets":[8] },
                        { "mDataProp": "InErrs", "aTargets":[9] },
                        { "mDataProp": "OutPkts", "aTargets":[10] },
                        { "mDataProp": "OutErrs", "aTargets":[11] },
                        { "mDataProp": "Coll", "aTargets":[12] }
                    ],
                    columns:[
                        { sTitle: "网络接口名称"},
                        { sTitle: "当前带宽"},
                        { sTitle: "带宽使用率"},
                        { sTitle: "IP地址"},
                        { sTitle: "发送队列大小"},
                        { sTitle: "每秒接收的字节数"},
                        { sTitle: "每秒发出的字节数"},
                        { sTitle: "每秒总的收发字节数"},
                        { sTitle: "每秒接收的包数"},
                        { sTitle: "每秒接收的错误包数"},
                        { sTitle: "每秒发出的包数"},
                        { sTitle: "每秒发出的错误包数"},
                        { sTitle: "每秒冲突包数"}
                    ]
                },
                {
                    indicator:"Process",
                    columnDefs:[
                        { "mDataProp": "Name", "aTargets":[0]},
                        { "mDataProp": "PID", "aTargets":[1] },
                        { "mDataProp": "PPID", "aTargets":[2] },
                        { "mDataProp": "Time", "aTargets":[3] },
                        { "mDataProp": "BeginTime", "aTargets":[4] },
                        { "mDataProp": "PhyMem", "aTargets":[5] },
                        { "mDataProp": "VirMem", "aTargets":[6] },
                        { "mDataProp": "Command", "aTargets":[7] },
                        { "mDataProp": "CpuUsage", "aTargets":[8] },
                        { "mDataProp": "State", "aTargets":[9] }
                    ],
                    columns:[
                        { sTitle: "进程名"},
                        { sTitle: "进程ID"},
                        { sTitle: "父进程ID"},
                        { sTitle: "持续运行时间"},
                        { sTitle: "进程开始时间"},
                        { sTitle: "物理内存使用大小"},
                        { sTitle: "虚拟内存使用大小"},
                        { sTitle: "完整的进程命令行"},
                        { sTitle: "CPU使用率"},
                        { sTitle: "状态"}
                    ]
                },
                {
                    indicator:"PV",
                    columnDefs:[
                        { "mDataProp": "PVName", "aTargets":[0]},
                        { "mDataProp": "TotalPE", "aTargets":[1] },
                        { "mDataProp": "FreePE", "aTargets":[2] },
                        { "mDataProp": "CurLV", "aTargets":[3] },
                        { "mDataProp": "PESize", "aTargets":[4] },
                        { "mDataProp": "Size", "aTargets":[5] },
                        { "mDataProp": "FreeSize", "aTargets":[6] },
                        { "mDataProp": "VGName", "aTargets":[7] },
                        { "mDataProp": "Allocatable", "aTargets":[8] }
                    ],
                    columns:[
                        { sTitle: "卷名"},
                        { sTitle: "总划分的物理分区个数"},
                        { sTitle: "空闲物理分区个数"},
                        { sTitle: "当前LV个数"},
                        { sTitle: "物理范围大小"},
                        { sTitle: "物理卷总大小"},
                        { sTitle: "可用空间"},
                        { sTitle: "所属卷组"},
                        { sTitle: "是否可分配"}
                    ]
                },
                {
                    indicator:"VG",
                    columnDefs:[
                        { "mDataProp": "VGName", "aTargets":[0]},
                        { "mDataProp": "Permission", "aTargets":[1] },
                        { "mDataProp": "Status", "aTargets":[2] },
                        { "mDataProp": "PESize", "aTargets":[3] },
                        { "mDataProp": "TotalPE", "aTargets":[4] },
                        { "mDataProp": "AllocPE", "aTargets":[5] },
                        { "mDataProp": "FreePE", "aTargets":[6] },
                        { "mDataProp": "Size", "aTargets":[7] },
                        { "mDataProp": "TotalPV", "aTargets":[8] },
                        { "mDataProp": "OpenLV", "aTargets":[9] },
                        { "mDataProp": "CurLV", "aTargets":[10] },
                        { "mDataProp": "ActPV", "aTargets":[11] },
                        { "mDataProp": "FreeSize", "aTargets":[12] },
                        { "mDataProp": "Usage", "aTargets":[13] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "访问权限"},
                        { sTitle: "状态"},
                        { sTitle: "物理分区大小"},
                        { sTitle: "总划分的物理分区"},
                        { sTitle: "已分配的物理分区"},
                        { sTitle: "空闲物理分区"},
                        { sTitle: "总容量"},
                        { sTitle: "包括PV个数"},
                        { sTitle: "打开LV数"},
                        { sTitle: "当前LV数量"},
                        { sTitle: "激活PV数量"},
                        { sTitle: "可用容量"},
                        { sTitle: "使用率"}
                    ]
                },
                {
                    indicator:"LV",
                    columnDefs:[
                        { "mDataProp": "LVName", "aTargets":[0]},
                        { "mDataProp": "AllocPE", "aTargets":[1] },
                        { "mDataProp": "Size", "aTargets":[2] },
                        { "mDataProp": "VGName", "aTargets":[3] },
                        { "mDataProp": "Status", "aTargets":[4] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "物理分区个数"},
                        { sTitle: "逻辑卷总大小"},
                        { sTitle: "卷组名称"},
                        { sTitle: "状态"}
                    ]
                },
                {
                    indicator:"InterfaceStatus",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfStatus", "aTargets":[1]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "连接状态"}
                    ]
                }
            ]
        },
        aix:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["系统名称","系统版本","计算机名称","序列号","CPU总数", "启动时间", "运行时间","本机时间","进程数量"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["SystemName","SystemVersion","ComputerName","OSSN","TotalCPU", "StartTime", "UpTime","LocalTime","Processes"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            cpuPies:[
                {indicator:"CPU", metric:"Usage"}
            ],
            cpuBars:[
                {indicator:"CPU", metric:"UsrUsage"},
                {indicator:"CPU", metric:"SysUsage"},
                {indicator:"CPU", metric:"Idle"},
                {indicator:"CPU", metric:"WIO"}
            ],
            memPies:[
                {indicator:"MEM", metric:"UsedUsage",bottom:["Total","Used","Free"]},
                {indicator:"MEM", metric:"VirUsedUsage",bottom:["VirTotal","VirUsed","VirFree"]}
            ],
            trend:{indicator:"CPU", metric:"Usage",title:"前24小时CPU总使用率趋势"},
            tables:[
                {
                    indicator:"FS",
                    columnDefs:[
                        { "mDataProp": "Vol", "aTargets":[0]},
                        { "mDataProp": "Type", "aTargets":[1] },
                        { "mDataProp": "Size", "aTargets":[2] },
                        { "mDataProp": "Free", "aTargets":[3] },
                        { "mDataProp": "Used", "aTargets":[4] },
                        { "mDataProp": "Usage", "aTargets":[5] },
                        { "mDataProp": "MountPoint", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "卷名"},
                        { sTitle: "文件系统类型"},
                        { sTitle: "总大小"},
                        { sTitle: "可用大小"},
                        { sTitle: "使用大小"},
                        { sTitle: "使用率"},
                        { sTitle: "挂载点"}
                    ]
                },
                {
                    indicator:"DIO",
                    columnDefs:[
                        { "mDataProp": "Disk", "aTargets":[0]},
                        { "mDataProp": "RPS", "aTargets":[1] },
                        { "mDataProp": "WPS", "aTargets":[2] },
                        { "mDataProp": "TPS", "aTargets":[3] },
                        { "mDataProp": "RBPS", "aTargets":[4] },
                        { "mDataProp": "WBPS", "aTargets":[5] },
                        { "mDataProp": "TBPS", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "每秒读次数"},
                        { sTitle: "每秒写次数"},
                        { sTitle: "每秒传输次数"},
                        { sTitle: "每秒读字节"},
                        { sTitle: "每秒写字节数"},
                        { sTitle: "每秒传输字节数"}
                    ]
                },
                {
                    indicator:"NIO",
                    columnDefs:[
                        { "mDataProp": "Interface", "aTargets":[0]},
                        { "mDataProp": "BandWidth", "aTargets":[1] },
                        { "mDataProp": "BandUsage", "aTargets":[2] },
                        { "mDataProp": "IPAddr", "aTargets":[3] },
                        { "mDataProp": "QueLength", "aTargets":[4] },
                        { "mDataProp": "RX", "aTargets":[5] },
                        { "mDataProp": "TX", "aTargets":[6] },
                        { "mDataProp": "RTX", "aTargets":[7] },
                        { "mDataProp": "InPkts", "aTargets":[8] },
                        { "mDataProp": "InErrs", "aTargets":[9] },
                        { "mDataProp": "OutPkts", "aTargets":[10] },
                        { "mDataProp": "OutErrs", "aTargets":[11] },
                        { "mDataProp": "Coll", "aTargets":[12] }
                    ],
                    columns:[
                        { sTitle: "网络接口名称"},
                        { sTitle: "当前带宽"},
                        { sTitle: "带宽使用率"},
                        { sTitle: "IP地址"},
                        { sTitle: "发送队列大小"},
                        { sTitle: "每秒接收的字节数"},
                        { sTitle: "每秒发出的字节数"},
                        { sTitle: "每秒总的收发字节数"},
                        { sTitle: "每秒接收的包数"},
                        { sTitle: "每秒接收的错误包数"},
                        { sTitle: "每秒发出的包数"},
                        { sTitle: "每秒发出的错误包数"},
                        { sTitle: "每秒冲突包数"}
                    ]
                },
                {
                    indicator:"Process",
                    columnDefs:[
                        { "mDataProp": "Name", "aTargets":[0]},
                        { "mDataProp": "PID", "aTargets":[1] },
                        { "mDataProp": "PPID", "aTargets":[2] },
                        { "mDataProp": "Time", "aTargets":[3] },
                        { "mDataProp": "BeginTime", "aTargets":[4] },
                        { "mDataProp": "PhyMem", "aTargets":[5] },
                        { "mDataProp": "VirMem", "aTargets":[6] },
                        { "mDataProp": "Command", "aTargets":[7] },
                        { "mDataProp": "CpuUsage", "aTargets":[8] },
                        { "mDataProp": "State", "aTargets":[9] }
                    ],
                    columns:[
                        { sTitle: "进程名"},
                        { sTitle: "进程ID"},
                        { sTitle: "父进程ID"},
                        { sTitle: "持续运行时间"},
                        { sTitle: "进程开始时间"},
                        { sTitle: "物理内存使用大小"},
                        { sTitle: "虚拟内存使用大小"},
                        { sTitle: "完整的进程命令行"},
                        { sTitle: "CPU使用率"},
                        { sTitle: "状态"}
                    ]
                },
                {
                    indicator:"PV",
                    columnDefs:[
                        { "mDataProp": "PVName", "aTargets":[0]},
                        { "mDataProp": "TotalPE", "aTargets":[1] },
                        { "mDataProp": "FreePE", "aTargets":[2] },
                        { "mDataProp": "CurLV", "aTargets":[3] },
                        { "mDataProp": "PESize", "aTargets":[4] },
                        { "mDataProp": "Size", "aTargets":[5] },
                        { "mDataProp": "FreeSize", "aTargets":[6] },
                        { "mDataProp": "VGName", "aTargets":[7] },
                        { "mDataProp": "Status", "aTargets":[8] }
                    ],
                    columns:[
                        { sTitle: "卷名"},
                        { sTitle: "总划分的物理分区个数"},
                        { sTitle: "空闲物理分区个数"},
                        { sTitle: "当前LV个数"},
                        { sTitle: "物理范围大小"},
                        { sTitle: "物理卷总大小"},
                        { sTitle: "可用空间"},
                        { sTitle: "所属卷组"},
                        { sTitle: "状态"}
                    ]
                },
                {
                    indicator:"VG",
                    columnDefs:[
                        { "mDataProp": "VGName", "aTargets":[0]},
                        { "mDataProp": "Permission", "aTargets":[1] },
                        { "mDataProp": "Status", "aTargets":[2] },
                        { "mDataProp": "PESize", "aTargets":[3] },
                        { "mDataProp": "TotalPE", "aTargets":[4] },
                        { "mDataProp": "AllocPE", "aTargets":[5] },
                        { "mDataProp": "FreePE", "aTargets":[6] },
                        { "mDataProp": "Size", "aTargets":[7] },
                        { "mDataProp": "TotalPV", "aTargets":[8] },
                        { "mDataProp": "OpenLV", "aTargets":[9] },
                        { "mDataProp": "CurLV", "aTargets":[10] },
                        { "mDataProp": "ActPV", "aTargets":[11] },
                        { "mDataProp": "FreeSize", "aTargets":[12] },
                        { "mDataProp": "Usage", "aTargets":[13] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "访问权限"},
                        { sTitle: "状态"},
                        { sTitle: "物理分区大小"},
                        { sTitle: "总划分的物理分区"},
                        { sTitle: "已分配的物理分区"},
                        { sTitle: "空闲物理分区"},
                        { sTitle: "总容量"},
                        { sTitle: "包括PV个数"},
                        { sTitle: "打开LV数"},
                        { sTitle: "当前LV数量"},
                        { sTitle: "激活PV数量"},
                        { sTitle: "可用容量"},
                        { sTitle: "使用率"}
                    ]
                },
                {
                    indicator:"LV",
                    columnDefs:[
                        { "mDataProp": "LVName", "aTargets":[0]},
                        { "mDataProp": "AllocPE", "aTargets":[1] },
                        { "mDataProp": "Size", "aTargets":[2] },
                        { "mDataProp": "VGName", "aTargets":[3] },
                        { "mDataProp": "Status", "aTargets":[4] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "物理分区个数"},
                        { sTitle: "逻辑卷总大小"},
                        { sTitle: "卷组名称"},
                        { sTitle: "状态"}
                    ]
                },
                {
                    indicator:"InterfaceStatus",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfStatus", "aTargets":[1]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "连接状态"}
                    ]
                }
            ]
        },
        solaris:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["系统名称","系统版本","计算机名称","序列号","CPU总数", "启动时间", "运行时间","本机时间","进程数量"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["SystemName","SystemVersion","ComputerName","OSSN","TotalCPU", "StartTime", "UpTime","LocalTime","Processes"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            cpuPies:[
                {indicator:"CPU", metric:"Usage"}
            ],
            cpuBars:[
                {indicator:"CPU", metric:"UsrUsage"},
                {indicator:"CPU", metric:"SysUsage"},
                {indicator:"CPU", metric:"Idle"},
                {indicator:"CPU", metric:"WIO"}
            ],
            memPies:[
                {indicator:"MEM", metric:"UsedUsage",bottom:["Total","Used","Free"]},
                {indicator:"MEM", metric:"VirUsedUsage",bottom:["VirTotal","VirUsed","VirFree"]}
            ],
            trend:{indicator:"CPU", metric:"Usage",title:"前24小时CPU总使用率趋势"},
            tables:[
                {
                    indicator:"FS",
                    columnDefs:[
                        { "mDataProp": "Vol", "aTargets":[0]},
                        { "mDataProp": "Type", "aTargets":[1] },
                        { "mDataProp": "Size", "aTargets":[2] },
                        { "mDataProp": "Free", "aTargets":[3] },
                        { "mDataProp": "Used", "aTargets":[4] },
                        { "mDataProp": "Usage", "aTargets":[5] },
                        { "mDataProp": "MountPoint", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "卷名"},
                        { sTitle: "文件系统类型"},
                        { sTitle: "总大小"},
                        { sTitle: "可用大小"},
                        { sTitle: "使用大小"},
                        { sTitle: "使用率"},
                        { sTitle: "挂载点"}
                    ]
                },
                {
                    indicator:"DIO",
                    columnDefs:[
                        { "mDataProp": "Disk", "aTargets":[0]},
                        { "mDataProp": "RPS", "aTargets":[1] },
                        { "mDataProp": "WPS", "aTargets":[2] },
                        { "mDataProp": "TPS", "aTargets":[3] },
                        { "mDataProp": "RBPS", "aTargets":[4] },
                        { "mDataProp": "WBPS", "aTargets":[5] },
                        { "mDataProp": "TBPS", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "每秒读次数"},
                        { sTitle: "每秒写次数"},
                        { sTitle: "每秒传输次数"},
                        { sTitle: "每秒读字节"},
                        { sTitle: "每秒写字节数"},
                        { sTitle: "每秒传输字节数"}
                    ]
                },
                {
                    indicator:"NIO",
                    columnDefs:[
                        { "mDataProp": "Interface", "aTargets":[0]},
                        { "mDataProp": "BandWidth", "aTargets":[1] },
                        { "mDataProp": "BandUsage", "aTargets":[2] },
                        { "mDataProp": "IPAddr", "aTargets":[3] },
                        { "mDataProp": "QueLength", "aTargets":[4] },
                        { "mDataProp": "RX", "aTargets":[5] },
                        { "mDataProp": "TX", "aTargets":[6] },
                        { "mDataProp": "RTX", "aTargets":[7] },
                        { "mDataProp": "InPkts", "aTargets":[8] },
                        { "mDataProp": "InErrs", "aTargets":[9] },
                        { "mDataProp": "OutPkts", "aTargets":[10] },
                        { "mDataProp": "OutErrs", "aTargets":[11] },
                        { "mDataProp": "Coll", "aTargets":[12] }
                    ],
                    columns:[
                        { sTitle: "网络接口名称"},
                        { sTitle: "当前带宽"},
                        { sTitle: "带宽使用率"},
                        { sTitle: "IP地址"},
                        { sTitle: "发送队列大小"},
                        { sTitle: "每秒接收的字节数"},
                        { sTitle: "每秒发出的字节数"},
                        { sTitle: "每秒总的收发字节数"},
                        { sTitle: "每秒接收的包数"},
                        { sTitle: "每秒接收的错误包数"},
                        { sTitle: "每秒发出的包数"},
                        { sTitle: "每秒发出的错误包数"},
                        { sTitle: "每秒冲突包数"}
                    ]
                },
                {
                    indicator:"Process",
                    columnDefs:[
                        { "mDataProp": "Name", "aTargets":[0]},
                        { "mDataProp": "Handles", "aTargets":[1] },
                        { "mDataProp": "PID", "aTargets":[2] },
                        { "mDataProp": "PPID", "aTargets":[3] },
                        { "mDataProp": "Time", "aTargets":[4] },
                        { "mDataProp": "BeginTime", "aTargets":[5] },
                        { "mDataProp": "PhyMem", "aTargets":[6] },
                        { "mDataProp": "VirMem", "aTargets":[7] },
                        { "mDataProp": "Command", "aTargets":[8] },
                        { "mDataProp": "CpuUsage", "aTargets":[9] },
                        { "mDataProp": "State", "aTargets":[10] }
                    ],
                    columns:[
                        { sTitle: "进程名"},
                        { sTitle: "句柄数"},
                        { sTitle: "进程ID"},
                        { sTitle: "父进程ID"},
                        { sTitle: "持续运行时间"},
                        { sTitle: "进程开始时间"},
                        { sTitle: "物理内存使用大小"},
                        { sTitle: "虚拟内存使用大小"},
                        { sTitle: "完整的进程命令行"},
                        { sTitle: "CPU使用率"},
                        { sTitle: "状态"}
                    ]
                },
                {
                    indicator:"PV",
                    columnDefs:[
                        { "mDataProp": "PVName", "aTargets":[0]},
                        { "mDataProp": "TotalPE", "aTargets":[1] },
                        { "mDataProp": "FreePE", "aTargets":[2] },
                        { "mDataProp": "CurLV", "aTargets":[3] },
                        { "mDataProp": "PESize", "aTargets":[4] },
                        { "mDataProp": "Size", "aTargets":[5] },
                        { "mDataProp": "FreeSize", "aTargets":[6] },
                        { "mDataProp": "VGName", "aTargets":[7] },
                        { "mDataProp": "Allocatable", "aTargets":[8] }
                    ],
                    columns:[
                        { sTitle: "卷名"},
                        { sTitle: "总划分的物理分区个数"},
                        { sTitle: "空闲物理分区个数"},
                        { sTitle: "当前LV个数"},
                        { sTitle: "物理范围大小"},
                        { sTitle: "物理卷总大小"},
                        { sTitle: "可用空间"},
                        { sTitle: "所属卷组"},
                        { sTitle: "是否可分配"}
                    ]
                },
                {
                    indicator:"VG",
                    columnDefs:[
                        { "mDataProp": "VGName", "aTargets":[0]},
                        { "mDataProp": "Permission", "aTargets":[1] },
                        { "mDataProp": "Status", "aTargets":[2] },
                        { "mDataProp": "PESize", "aTargets":[3] },
                        { "mDataProp": "TotalPE", "aTargets":[4] },
                        { "mDataProp": "AllocPE", "aTargets":[5] },
                        { "mDataProp": "FreePE", "aTargets":[6] },
                        { "mDataProp": "Size", "aTargets":[7] },
                        { "mDataProp": "TotalPV", "aTargets":[8] },
                        { "mDataProp": "OpenLV", "aTargets":[9] },
                        { "mDataProp": "CurLV", "aTargets":[10] },
                        { "mDataProp": "ActPV", "aTargets":[11] },
                        { "mDataProp": "FreeSize", "aTargets":[12] },
                        { "mDataProp": "Usage", "aTargets":[13] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "访问权限"},
                        { sTitle: "状态"},
                        { sTitle: "物理分区大小"},
                        { sTitle: "总划分的物理分区"},
                        { sTitle: "已分配的物理分区"},
                        { sTitle: "空闲物理分区"},
                        { sTitle: "总容量"},
                        { sTitle: "包括PV个数"},
                        { sTitle: "打开LV数"},
                        { sTitle: "当前LV数量"},
                        { sTitle: "激活PV数量"},
                        { sTitle: "可用容量"},
                        { sTitle: "使用率"}
                    ]
                },
                {
                    indicator:"LV",
                    columnDefs:[
                        { "mDataProp": "LVName", "aTargets":[0]},
                        { "mDataProp": "AllocPE", "aTargets":[1] },
                        { "mDataProp": "Size", "aTargets":[2] },
                        { "mDataProp": "VGName", "aTargets":[3] },
                        { "mDataProp": "Status", "aTargets":[4] }
                    ],
                    columns:[
                        { sTitle: "名称"},
                        { sTitle: "物理分区个数"},
                        { sTitle: "逻辑卷总大小"},
                        { sTitle: "卷组名称"},
                        { sTitle: "状态"}
                    ]
                },
                {
                    indicator:"InterfaceStatus",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfStatus", "aTargets":[1]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "连接状态"}
                    ]
                }
            ]
        }
    },
    database:{
        oracle:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    [ "数据库名","版本信息","实例名","主机名","实例开始时间", "Java池的大小","大内存池的大小","分配的SGA大小","重做日志缓冲区的大小","共享池的大小","SQL缓存大小","已使用共享池的大小"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["DBName","Version", 'InstanceName',"HostName","UpTime","SGA.BufferCache","SGA.LargePoolSize","SGA.Allocated","SGA.RedoBufferSize","SGA.SharedPoolSize","SGA.SQLCacheSize","SGA.UsedSharedPoolSize"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            extendSysinfo:{
                indicators:["SGA"]
            },
            lockPies:[
                {indicator:"SysPerf", metric:"SessionCnt"},
                {indicator:"SysPerf", metric:"DeadLock"},
                {indicator:"SysPerf", metric:"SQLParseHit"}
            ],
            cpuPies:[
                {indicator:"CPU", metric:"Total"}
            ],
            memPies:[
                {indicator:"MEM", metric:"Total"}
            ],
            trend:{indicator:"SysPerf", metric:"SessionCnt",title:"前24小时会话数趋势"},
            tables:[
                {
                    indicator:"Lock",
                    columnDefs:[
                        { "mDataProp": "SID", "aTargets":[0]},
                        { "mDataProp": "UserName", "aTargets":[1] },
                        { "mDataProp": "HeldLockType", "aTargets":[2] },
                        { "mDataProp": "RequestedLockType", "aTargets":[3] },
                        { "mDataProp": "Owner", "aTargets":[4] },
                        { "mDataProp": "LockType", "aTargets":[5] },
                        { "mDataProp": "ID1", "aTargets":[6] },
                        { "mDataProp": "ID2", "aTargets":[7] }
                    ],
                    columns:[
                        { sTitle: "会话ID"},
                        { sTitle: "oracle用户名"},
                        { sTitle: "保持锁的模式"},
                        { sTitle: "申请锁的模式"},
                        { sTitle: "锁的对象所有者"},
                        { sTitle: "锁的类型"},
                        { sTitle: "锁的1号标识符"},
                        { sTitle: "锁的2号标识符"}
                    ]
                },
                {
                    indicator:"DeadLock",
                    columnDefs:[
                        { "mDataProp": "SID", "aTargets":[0]},
                        { "mDataProp": "UserName", "aTargets":[1] },
                        { "mDataProp": "SerialNum", "aTargets":[2] },
                        { "mDataProp": "LogonTime", "aTargets":[3] },
                        { "mDataProp": "Sql", "aTargets":[4] }
                    ],
                    columns:[
                        { sTitle: "会话ID"},
                        { sTitle: "oracle用户名"},
                        { sTitle: "会话序列号"},
                        { sTitle: "登录时间"},
                        { sTitle: "SQL语句"}
                    ]
                },
                {
                    indicator:"LogFiles",
                    columnDefs:[
                        { "mDataProp": "FileGroup", "aTargets":[0]},
                        { "mDataProp": "FileName", "aTargets":[1] },
                        { "mDataProp": "Status", "aTargets":[2] },
                        { "mDataProp": "Archived", "aTargets":[3] },
                        { "mDataProp": "Bytes", "aTargets":[4] },
                        { "mDataProp": "FirstTime", "aTargets":[5] }
                    ],
                    columns:[
                        { sTitle: "日志组"},
                        { sTitle: "日志文件名称"},
                        { sTitle: "状态"},
                        { sTitle: "自动归档"},
                        { sTitle: "文件大小"},
                        { sTitle: "启用日期"}
                    ]
                },
                {
                    indicator:"Tablespace",
                    columnDefs:[
                        { "mDataProp": "DBID", "aTargets":[0] },
                        { "mDataProp": "DBName", "aTargets":[1]},
                        { "mDataProp": "DBFile", "aTargets":[2] },
                        { "mDataProp": "DBSize", "aTargets":[3] },
                        { "mDataProp": "Status", "aTargets":[4] }
                    ],
                    columns:[
                        { sTitle: "数据文件ID"},
                        { sTitle: "表空间名称"},
                        { sTitle: "数据文件名"},
                        { sTitle: "数据文件大小"},
                        { sTitle: "文件状态"}
                    ]
                },
                {
                    indicator:"SQLPerformance",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Text", "aTargets":[1] },
                        { "mDataProp": "SID", "aTargets":[2] },
                        { "mDataProp": "UserName", "aTargets":[3] },
                        { "mDataProp": "LogicalReads", "aTargets":[4] },
                        { "mDataProp": "PhysicalReads", "aTargets":[5] },
                        { "mDataProp": "Executions", "aTargets":[6] },
                        { "mDataProp": "ElapsedTime", "aTargets":[7] },
                        { "mDataProp": "CPUTime", "aTargets":[8] },
                        { "mDataProp": "IO", "aTargets":[9] }
                    ],
                    columns:[
                        { sTitle: "SQL ID"},
                        { sTitle: "SQL文本"},
                        { sTitle: "会话ID"},
                        { sTitle: "用户名"},
                        { sTitle: "缓存读取次数"},
                        { sTitle: "物理读取次数"},
                        { sTitle: "执行次数"},
                        { sTitle: "消耗时间"},
                        { sTitle: "CPU占用"},
                        { sTitle: "IO占用"}
                    ]
                }
            ]
        },
        mssql:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    [ "数据库名","版本信息","实例名","主机名","实例开始时间", "每秒批请求数","每秒交易数","每秒全表扫描数","每秒SQL编译数","每秒SQL重编译数","CPU利用率"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["DBName","Version", 'InstanceName',"HostName","UpTime","SysPerf.BatchRequest","SysPerf.Trans","SysPerf.FullScan","SysPerf.SqlComp","SysPerf.SqlRecom","CPU.Total"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            extendSysinfo:{
                indicators:["SysPerf"]
            },
            lockPies:[
                {indicator:"SysPerf", metric:"SessionCnt"},
                {indicator:"SysPerf", metric:"Deadlocks"}
            ],
            cpuBars:[
                {indicator:"SysPerf",metric:"BuffCacheHit"},
                {indicator:"SysPerf",metric:"PlanCacheHit"},
                {indicator:"SysPerf",metric:"LogCacheHit"},
                {indicator:"LogFileOverview",metric:"LogFilesSizePercentage",bottom:["LogFilesCount","LogFilesSize"]}
            ],
            trend:{indicator:"SysPerf", metric:"SessionCnt",title:"前24小时会话数趋势"},
            tables:[
                {
                    indicator:"DBFiles",
                    columnDefs:[
                        { "mDataProp": "DBName", "aTargets":[0]},
                        { "mDataProp": "FileName", "aTargets":[1] },
                        { "mDataProp": "Size", "aTargets":[2] },
                        { "mDataProp": "MaxSize", "aTargets":[3] },
                        { "mDataProp": "Growth", "aTargets":[4] },
                        { "mDataProp": "Unit", "aTargets":[5] }
                    ],
                    columns:[
                        { sTitle: "数据文件逻辑名称"},
                        { sTitle: "数据文件物理名称"},
                        { sTitle: "文件大小"},
                        { sTitle: "最大文件大小"},
                        { sTitle: "数据库的增长大小"},
                        { sTitle: "增长大小单位"}
                    ]
                },
                {
                    indicator:"Lock",
                    columnDefs:[
                        { "mDataProp": "SID", "aTargets":[0]},
                        { "mDataProp": "Text", "aTargets":[1] },
                        { "mDataProp": "DBName", "aTargets":[2] },
                        { "mDataProp": "ResourceType", "aTargets":[3] },
                        { "mDataProp": "RequestMode", "aTargets":[4] },
                        { "mDataProp": "RequestLockStatus", "aTargets":[5] },
                        { "mDataProp": "ReqestLockRefcnt", "aTargets":[6] },
                        { "mDataProp": "OwnerType", "aTargets":[7] }
                    ],
                    columns:[
                        { sTitle: "会话内部进程ID"},
                        { sTitle: "文本描述"},
                        { sTitle: "关联数据库名"},
                        { sTitle: "资源类型"},
                        { sTitle: "锁请求模式"},
                        { sTitle: "锁请求的状态"},
                        { sTitle: "锁引用计数"},
                        { sTitle: "与锁关联的对象类型"}
                    ]
                },
                {
                    indicator:"SQLPerformance",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Text", "aTargets":[1] },
                        { "mDataProp": "SID", "aTargets":[2] },
                        { "mDataProp": "UserName", "aTargets":[3] },
                        { "mDataProp": "LogicalReads", "aTargets":[4] },
                        { "mDataProp": "PhysicalReads", "aTargets":[5] },
                        { "mDataProp": "Executions", "aTargets":[6] },
                        { "mDataProp": "ElapsedTime", "aTargets":[7] },
                        { "mDataProp": "CPUTime", "aTargets":[8] }
                    ],
                    columns:[
                        { sTitle: "SQL ID"},
                        { sTitle: "SQL文本"},
                        { sTitle: "会话ID"},
                        { sTitle: "用户名"},
                        { sTitle: "缓存读取次数"},
                        { sTitle: "物理读取次数"},
                        { sTitle: "执行次数"},
                        { sTitle: "消耗时间"},
                        { sTitle: "CPU占用"}
                    ]
                }
            ]
        },
        sybase:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    [ "数据库名","版本信息","实例名","主机名","实例开始时间","引擎数","CPU利用率","活动引擎数"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["DBName","Version", 'InstanceName',"HostName","UpTime","SysPerf.EngCnt","CPU.Total","SysPerf.ActEngCnt"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            extendSysinfo:{
                indicators:["SysPerf","CPU"]
            },
            lockPies:[
                {indicator:"SysPerf", metric:"SessionCnt"},
                {indicator:"SysPerf", metric:"DeadLock"},
                {indicator:"SysPerf", metric:"TransCnt"}
            ],
            trend:{indicator:"SysPerf", metric:"SessionCnt",title:"前24小时会话数趋势"},
            tables:[
                {
                    indicator:"Device",
                    columnDefs:[
                        { "mDataProp": "DevName", "aTargets":[0]},
                        { "mDataProp": "DevType", "aTargets":[1] },
                        { "mDataProp": "PhyName", "aTargets":[2] },
                        { "mDataProp": "TotalSize", "aTargets":[3] },
                        { "mDataProp": "FreeSize", "aTargets":[4] }
                    ],
                    columns:[
                        { sTitle: "设备名称"},
                        { sTitle: "设备类型"},
                        { sTitle: "物理名称 "},
                        { sTitle: "总空间大小"},
                        { sTitle: "空闲空间大小"}
                    ]
                },
                {
                    indicator:"Segment",
                    columnDefs:[
                        { "mDataProp": "Name", "aTargets":[0]},
                        { "mDataProp": "DeviceName", "aTargets":[1] },
                        { "mDataProp": "TotalSize", "aTargets":[2] },
                        { "mDataProp": "TotalPages", "aTargets":[3] },
                        { "mDataProp": "FreePages", "aTargets":[4] },
                        { "mDataProp": "FreeRate", "aTargets":[5] }
                    ],
                    columns:[
                        { sTitle: "段名"},
                        { sTitle: "设备名称"},
                        { sTitle: "总空间大小"},
                        { sTitle: "总页数"},
                        { sTitle: "空闲页数"},
                        { sTitle: "空闲百分比"}
                    ]
                },
                {
                    indicator:"Lock",
                    columnDefs:[
                        { "mDataProp": "SID", "aTargets":[0]},
                        { "mDataProp": "PID", "aTargets":[1] },
                        { "mDataProp": "UserID", "aTargets":[2] },
                        { "mDataProp": "DBName", "aTargets":[3] },
                        { "mDataProp": "TableBlockedBy", "aTargets":[4] },
                        { "mDataProp": "LockType", "aTargets":[5] },
                        { "mDataProp": "Page", "aTargets":[6] },
                        { "mDataProp": "Status", "aTargets":[7] },
                        { "mDataProp": "BlockedTime", "aTargets":[8] },
                        { "mDataProp": "Program", "aTargets":[9] },
                        { "mDataProp": "Command", "aTargets":[10] }
                    ],
                    columns:[
                        { sTitle: "会话ID"},
                        { sTitle: "进程ID"},
                        { sTitle: "用户"},
                        { sTitle: "数据库名"},
                        { sTitle: "锁内容"},
                        { sTitle: "锁类型"},
                        { sTitle: "页"},
                        { sTitle: "状态"},
                        { sTitle: "阻塞时间"},
                        { sTitle: "程序"},
                        { sTitle: "命令"}
                    ]
                },
                {
                    indicator:"Database",
                    columnDefs:[
                        { "mDataProp": "DBName", "aTargets":[0]},
                        { "mDataProp": "Owner", "aTargets":[1] },
                        { "mDataProp": "CreateTime", "aTargets":[2] },
                        { "mDataProp": "Status", "aTargets":[3] },
                        { "mDataProp": "DataSize", "aTargets":[4] },
                        { "mDataProp": "FreeDataSize", "aTargets":[5] },
                        { "mDataProp": "UseRatio", "aTargets":[6] },
                        { "mDataProp": "DeviceNames", "aTargets":[7] },
                        { "mDataProp": "LogSize", "aTargets":[8] },
                        { "mDataProp": "FreeLogSize", "aTargets":[9] },
                        { "mDataProp": "LogUseRatio", "aTargets":[10] },
                        { "mDataProp": "LogDeviceNames", "aTargets":[11] }
                    ],
                    columns:[
                        { sTitle: "数据库名"},
                        { sTitle: "所有者"},
                        { sTitle: "创建时间"},
                        { sTitle: "状态"},
                        { sTitle: "数据空间大小"},
                        { sTitle: "空闲数据空间大小"},
                        { sTitle: "数据空间使用率"},
                        { sTitle: "数据设备"},
                        { sTitle: "日志空间大小"},
                        { sTitle: "空闲日志空间大小"},
                        { sTitle: "日志空间使用率"},
                        { sTitle: "日志设备"}
                    ]
                },
                {
                    indicator:"SQLPerformance",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Text", "aTargets":[1] },
                        { "mDataProp": "UserName", "aTargets":[2] },
                        { "mDataProp": "LogicalReads", "aTargets":[3] },
                        { "mDataProp": "PhysicalReads", "aTargets":[4] },
                        { "mDataProp": "Executions", "aTargets":[5] },
                        { "mDataProp": "ElapsedTime", "aTargets":[6] },
                        { "mDataProp": "CPUTime", "aTargets":[7] }
                    ],
                    columns:[
                        { sTitle: "SQL ID"},
                        { sTitle: "SQL文本"},
                        { sTitle: "用户名"},
                        { sTitle: "缓存读取次数"},
                        { sTitle: "物理读取次数"},
                        { sTitle: "执行次数"},
                        { sTitle: "消耗时间"},
                        { sTitle: "CPU占用"}
                    ]
                }
            ]
        },
        oraclerac:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    [],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    [],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            cpuBars:[
                {indicator:"SysPerf",metric:"MinSesInstRatio",bottom:["TotalInst","ActInst"]}
            ],
            trend:{indicator:"SysPerf", metric:"MinSesInstRatio",title:"前24小时均衡率趋势"}
        }
    },
    middleware:{
        iis:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["版本信息","主机名","启动时间"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["Version","HostName","UpTime"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            tables:[
                {
                    indicator:"IOStat",
                    columnDefs:[
                        { "mDataProp": "SiteName", "aTargets":[0]},
                        { "mDataProp": "ByteRecvPS", "aTargets":[1] },
                        { "mDataProp": "ByteSentPS", "aTargets":[2] },
                        { "mDataProp": "ByteTransPS", "aTargets":[3] }
                    ],
                    columns:[
                        { sTitle: "站点名"},
                        { sTitle: "每秒接收字节数"},
                        { sTitle: "每秒发送字节数"},
                        { sTitle: "每秒总字节数"}
                    ]
                },
                {
                    indicator:"Request",
                    columnDefs:[
                        { "mDataProp": "SiteName", "aTargets":[0]},
                        { "mDataProp": "HttpReqPS", "aTargets":[1] },
                        { "mDataProp": "GetReqPS", "aTargets":[2] },
                        { "mDataProp": "PostReqPS", "aTargets":[3] },
                        { "mDataProp": "HTTPReq", "aTargets":[4] },
                        { "mDataProp": "GetReq", "aTargets":[5] },
                        { "mDataProp": "PosReq", "aTargets":[6] },
                        { "mDataProp": "CurBlkReq", "aTargets":[7] },
                        { "mDataProp": "BlkReq", "aTargets":[8] },
                        { "mDataProp": "LockReqPS", "aTargets":[9] },
                        { "mDataProp": "UnlockReqPS", "aTargets":[10] },
                        { "mDataProp": "LockReq", "aTargets":[11] },
                        { "mDataProp": "UnlockReq", "aTargets":[12] }
                    ],
                    columns:[
                        { sTitle: "站点名"},
                        { sTitle: "每秒HTTP请求数"},
                        { sTitle: "每秒GET请求数"},
                        { sTitle: "每秒POST请求数"},
                        { sTitle: "总HTTP请求数"},
                        { sTitle: "总GET请求数"},
                        { sTitle: "总POST请求数"},
                        { sTitle: "当前阻塞请求数"},
                        { sTitle: "阻塞的请求总数"},
                        { sTitle: "每秒锁住请求数"},
                        { sTitle: "每秒解锁请求数"},
                        { sTitle: "总锁住请求数"},
                        { sTitle: "总解锁请求数"}
                    ]
                },
                {
                    indicator:"Connection",
                    columnDefs:[
                        { "mDataProp": "SiteName", "aTargets":[0]},
                        { "mDataProp": "CurConn", "aTargets":[1] },
                        { "mDataProp": "ConnPS", "aTargets":[2] },
                        { "mDataProp": "LogonPS", "aTargets":[3] },
                        { "mDataProp": "MaxConn", "aTargets":[4] },
                        { "mDataProp": "ConnAtte", "aTargets":[5] },
                        { "mDataProp": "LogonAtte", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "站点名"},
                        { sTitle: "当前连接数"},
                        { sTitle: "每秒尝试连接数"},
                        { sTitle: "每秒尝试登录数"},
                        { sTitle: "最大连接数"},
                        { sTitle: "总尝试连接数"},
                        { sTitle: "总尝试登录数"}
                    ]
                },
                {
                    indicator:"ErrorStat",
                    columnDefs:[
                        { "mDataProp": "SiteName", "aTargets":[0]},
                        { "mDataProp": "NofErrPS", "aTargets":[1] },
                        { "mDataProp": "LockErrPS", "aTargets":[2] },
                        { "mDataProp": "NofErr", "aTargets":[3] },
                        { "mDataProp": "LockErr", "aTargets":[4] }
                    ],
                    columns:[
                        { sTitle: "站点名"},
                        { sTitle: "每秒未发现错误数"},
                        { sTitle: "每秒锁住错误数"},
                        { sTitle: "总发现错误数"},
                        { sTitle: "总锁住错误数"}
                    ]
                },
                {
                    indicator:"FileTrans",
                    columnDefs:[
                        { "mDataProp": "SiteName", "aTargets":[0]},
                        { "mDataProp": "FileRecvPS", "aTargets":[1] },
                        { "mDataProp": "FileSentPS", "aTargets":[2] },
                        { "mDataProp": "FileTranPS", "aTargets":[3] },
                        { "mDataProp": "FileRecv", "aTargets":[4] },
                        { "mDataProp": "FileSent", "aTargets":[5] },
                        { "mDataProp": "FileTran", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "站点名"},
                        { sTitle: "每秒接收文件数"},
                        { sTitle: "每秒发送文件数"},
                        { sTitle: "每秒处理文件数"},
                        { sTitle: "总接收文件数"},
                        { sTitle: "总发送文件数"},
                        { sTitle: "总处理文件数"}
                    ]
                },
                {
                    indicator:"SysPerf",
                    columnDefs:[
                        { "mDataProp": "CurConn", "aTargets":[0]},
                        { "mDataProp": "BytePS", "aTargets":[1] },
                        { "mDataProp": "TotalReqs", "aTargets":[2] },
                        { "mDataProp": "TotalErrs", "aTargets":[3] }
                    ],
                    columns:[
                        { sTitle: "当前连接数"},
                        { sTitle: "每秒收发字节数"},
                        { sTitle: "HTTP请求总数"},
                        { sTitle: "错误总数"}
                    ]
                }
            ]
        },
        weblogic:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["版本信息","主机名","启动时间","服务器名称","服务器状态"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["Version","HostName","UpTime","ServerName","ServerState"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            extendPanel:{
                indicators:["ExecuteQueue","JVM","ThreadPool"],
                titles:[
                    ["空闲线程数","等待请求数","最长等待请求放入队列的时间"],
                    ["版本","提供商","空闲堆大小","当前堆大小"],
                    ["完成请求数","空闲线程数","线程总数","队列长度","每秒请求完成数"]
                ],
                cols_def:[
                    ["ExecuteQueue.ExecuteThreadCurrentIdleCount","ExecuteQueue.PendingRequestCurrentCount","ExecuteQueue.OldestPendingRequest"],
                    ["JVM.Version","JVM.Vendor","JVM.HeapFree","JVM.HeapSize"],
                    ["ThreadPool.CompletedRequestCount","ThreadPool.ExecuteThreadIdleCount","ThreadPool.ExecuteThreadTotalCount","ThreadPool.QueueLength","ThreadPool.Throughput"]
                ]
            },
            cpuBars:[
                {indicator:"JVM", metric:"HeapUsage"}
            ],
            trend:{indicator:"JVM", metric:"HeapUsage",title:"前24小时堆内存使用率趋势"},
            tables:[
                {
                    indicator:"JDBCConnectionPool",
                    columnDefs:[
                        { "mDataProp": "JdbcPoolName", "aTargets":[0]},
                        { "mDataProp": "ActiveAverageCount", "aTargets":[1] },
                        { "mDataProp": "ActiveCount", "aTargets":[2] },
                        { "mDataProp": "DelayTime", "aTargets":[3] },
                        { "mDataProp": "AvgConnectionDelay", "aTargets":[4] },
                        { "mDataProp": "LeakProfileCount", "aTargets":[5] },
                        { "mDataProp": "CurrCapacity", "aTargets":[6] },
                        { "mDataProp": "CurrentWaitConnection", "aTargets":[7] }
                    ],
                    columns:[
                        { sTitle: "连接池名称"},
                        { sTitle: "平均活动连接数"},
                        { sTitle: "当前活动连接数"},
                        { sTitle: "连接延迟"},
                        { sTitle: "平均连接延迟"},
                        { sTitle: "连接泄漏"},
                        { sTitle: "当前容量"},
                        { sTitle: "当前连接等待数"}
                    ]
                },
                {
                    indicator:"ExecuteQueue",
                    columnDefs:[
                        { "mDataProp": "ExQueueName", "aTargets":[0]},
                        { "mDataProp": "ExecuteThreadCurrentIdleCount", "aTargets":[1] },
                        { "mDataProp": "ExecuteThreadTotalCount", "aTargets":[2] },
                        { "mDataProp": "PendingRequestCurrentCount", "aTargets":[3] },
                        { "mDataProp": "ServicedRequestTotalCount", "aTargets":[4] },
                        { "mDataProp": "OldestPendingRequest", "aTargets":[5] }
                    ],
                    columns:[
                        { sTitle: "执行队列名称"},
                        { sTitle: "空闲线程数"},
                        { sTitle: "线程总数"},
                        { sTitle: "等待请求数"},
                        { sTitle: "已处理请求总数"},
                        { sTitle: "最长等待请求放入队列的时间"}
                    ]
                }
            ]
        },
        mq:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["版本信息","主机名","启动时间"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["Version","HostName","UpTime"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            tables:[
                {
                    indicator:"Queue",
                    columnDefs:[
                        { "mDataProp": "Name", "aTargets":[0]},
                        { "mDataProp": "MaxDepth", "aTargets":[1] },
                        { "mDataProp": "CurrentDepth", "aTargets":[2] },
                        { "mDataProp": "OpenInputCount", "aTargets":[3] },
                        { "mDataProp": "OpenOpenCount", "aTargets":[4] },
                        { "mDataProp": "LastGetDateTime", "aTargets":[5] },
                        { "mDataProp": "LastPutDateTime", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "队列名称"},
                        { sTitle: "最大队列深度"},
                        { sTitle: "当前队列深度"},
                        { sTitle: "打开的输入句柄数"},
                        { sTitle: "打开的输出句柄数"},
                        { sTitle: "最后读消息时间"},
                        { sTitle: "最后写消息时间"}
                    ]
                },
                {
                    indicator:"Channel",
                    columnDefs:[
                        { "mDataProp": "JobName", "aTargets":[0] },
                        { "mDataProp": "Name", "aTargets":[1] },
                        { "mDataProp": "Status", "aTargets":[2] },
                        { "mDataProp": "ByteSent", "aTargets":[3] },
                        { "mDataProp": "ByteReceived", "aTargets":[4] },
                        { "mDataProp": "BuffersSent", "aTargets":[5] },
                        { "mDataProp": "BufferReceived", "aTargets":[6] }
                    ],
                    columns:[
                        { sTitle: "作业名"},
                        { sTitle: "通道名"},
                        { sTitle: "状态"},
                        { sTitle: "发送字节数"},
                        { sTitle: "接收字节数"},
                        { sTitle: "发送缓存数"},
                        { sTitle: "接收缓存数"}
                    ]
                },
                {
                    indicator:"QmgStatus",
                    columnDefs:[
                        { "mDataProp": "Name", "aTargets":[0] },
                        { "mDataProp": "Status", "aTargets":[1] },
                        { "mDataProp": "CmdServerStatus", "aTargets":[2] },
                        { "mDataProp": "ChInitStatus", "aTargets":[3] },
                        { "mDataProp": "ConnCount", "aTargets":[4] }
                    ],
                    columns:[
                        { sTitle: "队列管理器名称"},
                        { sTitle: "队列管理器状态"},
                        { sTitle: "命令服务器状态"},
                        { sTitle: "通道服务器状态"},
                        { sTitle: "连接计数"}
                    ]
                }
            ]
        },
        weblogiccluster:{
            panel: {
                indicator:"ClusterInfo",
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["集群名称","状态","活动服务数量","服务器名称","丢失的多播消息数量","重发的请求数量"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["ClusterName","ServerState","AliveServerCnt","ServerNames","MultMsgLostCnt","ResendReqCnt"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            tables:[
                {
                    indicator:"Server",
                    columnDefs:[
                        { "mDataProp": "Name", "aTargets":[0]},
                        { "mDataProp": "Version", "aTargets":[1] },
                        { "mDataProp": "State", "aTargets":[2] },
                        { "mDataProp": "OpenSockCurCnt", "aTargets":[3] },
                        { "mDataProp": "SocksOpenCnt", "aTargets":[4] },
                        { "mDataProp": "RestartCnt", "aTargets":[5] },
                        { "mDataProp": "ListenAddress", "aTargets":[6] },
                        { "mDataProp": "ListenPort", "aTargets":[7] },
                        { "mDataProp": "ListenPortEnabled", "aTargets":[8] }
                    ],
                    columns:[
                        { sTitle: "服务器名称"},
                        { sTitle: "版本"},
                        { sTitle: "服务器状态"},
                        { sTitle: "当前打开套接字数"},
                        { sTitle: "套接字打开总数"},
                        { sTitle: "重启次数"},
                        { sTitle: "监听地址"},
                        { sTitle: "监听端口"},
                        { sTitle: "监听端口启用"}
                    ]
                },
                {
                    indicator:"JDBCConnectionPool",
                    columnDefs:[
                        { "mDataProp": "Index", "aTargets":[0]},
                        { "mDataProp": "ServerName", "aTargets":[1]},
                        { "mDataProp": "JdbcPoolName", "aTargets":[2]},
                        { "mDataProp": "ActiveAverageCount", "aTargets":[3] },
                        { "mDataProp": "ActiveCount", "aTargets":[4] },
                        { "mDataProp": "DelayTime", "aTargets":[5] },
                        { "mDataProp": "AvgConnectionDelay", "aTargets":[6] },
                        { "mDataProp": "LeakProfileCount", "aTargets":[7] },
                        { "mDataProp": "CurrCapacity", "aTargets":[8] },
                        { "mDataProp": "CurrentWaitConnection", "aTargets":[9] }
                    ],
                    columns:[
                        { sTitle: "索引"},
                        { sTitle: "服务器名称"},
                        { sTitle: "JDBC连接池名称"},
                        { sTitle: "平均活动连接数"},
                        { sTitle: "当前活动连接数"},
                        { sTitle: "连接延迟"},
                        { sTitle: "平均连接延迟"},
                        { sTitle: "连接泄漏"},
                        { sTitle: "当前容量"},
                        { sTitle: "当前连接等待数"}
                    ]
                },
                {
                    indicator:"ExecuteQueue",
                    columnDefs:[
                        { "mDataProp": "Index", "aTargets":[0]},
                        { "mDataProp": "ServerName", "aTargets":[1]},
                        { "mDataProp": "ExQueueName", "aTargets":[2]},
                        { "mDataProp": "ExecuteThreadCurrentIdleCount", "aTargets":[3] },
                        { "mDataProp": "ExecuteThreadTotalCount", "aTargets":[4] },
                        { "mDataProp": "PendingRequestCurrentCount", "aTargets":[5] },
                        { "mDataProp": "ServicedRequestTotalCount", "aTargets":[6] },
                        { "mDataProp": "OldestPendingRequest", "aTargets":[7] }
                    ],
                    columns:[
                        { sTitle: "索引"},
                        { sTitle: "服务器名称"},
                        { sTitle: "执行队列名称"},
                        { sTitle: "空闲线程数"},
                        { sTitle: "线程总数"},
                        { sTitle: "等待请求数"},
                        { sTitle: "已处理请求总数"},
                        { sTitle: "最长等待请求放入队列的时间"}
                    ]
                },
                {
                    indicator:"ThreadPool",
                    columnDefs:[
                        { "mDataProp": "ServerName", "aTargets":[0]},
                        { "mDataProp": "CompletedRequestCount", "aTargets":[1] },
                        { "mDataProp": "ExecuteThreadIdleCount", "aTargets":[2] },
                        { "mDataProp": "ExecuteThreadTotalCount", "aTargets":[3] },
                        { "mDataProp": "QueueLength", "aTargets":[4] },
                        { "mDataProp": "Throughput", "aTargets":[5] }
                    ],
                    columns:[
                        { sTitle: "服务器名称"},
                        { sTitle: "完成请求数"},
                        { sTitle: "空闲线程数"},
                        { sTitle: "线程总数"},
                        { sTitle: "队列长度"},
                        { sTitle: "每秒请求完成数"}
                    ]
                },
                {
                    indicator:"JVM",
                    columnDefs:[
                        { "mDataProp": "ServerName", "aTargets":[0]},
                        { "mDataProp": "Version", "aTargets":[1] },
                        { "mDataProp": "Vendor", "aTargets":[2] },
                        { "mDataProp": "HeapFree", "aTargets":[3] },
                        { "mDataProp": "HeapSize", "aTargets":[4] },
                        { "mDataProp": "HeapUsage", "aTargets":[5] }
                    ],
                    columns:[
                        { sTitle: "服务器名称"},
                        { sTitle: "版本"},
                        { sTitle: "提供商"},
                        { sTitle: "空闲堆大小"},
                        { sTitle: "当前堆大小"},
                        { sTitle: "堆内存使用率"}
                    ]
                }
            ]
        }
    },
    network:{
        router:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["系统名称", "设备OID",'运行时间',"位置","设备描述"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["Name", "ObjectId",'UpTime',"Location","Desc"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            cpuPies:[
                {indicator:"CPU", metric:"Usage"},
                {indicator:"MEM", metric:"Usage"}
            ],
            trend:{indicator:"CPU", metric:"Usage",title:"前24小时CPU总使用率趋势"},
            picPies:[
                {title:"温度",indicator:"Temperature", metric:"State",bottom:["Value"]},
                {title:"风扇",indicator:"Fan", metric:"State",bottom:[]},
                {title:"电源",indicator:"Supply", metric:"State",bottom:[]}
            ],
            tables:[
                {
                    indicator:"ARP",
                    columnDefs:[
                        { "mDataProp": "Index", "aTargets":[0]},
                        { "mDataProp": "IfIndex", "aTargets":[1]},
                        { "mDataProp": "PhyAddress", "aTargets":[2] },
                        { "mDataProp": "NetAddress", "aTargets":[3] },
                        { "mDataProp": "Type", "aTargets":[4]}
                    ],
                    columns:[
                        { sTitle: "索引"},
                        { sTitle: "端口号"},
                        { sTitle: "物理地址"},
                        { sTitle: "IP地址"},
                        { sTitle: "地址类型"}
                    ]
                },
                {
                    indicator:"Route",
                    columnDefs:[
                        { "mDataProp": "Index", "aTargets":[0]},
                        { "mDataProp": "IfIndex", "aTargets":[1]},
                        { "mDataProp": "Dest", "aTargets":[2]},
                        { "mDataProp": "Mask", "aTargets":[3] },
                        { "mDataProp": "Protocol", "aTargets":[4] },
                        { "mDataProp": "NextHop", "aTargets":[5]},
                        { "mDataProp": "Type", "aTargets":[6]}
                    ],
                    columns:[
                        { sTitle: "索引"},
                        { sTitle: "端口索引"},
                        { sTitle: "目标地址"},
                        { sTitle: "掩码"},
                        { sTitle: "协议"},
                        { sTitle: "下一跳IP"},
                        { sTitle: "类型"}
                    ]
                },
                {
                    indicator:"Interface",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfDescr", "aTargets":[1] },
                        { "mDataProp": "IfType", "aTargets":[2] },
                        { "mDataProp": "IfMtu", "aTargets":[3]},
                        { "mDataProp": "IfSpeed", "aTargets":[4] },
                        { "mDataProp": "IfBandUsage", "aTargets":[5] },
                        { "mDataProp": "IfPhysAddress", "aTargets":[6] },
                        { "mDataProp": "IfInOctets", "aTargets":[7]},
                        { "mDataProp": "IfOutOctets", "aTargets":[8]},
                        { "mDataProp": "IfOctets", "aTargets":[9]},
                        { "mDataProp": "IfInUcastPkts", "aTargets":[10]},
                        { "mDataProp": "IfOutUcastPkts", "aTargets":[11]},
                        { "mDataProp": "IfUcastPkts", "aTargets":[12]},
                        { "mDataProp": "IfInNUcastPkts", "aTargets":[13]},
                        { "mDataProp": "IfOutNUcastPkts", "aTargets":[14]},
                        { "mDataProp": "IfNUcastPkts", "aTargets":[15]}

                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "端口名称"},
                        { sTitle: "端口类型"},
                        { sTitle: "最大传输单元"},
                        { sTitle: "带宽速率"},
                        { sTitle: "带宽使用率"},
                        { sTitle: "物理地址"},
                        { sTitle: "入流量"},
                        { sTitle: "出流量"},
                        { sTitle: "总流量"},
                        { sTitle: "入帧量"},
                        { sTitle: "出帧量"},
                        { sTitle: "总帧量"},
                        { sTitle: "入广播量"},
                        { sTitle: "出广播量"},
                        { sTitle: "总广播量"}
                    ]
                },
                {
                    indicator:"InterfaceStatus",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfStatus", "aTargets":[1]},
                        { "mDataProp": "IfAdminStatus", "aTargets":[2]},
                        { "mDataProp": "IfOperStatus", "aTargets":[3]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "连接状态"},
                        { sTitle: "管理状态"},
                        { sTitle: "工作状态"}
                    ]
                },
                {
                    indicator:"IPAddress",
                    columnDefs:[
                        { "mDataProp": "IP", "aTargets":[0]},
                        { "mDataProp": "IfIndex", "aTargets":[1] },
                        { "mDataProp": "NetMask", "aTargets":[2] }
                    ],
                    columns:[
                        { sTitle: "IP地址"},
                        { sTitle: "接口号"},
                        { sTitle: "网络掩码"}
                    ]
                }
            ]
        },
        switch2:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["系统名称", "设备OID",'运行时间',"位置","设备描述"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["Name", "ObjectId",'UpTime',"Location","Desc"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            cpuPies:[
                {indicator:"CPU", metric:"Usage"},
                {indicator:"MEM", metric:"Usage"}
            ],
            trend:{indicator:"CPU", metric:"Usage",title:"前24小时CPU总使用率趋势"},
            picPies:[
                {title:"温度",indicator:"Temperature", metric:"State",bottom:["Value"]},
                {title:"风扇",indicator:"Fan", metric:"State",bottom:[]},
                {title:"电源",indicator:"Supply", metric:"State",bottom:[]}
            ],
            tables:[
                {
                    indicator:"Interface",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfDescr", "aTargets":[1] },
                        { "mDataProp": "IfType", "aTargets":[2] },
                        { "mDataProp": "IfMtu", "aTargets":[3]},
                        { "mDataProp": "IfSpeed", "aTargets":[4] },
                        { "mDataProp": "IfBandUsage", "aTargets":[5] },
                        { "mDataProp": "IfPhysAddress", "aTargets":[6] },
                        { "mDataProp": "IfInOctets", "aTargets":[7]},
                        { "mDataProp": "IfOutOctets", "aTargets":[8]},
                        { "mDataProp": "IfOctets", "aTargets":[9]},
                        { "mDataProp": "IfInUcastPkts", "aTargets":[10]},
                        { "mDataProp": "IfOutUcastPkts", "aTargets":[11]},
                        { "mDataProp": "IfUcastPkts", "aTargets":[12]},
                        { "mDataProp": "IfInNUcastPkts", "aTargets":[13]},
                        { "mDataProp": "IfOutNUcastPkts", "aTargets":[14]},
                        { "mDataProp": "IfNUcastPkts", "aTargets":[15]}

                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "端口名称"},
                        { sTitle: "端口类型"},
                        { sTitle: "最大传输单元"},
                        { sTitle: "带宽速率"},
                        { sTitle: "带宽使用率"},
                        { sTitle: "物理地址"},
                        { sTitle: "入流量"},
                        { sTitle: "出流量"},
                        { sTitle: "总流量"},
                        { sTitle: "入帧量"},
                        { sTitle: "出帧量"},
                        { sTitle: "总帧量"},
                        { sTitle: "入广播量"},
                        { sTitle: "出广播量"},
                        { sTitle: "总广播量"}
                    ]
                },
                {
                    indicator:"InterfaceStatus",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfStatus", "aTargets":[1]},
                        { "mDataProp": "IfAdminStatus", "aTargets":[2]},
                        { "mDataProp": "IfOperStatus", "aTargets":[3]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "连接状态"},
                        { sTitle: "管理状态"},
                        { sTitle: "工作状态"}
                    ]
                },
                {
                    indicator:"MAC",
                    columnDefs:[
                        { "mDataProp": "Address", "aTargets":[0]},
                        { "mDataProp": "IfIndex", "aTargets":[1]},
                        { "mDataProp": "Status", "aTargets":[2]}
                    ],
                    columns:[
                        { sTitle: "MAC地址"},
                        { sTitle: "端口索引"},
                        { sTitle: "状态"}
                    ]
                }
            ]
        },
        switch3:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["系统名称", "设备OID",'运行时间',"位置","设备描述"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["Name", "ObjectId",'UpTime',"Location","Desc"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            cpuPies:[
                {indicator:"CPU", metric:"Usage"},
                {indicator:"MEM", metric:"Usage"}
            ],
            trend:{indicator:"CPU", metric:"Usage",title:"前24小时CPU总使用率趋势"},
            picPies:[
                {title:"温度",indicator:"Temperature", metric:"State",bottom:["Value"]},
                {title:"风扇",indicator:"Fan", metric:"State",bottom:[]},
                {title:"电源",indicator:"Supply", metric:"State",bottom:[]}
            ],
            tables:[
                {
                    indicator:"ARP",
                    columnDefs:[
                        { "mDataProp": "Index", "aTargets":[0]},
                        { "mDataProp": "IfIndex", "aTargets":[1]},
                        { "mDataProp": "PhyAddress", "aTargets":[2] },
                        { "mDataProp": "NetAddress", "aTargets":[3] },
                        { "mDataProp": "Type", "aTargets":[4]}
                    ],
                    columns:[
                        { sTitle: "索引"},
                        { sTitle: "端口号"},
                        { sTitle: "物理地址"},
                        { sTitle: "IP地址"},
                        { sTitle: "地址类型"}
                    ]
                },
                {
                    indicator:"Route",
                    columnDefs:[
                        { "mDataProp": "Index", "aTargets":[0]},
                        { "mDataProp": "IfIndex", "aTargets":[1]},
                        { "mDataProp": "Dest", "aTargets":[2]},
                        { "mDataProp": "Mask", "aTargets":[3] },
                        { "mDataProp": "Protocol", "aTargets":[4] },
                        { "mDataProp": "NextHop", "aTargets":[5]},
                        { "mDataProp": "Type", "aTargets":[6]}
                    ],
                    columns:[
                        { sTitle: "索引"},
                        { sTitle: "端口索引"},
                        { sTitle: "目标地址"},
                        { sTitle: "掩码"},
                        { sTitle: "协议"},
                        { sTitle: "下一跳IP"},
                        { sTitle: "类型"}
                    ]
                },
                {
                    indicator:"Interface",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfDescr", "aTargets":[1] },
                        { "mDataProp": "IfType", "aTargets":[2] },
                        { "mDataProp": "IfMtu", "aTargets":[3]},
                        { "mDataProp": "IfSpeed", "aTargets":[4] },
                        { "mDataProp": "IfBandUsage", "aTargets":[5] },
                        { "mDataProp": "IfPhysAddress", "aTargets":[6] },
                        { "mDataProp": "IfInOctets", "aTargets":[7]},
                        { "mDataProp": "IfOutOctets", "aTargets":[8]},
                        { "mDataProp": "IfOctets", "aTargets":[9]},
                        { "mDataProp": "IfInUcastPkts", "aTargets":[10]},
                        { "mDataProp": "IfOutUcastPkts", "aTargets":[11]},
                        { "mDataProp": "IfUcastPkts", "aTargets":[12]},
                        { "mDataProp": "IfInNUcastPkts", "aTargets":[13]},
                        { "mDataProp": "IfOutNUcastPkts", "aTargets":[14]},
                        { "mDataProp": "IfNUcastPkts", "aTargets":[15]}

                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "端口名称"},
                        { sTitle: "端口类型"},
                        { sTitle: "最大传输单元"},
                        { sTitle: "带宽速率"},
                        { sTitle: "带宽使用率"},
                        { sTitle: "物理地址"},
                        { sTitle: "入流量"},
                        { sTitle: "出流量"},
                        { sTitle: "总流量"},
                        { sTitle: "入帧量"},
                        { sTitle: "出帧量"},
                        { sTitle: "总帧量"},
                        { sTitle: "入广播量"},
                        { sTitle: "出广播量"},
                        { sTitle: "总广播量"}
                    ]
                },
                {
                    indicator:"InterfaceStatus",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfStatus", "aTargets":[1]},
                        { "mDataProp": "IfAdminStatus", "aTargets":[2]},
                        { "mDataProp": "IfOperStatus", "aTargets":[3]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "连接状态"},
                        { sTitle: "管理状态"},
                        { sTitle: "工作状态"}
                    ]
                },
                {
                    indicator:"IPAddress",
                    columnDefs:[
                        { "mDataProp": "IP", "aTargets":[0]},
                        { "mDataProp": "IfIndex", "aTargets":[1] },
                        { "mDataProp": "NetMask", "aTargets":[2] }
                    ],
                    columns:[
                        { sTitle: "IP地址"},
                        { sTitle: "接口号"},
                        { sTitle: "网络掩码"}
                    ]
                },
                {
                    indicator:"MAC",
                    columnDefs:[
                        { "mDataProp": "Address", "aTargets":[0]},
                        { "mDataProp": "IfIndex", "aTargets":[1]},
                        { "mDataProp": "Status", "aTargets":[2]}
                    ],
                    columns:[
                        { sTitle: "MAC地址"},
                        { sTitle: "端口索引"},
                        { sTitle: "状态"}
                    ]
                }
            ]
        },
        security:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["系统名称", "设备OID",'运行时间',"位置","设备描述"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["Name", "ObjectId",'Uptime',"Location","Desc"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            extendPanel:{
                indicators:["Connection","AtkInfo"],
                titles:[
                    ["当前连接总数","每秒连接数"],
                    ["每秒攻击次数","攻击总数","IPOption攻击","IPProtocol攻击","Port攻击","TCPScan攻击","winnuke攻击","ICMPContent攻击","Smurf攻击","Land攻击",
                        "PingOfDeath攻击","Teardrop攻击","Targa3攻击","IPSpoof攻击","PortScan攻击","SYNFlood攻击","UDPFlood攻击","ICMPFlood攻击","IPSweep攻击","其他攻击"]
                ],
                cols_def:[
                    ["Connection.CurrConn","Connection.ConnPs"],
                    ["AtkInfo.AtkPs","AtkInfo.Total","AtkInfo.IPOption","AtkInfo.IPProtocol","AtkInfo.Port","AtkInfo.TCPScan","AtkInfo.winnuke","AtkInfo.ICMPContent","AtkInfo.Smurf","AtkInfo.Land",
                        "AtkInfo.PingOfDeath","AtkInfo.Teardrop","AtkInfo.Targa3","AtkInfo.IPSpoof","AtkInfo.PortScan","AtkInfo.SYNFlood","AtkInfo.UDPFlood","AtkInfo.ICMPFlood","AtkInfo.IPSweep","AtkInfo.Other"]
                ]
            },
            cpuPies:[
                {indicator:"CPU", metric:"Usage"},
                {indicator:"MEM", metric:"Usage"}
            ],
            trend:{indicator:"CPU", metric:"Usage",title:"前24小时CPU总使用率趋势"},
            picPies:[
                {title:"温度",indicator:"Temperature", metric:"State",bottom:["Value"]},
                {title:"风扇",indicator:"Fan", metric:"State",bottom:[]},
                {title:"电源",indicator:"Supply", metric:"State",bottom:[]}
            ],
            tables:[
                {
                    indicator:"Interface",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfDescr", "aTargets":[1] },
                        { "mDataProp": "IfType", "aTargets":[2] },
                        { "mDataProp": "IfMtu", "aTargets":[3]},
                        { "mDataProp": "IfSpeed", "aTargets":[4] },
                        { "mDataProp": "IfBandUsage", "aTargets":[5] },
                        { "mDataProp": "IfPhysAddress", "aTargets":[6] },
                        { "mDataProp": "IfInOctets", "aTargets":[7]},
                        { "mDataProp": "IfOutOctets", "aTargets":[8]},
                        { "mDataProp": "IfOctets", "aTargets":[9]},
                        { "mDataProp": "IfInUcastPkts", "aTargets":[10]},
                        { "mDataProp": "IfOutUcastPkts", "aTargets":[11]},
                        { "mDataProp": "IfUcastPkts", "aTargets":[12]},
                        { "mDataProp": "IfInNUcastPkts", "aTargets":[13]},
                        { "mDataProp": "IfOutNUcastPkts", "aTargets":[14]},
                        { "mDataProp": "IfNUcastPkts", "aTargets":[15]}

                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "端口名称"},
                        { sTitle: "端口类型"},
                        { sTitle: "最大传输单元"},
                        { sTitle: "带宽速率"},
                        { sTitle: "带宽使用率"},
                        { sTitle: "物理地址"},
                        { sTitle: "入流量"},
                        { sTitle: "出流量"},
                        { sTitle: "总流量"},
                        { sTitle: "入帧量"},
                        { sTitle: "出帧量"},
                        { sTitle: "总帧量"},
                        { sTitle: "入广播量"},
                        { sTitle: "出广播量"},
                        { sTitle: "总广播量"}
                    ]
                },
                {
                    indicator:"InterfaceStatus",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfStatus", "aTargets":[1]},
                        { "mDataProp": "IfAdminStatus", "aTargets":[2]},
                        { "mDataProp": "IfOperStatus", "aTargets":[3]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "连接状态"},
                        { sTitle: "管理状态"},
                        { sTitle: "工作状态"}
                    ]
                }
            ]
        },
        loadbalancing:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["系统名称", "设备OID",'运行时间',"位置","设备描述"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["Name", "ObjectId",'Uptime',"Location","Desc"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            cpuPies:[
                {indicator:"CPU", metric:"Usage"},
                {indicator:"MEM", metric:"Usage"}
            ],
            trend:{indicator:"CPU", metric:"Usage",title:"前24小时CPU总使用率趋势"},
            picPies:[
                {title:"温度",indicator:"Temperature", metric:"State",bottom:["Value"]},
                {title:"风扇",indicator:"Fan", metric:"State",bottom:[]},
                {title:"电源",indicator:"Supply", metric:"State",bottom:[]}
            ],
            tables:[
                {
                    indicator:"Connection",
                    columnDefs:[
                        { "mDataProp": "TCP", "aTargets":[0]}
                    ],
                    columns:[
                        { sTitle: "当前TCP连接总数"}
                    ]
                },
                {
                    indicator:"InterfaceStatus",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfStatus", "aTargets":[1] },
                        { "mDataProp": "IfAdminStatus", "aTargets":[2] },
                        { "mDataProp": "IfOperStatus", "aTargets":[3]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "连接状态"},
                        { sTitle: "管理状态"},
                        { sTitle: "工作状态"}
                    ]
                }
            ]
        }
    },
    storage:{
        diskarray:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["系统名称", "微码版本","厂商","设备描述"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["Name", "Version","Manufacturer","Desc"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            memPies:[
                {indicator:"Space", metric:"UsedRatio",bottom:["Total","Used","Free"]}
            ],
            cpuBars:[
                {indicator:"LunHit", metric:"ReadHit"},
                {indicator:"LunHit", metric:"WriteHit"},
                {indicator:"LunHit", metric:"ReadRatio"}
            ],
            trend:{indicator:"Space", metric:"UsedRatio",title:"前24小时容量使用率趋势"},
            picPies:[
                {title:"温度",indicator:"Temperature", metric:"State",bottom:["Value"]},
                {title:"风扇",indicator:"Fan", metric:"State",bottom:[]},
                {title:"电源",indicator:"Supply", metric:"State",bottom:[]},
                {title:"电池",indicator:"Battery", metric:"State",bottom:[]}
            ],
            tables:[
                {
                    indicator:"Controller",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Name", "aTargets":[1] },
                        { "mDataProp": "PortCount", "aTargets":[2] },
                        { "mDataProp": "CacheMemorySize", "aTargets":[3]},
                        { "mDataProp": "OperationalStatus", "aTargets":[4] }
                    ],
                    columns:[
                        { sTitle: "标识"},
                        { sTitle: "名称"},
                        { sTitle: "端口数"},
                        { sTitle: "缓存大小"},
                        { sTitle: "运行状态"}
                    ]
                },
                {
                    indicator:"Interface",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "PermanentAddress", "aTargets":[1] },
                        { "mDataProp": "Speed", "aTargets":[2] },
                        { "mDataProp": "WriteIOs", "aTargets":[3]},
                        { "mDataProp": "ReadIOs", "aTargets":[4] },
                        { "mDataProp": "OperationalStatus", "aTargets":[5] },
                        { "mDataProp": "ControllerID", "aTargets":[6]},
                        { "mDataProp": "StatisticTime", "aTargets":[7]}
                    ],
                    columns:[
                        { sTitle: "端口标识"},
                        { sTitle: "端口WWN"},
                        { sTitle: "速度"},
                        { sTitle: "输入IO数"},
                        { sTitle: "输出IO数"},
                        { sTitle: "运行状态"},
                        { sTitle: "所属控制器"},
                        { sTitle: "采集时间"}
                    ]
                },
                {
                    indicator:"Pool",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "RaidLevel", "aTargets":[1] },
                        { "mDataProp": "TotalManagedSpace", "aTargets":[2] },
                        { "mDataProp": "RemainingManagedSpace", "aTargets":[3]},
                        { "mDataProp": "UsedManagedSpace", "aTargets":[4] },
                        { "mDataProp": "UsedRatio", "aTargets":[5] },
                        { "mDataProp": "OperationalStatus", "aTargets":[6]}
                    ],
                    columns:[
                        { sTitle: "ID"},
                        { sTitle: "RAID方式"},
                        { sTitle: "总容量"},
                        { sTitle: "剩余容量"},
                        { sTitle: "已使用容量"},
                        { sTitle: "使用率"},
                        { sTitle: "运行状态"}
                    ]
                },
                {
                    indicator:"Disk",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Name", "aTargets":[1] },
                        { "mDataProp": "Model", "aTargets":[2] },
                        { "mDataProp": "TotalSize", "aTargets":[3]},
                        { "mDataProp": "HealthState", "aTargets":[4] },
                        { "mDataProp": "PoolID", "aTargets":[5] }
                    ],
                    columns:[
                        { sTitle: "磁盘ID"},
                        { sTitle: "名称"},
                        { sTitle: "型号"},
                        { sTitle: "容量"},
                        { sTitle: "状态"},
                        { sTitle: "所属池"}
                    ]
                },
                {
                    indicator:"LUN",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Name", "aTargets":[1] },
                        { "mDataProp": "TotalSize", "aTargets":[2] },
                        { "mDataProp": "HostID", "aTargets":[3] },
                        { "mDataProp": "HealthState", "aTargets":[4] },
                        { "mDataProp": "ReadIOs", "aTargets":[5]},
                        { "mDataProp": "ReadHitIOs", "aTargets":[6] },
                        { "mDataProp": "ReadHitRatio", "aTargets":[7] },
                        { "mDataProp": "WriteIOs", "aTargets":[8]},
                        { "mDataProp": "WriteHitIOs", "aTargets":[9] },
                        { "mDataProp": "WriteHitRatio", "aTargets":[10] },
                        { "mDataProp": "StatisticTime", "aTargets":[11] }
                    ],
                    columns:[
                        { sTitle: "卷ID"},
                        { sTitle: "名称"},
                        { sTitle: "容量"},
                        { sTitle: "主机ID"},
                        { sTitle: "状态"},
                        { sTitle: "读IO"},
                        { sTitle: "缓存读IO"},
                        { sTitle: "缓存读命中率"},
                        { sTitle: "写IO"},
                        { sTitle: "缓存写IO"},
                        { sTitle: "缓存写命中率"},
                        { sTitle: "采集时间"}
                    ]
                },
                {
                    indicator:"InterfaceStatus",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfStatus", "aTargets":[1]},
                        { "mDataProp": "IfAdminStatus", "aTargets":[2]},
                        { "mDataProp": "IfOperStatus", "aTargets":[3]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "连接状态"},
                        { sTitle: "管理状态"},
                        { sTitle: "工作状态"}
                    ]
                },
                {
                    indicator:"CacheSize",
                    columnDefs:[
                        { "mDataProp": "Total", "aTargets":[0]}
                    ],
                    columns:[
                        { sTitle: "总容量"}
                    ]
                }
            ]
        },
        fcswitch:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["系统名称", "微码版本",'运行时间',"位置","厂商","设备描述","端口数量","在线端口数量","域ID","访问URL"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["Name", "Version","UpTime","Location","Manufacturer","Desc","PortCount","OnlinePort","DomainId","URL"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            cpuPies:[
                {indicator:"CPU", metric:"Usage"}
            ],
            memPies:[
                {indicator:"MEM", metric:"Usage"}
            ],
            trend:{indicator:"CPU", metric:"Usage",title:"前24小时CPU使用率趋势"},
            picPies:[
                {title:"温度",indicator:"Temperature", metric:"State",bottom:["Value"]},
                {title:"风扇",indicator:"Fan", metric:"State",bottom:[]},
                {title:"电源",indicator:"Supply", metric:"State",bottom:[]},
                {title:"电池",indicator:"Battery", metric:"State",bottom:[]}
            ],
            tables:[
                {
                    indicator:"Interface",
                    columnDefs:[
                        { "mDataProp": "Index", "aTargets":[0]},
                        { "mDataProp": "Description", "aTargets":[1] },
                        { "mDataProp": "PortType", "aTargets":[2] },
                        { "mDataProp": "PortWWN", "aTargets":[3]},
                        { "mDataProp": "FCID", "aTargets":[4] },
                        { "mDataProp": "PortSpeed", "aTargets":[5] },
                        { "mDataProp": "LocalPortWWN", "aTargets":[6]},
                        { "mDataProp": "RemotePortWWN", "aTargets":[7]},
                        { "mDataProp": "InOctets", "aTargets":[8]},
                        { "mDataProp": "OutOctets", "aTargets":[9]},
                        { "mDataProp": "InPercent", "aTargets":[10]},
                        { "mDataProp": "OutPercent", "aTargets":[11]},
                        { "mDataProp": "Percent", "aTargets":[12]},
                        { "mDataProp": "InNUcastPkts", "aTargets":[13]},
                        { "mDataProp": "OutNUcastPkts", "aTargets":[14]}
                    ],
                    columns:[
                        { sTitle: "索引"},
                        { sTitle: "名称"},
                        { sTitle: "类型"},
                        { sTitle: "port WWN"},
                        { sTitle: "光缆ID"},
                        { sTitle: "速度"},
                        { sTitle: "本地端口WWN"},
                        { sTitle: "对端端口WWN"},
                        { sTitle: "输入流量"},
                        { sTitle: "输出流量"},
                        { sTitle: "入带宽使用率"},
                        { sTitle: "出带宽使用率"},
                        { sTitle: "总带宽使用率"},
                        { sTitle: "输入广播包数"},
                        { sTitle: "输出广播包数"}
                    ]
                },
                {
                    indicator:"InterfaceStatus",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfStatus", "aTargets":[1]},
                        { "mDataProp": "IfAdminStatus", "aTargets":[2]},
                        { "mDataProp": "IfOperStatus", "aTargets":[3]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "连接状态"},
                        { sTitle: "管理状态"},
                        { sTitle: "工作状态"}
                    ]
                }
            ]
        },
        tapearray:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["厂商", "型号","序列号","WWN","磁带数量","清洗带数量","机械臂数量","端口数量","带库驱动数量","总磁带槽位","已使用槽位","微码版本"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["Manufacturer", "Model","SN","WWN","TapeCnt","CltCnt","RobCnt","PortCnt","DrvCnt","Tslot","Uslot","FwVer"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            tables:[
                {
                    indicator:"Robot",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "State", "aTargets":[1] },
                        { "mDataProp": "SN", "aTargets":[2] },
                        { "mDataProp": "LED", "aTargets":[3]},
                        { "mDataProp": "Ver", "aTargets":[4] },
                        { "mDataProp": "FwVer", "aTargets":[5] }
                    ],
                    columns:[
                        { sTitle: "标识"},
                        { sTitle: "状态"},
                        { sTitle: "序列号"},
                        { sTitle: "告警灯"},
                        { sTitle: "版本"},
                        { sTitle: "微码版本"}
                    ]
                },
                {
                    indicator:"Driver",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Vendor", "aTargets":[1] },
                        { "mDataProp": "Model", "aTargets":[2] },
                        { "mDataProp": "SN", "aTargets":[3]},
                        { "mDataProp": "State", "aTargets":[4] },
                        { "mDataProp": "FmVer", "aTargets":[5] },
                        { "mDataProp": "IfType", "aTargets":[6]}
                    ],
                    columns:[
                        { sTitle: "标识"},
                        { sTitle: "生产厂商"},
                        { sTitle: "型号"},
                        { sTitle: "序列号"},
                        { sTitle: "状态"},
                        { sTitle: "微码版本"},
                        { sTitle: "接口类型"}
                    ]
                },
                {
                    indicator:"HostIf",
                    columnDefs:[
                        { "mDataProp": "Index", "aTargets":[0]},
                        { "mDataProp": "ID", "aTargets":[1] },
                        { "mDataProp": "FmVer", "aTargets":[2] },
                        { "mDataProp": "FibreCnt", "aTargets":[3]},
                        { "mDataProp": "SN", "aTargets":[4] },
                        { "mDataProp": "Status", "aTargets":[5] },
                        { "mDataProp": "LED", "aTargets":[6]},
                        { "mDataProp": "HAState", "aTargets":[7]},
                        { "mDataProp": "WWN_A", "aTargets":[8]},
                        { "mDataProp": "Ena_A", "aTargets":[9]},
                        { "mDataProp": "Speed_A", "aTargets":[10]},
                        { "mDataProp": "WWN_B", "aTargets":[11]},
                        { "mDataProp": "Ena_B", "aTargets":[12]},
                        { "mDataProp": "Speed_B", "aTargets":[13]}
                    ],
                    columns:[
                        { sTitle: "索引"},
                        { sTitle: "标识"},
                        { sTitle: "微码版本"},
                        { sTitle: "光纤数"},
                        { sTitle: "序列号"},
                        { sTitle: "状态"},
                        { sTitle: "告警灯"},
                        { sTitle: "高可用性"},
                        { sTitle: "端口A WWN"},
                        { sTitle: "端口A启用"},
                        { sTitle: "端口A速率"},
                        { sTitle: "端口B WWN"},
                        { sTitle: "端口B启用"},
                        { sTitle: "端口B速率"}
                    ]
                },
                {
                    indicator:"Slot",
                    columnDefs:[
                        { "mDataProp": "Index", "aTargets":[0]},
                        { "mDataProp": "ElementID", "aTargets":[1] },
                        { "mDataProp": "Status", "aTargets":[2] },
                        { "mDataProp": "Label", "aTargets":[3]}
                    ],
                    columns:[
                        { sTitle: "索引"},
                        { sTitle: "标识"},
                        { sTitle: "状态"},
                        { sTitle: "磁带标识"}
                    ]
                },
                {
                    indicator:"Tape",
                    columnDefs:[
                        { "mDataProp": "Index", "aTargets":[0]},
                        { "mDataProp": "Label", "aTargets":[1] },
                        { "mDataProp": "TapeType", "aTargets":[2] },
                        { "mDataProp": "Location", "aTargets":[3] },
                        { "mDataProp": "HostAcce", "aTargets":[4] }
                    ],
                    columns:[
                        { sTitle: "索引"},
                        { sTitle: "标签"},
                        { sTitle: "磁带类型"},
                        { sTitle: "位置"},
                        { sTitle: "主机访问性"}
                    ]
                }
            ]
        },
        vtl:{
            panel: {
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["服务器名", "登录主机",'服务器版本',"操作系统版本","内核版本","CPU数","内存大小","Swap空间大小","产品名称"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["ServerName", "LoginMachineName","ServerVersion","OSVersion","KernelVersion","NumOfProcs","MemSize","SwapSize","Product"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            cpuPies:[
                {indicator:"BasePerf", metric:"CPUUsage"},
                {indicator:"BasePerf", metric:"MemUsage"},
                {indicator:"BasePerf", metric:"SwapUsage"}
            ],
            trend:{indicator:"BasePerf", metric:"CPUUsage",title:"前24小时CPU使用率趋势"},
            tables:[
                {
                    indicator:"Interface",
                    columnDefs:[
                        { "mDataProp": "IfIndex", "aTargets":[0]},
                        { "mDataProp": "IfName", "aTargets":[1] },
                        { "mDataProp": "IPAddr", "aTargets":[2] },
                        { "mDataProp": "Mac", "aTargets":[3]}
                    ],
                    columns:[
                        { sTitle: "端口索引"},
                        { sTitle: "端口名称"},
                        { sTitle: "IP地址"},
                        { sTitle: "MAC地址"}
                    ]
                },
                {
                    indicator:"FC",
                    columnDefs:[
                        { "mDataProp": "Index", "aTargets":[0]},
                        { "mDataProp": "WWPN", "aTargets":[1]},
                        { "mDataProp": "Mode", "aTargets":[2]}
                    ],
                    columns:[
                        { sTitle: "索引"},
                        { sTitle: "WWPN"},
                        { sTitle: "模式"}
                    ]
                },
                {
                    indicator:"Adapter",
                    columnDefs:[
                        { "mDataProp": "Index", "aTargets":[0]},
                        { "mDataProp": "No", "aTargets":[1]},
                        { "mDataProp": "Info", "aTargets":[2]},
                        { "mDataProp": "WWPN", "aTargets":[3]},
                        { "mDataProp": "Read", "aTargets":[4]},
                        { "mDataProp": "Write", "aTargets":[5]}
                    ],
                    columns:[
                        { sTitle: "索引"},
                        { sTitle: "标识"},
                        { sTitle: "名称"},
                        { sTitle: "WWPN"},
                        { sTitle: "已读字节"},
                        { sTitle: "已写字节"}
                    ]
                },
                {
                    indicator:"Device",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Type", "aTargets":[1]},
                        { "mDataProp": "Vendor", "aTargets":[2]},
                        { "mDataProp": "Product", "aTargets":[3]},
                        { "mDataProp": "FWRev", "aTargets":[4]},
                        { "mDataProp": "AdaptNo", "aTargets":[5]},
                        { "mDataProp": "ChanlNo", "aTargets":[6]},
                        { "mDataProp": "ScsiID", "aTargets":[7]},
                        { "mDataProp": "LUN", "aTargets":[8]},
                        { "mDataProp": "TotalSectors", "aTargets":[9]},
                        { "mDataProp": "SectorSize", "aTargets":[10]},
                        { "mDataProp": "TotalSize", "aTargets":[11]},
                        { "mDataProp": "Status", "aTargets":[12]}
                    ],
                    columns:[
                        { sTitle: "标识"},
                        { sTitle: "类型"},
                        { sTitle: "厂家"},
                        { sTitle: "产品标识"},
                        { sTitle: "微码版本"},
                        { sTitle: "适配器标识"},
                        { sTitle: "通道标识"},
                        { sTitle: "SCSI标识"},
                        { sTitle: "Lun标识"},
                        { sTitle: "扇区数"},
                        { sTitle: "扇区大小"},
                        { sTitle: "总大小"},
                        { sTitle: "状态"}
                    ]
                },
                {
                    indicator:"VirLib",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Name", "aTargets":[1]},
                        { "mDataProp": "Vendor", "aTargets":[2]},
                        { "mDataProp": "Product", "aTargets":[3]},
                        { "mDataProp": "Revision", "aTargets":[4]},
                        { "mDataProp": "Slots", "aTargets":[5]},
                        { "mDataProp": "Drivers", "aTargets":[6]},
                        { "mDataProp": "BCBegin", "aTargets":[7]},
                        { "mDataProp": "BCEnd", "aTargets":[8]},
                        { "mDataProp": "COD", "aTargets":[9]},
                        { "mDataProp": "AllSize", "aTargets":[10]},
                        { "mDataProp": "IncrSize", "aTargets":[11]},
                        { "mDataProp": "MaxSize", "aTargets":[12]},
                        { "mDataProp": "MediaType", "aTargets":[13]}
                    ],
                    columns:[
                        { sTitle: "标识"},
                        { sTitle: "名称"},
                        { sTitle: "厂家"},
                        { sTitle: "产品名称"},
                        { sTitle: "版本"},
                        { sTitle: "槽位数"},
                        { sTitle: "驱动器数"},
                        { sTitle: "条码开始号"},
                        { sTitle: "条码结束号"},
                        { sTitle: "COD启用"},
                        { sTitle: "分配大小"},
                        { sTitle: "增量大小"},
                        { sTitle: "最大大小"},
                        { sTitle: "介质类型"}
                    ]
                },
                {
                    indicator:"VirDrv",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Name", "aTargets":[1]},
                        { "mDataProp": "Vendor", "aTargets":[2]},
                        { "mDataProp": "Product", "aTargets":[3]},
                        { "mDataProp": "FWRev", "aTargets":[4]},
                        { "mDataProp": "LocType", "aTargets":[5]},
                        { "mDataProp": "Location", "aTargets":[6]},
                        { "mDataProp": "Read", "aTargets":[7]},
                        { "mDataProp": "Write", "aTargets":[8]}
                    ],
                    columns:[
                        { sTitle: "标识"},
                        { sTitle: "名称"},
                        { sTitle: "厂家"},
                        { sTitle: "产品名称"},
                        { sTitle: "微码版本"},
                        { sTitle: "位置"},
                        { sTitle: "位置标识"},
                        { sTitle: "已读字节"},
                        { sTitle: "已写字节"}
                    ]
                },
                {
                    indicator:"VirTape",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Name", "aTargets":[1]},
                        { "mDataProp": "Size", "aTargets":[2]},
                        { "mDataProp": "Status", "aTargets":[3]},
                        { "mDataProp": "GUID", "aTargets":[4]},
                        { "mDataProp": "UsedSize", "aTargets":[5]},
                        { "mDataProp": "Barcode", "aTargets":[6]},
                        { "mDataProp": "MediaType", "aTargets":[7]},
                        { "mDataProp": "COD", "aTargets":[8]},
                        { "mDataProp": "AutoArch", "aTargets":[9]},
                        { "mDataProp": "WriteProt", "aTargets":[10]},
                        { "mDataProp": "LocType", "aTargets":[11]},
                        { "mDataProp": "Location", "aTargets":[12]},
                        { "mDataProp": "SlotId", "aTargets":[13]}
                    ],
                    columns:[
                        { sTitle: "标识"},
                        { sTitle: "名称"},
                        { sTitle: "大小"},
                        { sTitle: "状态"},
                        { sTitle: "GUID"},
                        { sTitle: "已使用大小"},
                        { sTitle: "条码"},
                        { sTitle: "介质类型"},
                        { sTitle: "COD启用"},
                        { sTitle: "自动归档"},
                        { sTitle: "写保护"},
                        { sTitle: "位置"},
                        { sTitle: "所属虚拟带库"},
                        { sTitle: "当前槽位"}
                    ]
                },
                {
                    indicator:"PhyLib",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Name", "aTargets":[1]},
                        { "mDataProp": "Vendor", "aTargets":[2]},
                        { "mDataProp": "Product", "aTargets":[3]},
                        { "mDataProp": "Status", "aTargets":[4]},
                        { "mDataProp": "GUID", "aTargets":[5]},
                        { "mDataProp": "SN", "aTargets":[6]},
                        { "mDataProp": "Slots", "aTargets":[7]}
                    ],
                    columns:[
                        { sTitle: "标识"},
                        { sTitle: "名称"},
                        { sTitle: "厂家"},
                        { sTitle: "产品名称"},
                        { sTitle: "状态"},
                        { sTitle: "GUID"},
                        { sTitle: "序列号"},
                        { sTitle: "槽位数"}
                    ]
                },
                {
                    indicator:"PhyDrv",
                    columnDefs:[
                        { "mDataProp": "ID", "aTargets":[0]},
                        { "mDataProp": "Name", "aTargets":[1]},
                        { "mDataProp": "Vendor", "aTargets":[2]},
                        { "mDataProp": "Product", "aTargets":[3]},
                        { "mDataProp": "Status", "aTargets":[4]},
                        { "mDataProp": "GUID", "aTargets":[5]},
                        { "mDataProp": "SN", "aTargets":[6]}
                    ],
                    columns:[
                        { sTitle: "标识"},
                        { sTitle: "名称"},
                        { sTitle: "厂家"},
                        { sTitle: "产品名称"},
                        { sTitle: "状态"},
                        { sTitle: "GUID"},
                        { sTitle: "序列号"}
                    ]
                },
                {
                    indicator:"PhyTape",
                    columnDefs:[
                        { "mDataProp": "Slot", "aTargets":[0]},
                        { "mDataProp": "PhyLibId", "aTargets":[1]},
                        { "mDataProp": "Barcode", "aTargets":[2]}
                    ],
                    columns:[
                        { sTitle: "槽位"},
                        { sTitle: "物理带库标识"},
                        { sTitle: "条码"}
                    ]
                }
            ]
        }
    },
    service:{
        http: {
            panel: {
                indicator:"Response",
                titles:[
                    ["通断状态","监控状态","告警"],
                    ["资源名称","资源类型","负责人","管理IP","联系方式","所属机房","机柜","机架"],
                    ["响应时间","响应代码"],
                    ["可用率(%)","MTTR","MTTF","MTBF","故障次数","故障时间"]
                ],
                cols_def:[
                    ["Status.Status","CommonMonitorStatus.MonitorStatus","mo.alarm"],
                    ["mo.displayName","mo.moType","mo.user","mo.ip","mo.userContact","mo.locName","mo.cabinet","mo.rack"],
                    ["Time","Code"],
                    ["CommonAvailability.AvailableRate","CommonAvailability.MTTR","CommonAvailability.MTTF","CommonAvailability.MTBF","CommonAvailability.MalfunctionCount","CommonAvailability.Downtime"]
                ]
            },
            tables:[
                {
                    indicator:"Headers",
                    columnDefs:[
                        { "mDataProp": "Name", "aTargets":[0]},
                        { "mDataProp": "Value", "aTargets":[1] }
                    ],
                    columns:[
                        { sTitle: "名字"},
                        { sTitle: "值"}
                    ]
                },
                {
                    indicator:"Cookies",
                    columnDefs:[
                        { "mDataProp": "Name", "aTargets":[0]},
                        { "mDataProp": "Value", "aTargets":[1] },
                        { "mDataProp": "Domain", "aTargets":[2] },
                        { "mDataProp": "Path", "aTargets":[3] },
                        { "mDataProp": "Expires", "aTargets":[4] }
                    ],
                    columns:[
                        { sTitle: "名字"},
                        { sTitle: "值"},
                        { sTitle: "域"},
                        { sTitle: "路径"},
                        { sTitle: "过期"}
                    ]
                }
            ]
        }
    }
};