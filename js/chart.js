var myCharts = echarts.init(document.getElementById('container'));
var option = {
    backgroundColor: "#fff",
    title: {
        text: "项目甘特图",
        padding: 20,
        textStyle: {
            fontSize: 17,
            fontWeight: "bolder",
            color: "#333"
        },
        subtextStyle: {
            fontSize: 13,
            fontWeight: "bolder"
        }
    },
    legend: {
        data: ["计划工期", "可行性研究阶段", "初步设计阶段", "施工图设计阶段", "项目实施阶段", "项目验收阶段"],
        align: "right",
        right: 80,
        top: 50
    },
    grid: {
        containLabel: true,
        show: false,
        right: 130,
        left: 40,
        bottom: 40,
        top: 90
    },
    xAxis: {
        type: "time",
        axisLabel: {
            "show": true,
            "interval": 0
        }
    },
    dataZoom: [{
        type: 'inside',
    }, {
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    yAxis: {
        axisLabel: {
            show: true,
            interval: 0,
            formatter: function(value, index) {
                var last = ""
                var max = 5;
                var len = value.length;
                var hang = Math.ceil(len / max);
                if (hang > 1) {
                    for (var i = 0; i < hang; i++) {
                        var start = i * max;
                        var end = start + max;
                        var temp = value.substring(start, end) + "\n";
                        last += temp; //拼接最终的字符串
                    }
                    return last;
                } else {
                    return value;
                }
            }
        },
        data: ["阶段一", "标段二", "标段三"]
    },
    series: [{
            name: "计划工期",
            type: "bar",
            stack: "总量0",
            label: {
                normal: {
                    show: true,
                    color: "#000",
                    position: "right",
                    formatter: function(params) {
                        return params.seriesName
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: "skyblue",
                    borderColor: "#fff",
                    borderWidth: 2
                }
            },
            zlevel: -1,
            data: [new Date("2018-05-01"), new Date("2018-03-14"), new Date("2018-05-01")]
        },
        {
            name: "计划工期",
            type: "bar",
            stack: "总量0",
            itemStyle: {
                normal: {
                    color: "white",
                }
            },
            zlevel: -1,
            z: 3,
            data: [new Date("2018-01-01"), new Date("2018-01-01"), new Date("2018-03-15")]
        },
        {
            name: "可行性研究阶段",
            type: "bar",
            stack: "总量2",
            label: {
                normal: {
                    show: true,
                    color: "#000",
                    position: "right",
                    formatter: function(params) {
                        return params.seriesName
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: "green",
                    borderColor: "#fff",
                    borderWidth: 2
                }
            },
            zlevel: -1,
            data: [new Date("2018-01-10"), new Date("2018-01-10"), new Date("2018-03-30")]
        },
        {
            name: "可行性研究阶段",
            type: "bar",
            stack: "总量2",
            itemStyle: {
                normal: {
                    color: "white",
                }
            },
            zlevel: -1,
            z: 3,
            data: [new Date("2018-01-02"), new Date("2018-01-02"), new Date("2018-03-16")]
        },
        {
            name: "初步设计阶段",
            type: "bar",
            stack: "总量3",
            label: {
                normal: {
                    show: true,
                    color: "#000",
                    position: "right",
                    formatter: function(params) {
                        return params.seriesName
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: "red",
                    borderColor: "#fff",
                    borderWidth: 2
                }
            },
            zlevel: -1,
            data: [new Date("2018-02-20"), new Date("2018-01-20"), new Date("2018-04-10")]
        },
        {
            name: "初步设计阶段",
            type: "bar",
            stack: "总量3",
            itemStyle: {
                normal: {
                    color: "white"
                }
            },
            zlevel: -1,
            z: 3,
            data: [new Date("2018-02-01"), new Date("2018-01-12"), new Date("2018-04-01")]
        },
        {
            name: "施工图设计阶段",
            type: "bar",
            stack: "总量4",
            label: {
                normal: {
                    show: true,
                    color: "#000",
                    position: "right",
                    formatter: function(params) {
                        return params.seriesName
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: "brown",
                    borderColor: "#fff",
                    borderWidth: 2
                }
            },
            zlevel: -1,
            data: [new Date("2018-03-09"), new Date("2018-01-25"), new Date("2018-04-20")]
        },
        {
            name: "施工图设计阶段",
            type: "bar",
            stack: "总量4",
            itemStyle: {
                normal: {
                    color: "white",
                }
            },
            zlevel: -1,
            z: 3,
            data: [new Date("2018-02-25"), new Date("2018-01-21"), new Date("2018-04-11")]
        },
        {
            name: "项目实施阶段",
            type: "bar",
            stack: "总量5",
            label: {
                normal: {
                    show: true,
                    color: "#000",
                    position: "right",
                    formatter: function(params) {
                        return params.seriesName
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: "yellow",
                    borderColor: "#fff",
                    borderWidth: 2
                }
            },
            zlevel: -1,
            data: [new Date("2018-03-12"), new Date("2018-02-15"), new Date("2018-04-30")]
        },
        {
            name: "项目实施阶段",
            type: "bar",
            stack: "总量5",
            itemStyle: {
                normal: {
                    color: "white",
                }
            },
            zlevel: -1,
            z: 3,
            data: [new Date("2018-03-10"), new Date("2018-01-26"), new Date("2018-04-21")]
        },
        {
            name: "项目验收阶段",
            type: "bar",
            stack: "总量6",
            label: {
                normal: {
                    show: true,
                    color: "#000",
                    position: "right",
                    formatter: function(params) {
                        return params.seriesName
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: 'orange',
                    borderColor: "#fff",
                    borderWidth: 2
                }
            },
            zlevel: -1,
            data: [new Date("2018-03-30"), new Date("2018-03-13"), new Date("2018-05-01")]
        },
        {
            name: "项目验收阶段",
            type: "bar",
            stack: "总量6",
            itemStyle: {
                normal: {
                    color: 'white',
                }
            },
            zlevel: -1,
            z: 3,
            data: [new Date("2018-03-15"), new Date("2018-02-16"), new Date("2018-04-30")]
        },
    ]
}
myCharts.setOption(option);