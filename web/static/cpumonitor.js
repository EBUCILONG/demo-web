$(document).ready(function(){
    var jsonPath = "load_json/runtime-infos/monitor-data.json";
    const refreshInterval = 1000; //In ms
    const numOfType = 2;         //Number of type to display
    const maxItem   = 50;        //Maximun number of item in each json file
    const chartColors = ['#70ad47', '#ed7d31'];
    var timelineh = $('#timeline').height();
    var chartheight = timelineh*0.9;
    var chart = new G2.Chart({
          container: 'chartView',
          forceFit: true,
          height: chartheight,
          animate: false,
          padding: ["20", '50', '60', '40']
        });
    chart.scale('time', {
        alias:"Time (s)",
            tickInterval: maxItem
          });
    chart.scale('value', {
            max:300,
            min:0,
            formatter: val=>{ return val},
        });
        // chart.col('value', {
        //     alias: '这里设置标题的别名'
        //   });
        chart.scale('test', {
            max:1,
            min:0,
            formatter: val=>{ return val * 100 + "%";},
        });
    chart.axis('value', {
          label: {
                  textStyle: {
                            fill: '#000000'
                          }
                },
          line:{ stroke: 'grey' }
        });
        chart.axis('test', {
            label: {
                    textStyle: {
                              fill: '#000000'
                            }
                  },
            line:{ stroke: 'grey' }
          });
    chart.axis('time', {
        title: {
            textStyle: {
              fontSize: 12, // 文本大小
              textAlign: 'center', // 文本对齐方式
              fill: '#000000', // 文本颜色
              // ...
            }
          },
          label: {
                  textStyle: {
                            fill: '#000000'
                          }
                }
        });
    chart.tooltip(false);
    chart.line().position('time*test').color('type', chartColors).size(2.3);
    chart.line().position('time*value').color('type', chartColors).size(2.3);

    var items = {"infiniband" : "40%", "cpu" : "20%"};
    chart.legend({
          useHtml: true,
          position: 'bottom',
          reactive: true,
          spaceX: 2,
          containerTpl: '<div class="g2-legend"><div class="g2-legend-list"></div></div>',
          itemTpl: function itemTpl(value, color, checked, index) {
            var markerDom = '<div class="legend-item-marker" style="background-color:' + color + '">' + (index + 1) + '</div>';
            var nameDom = '<div class="legend-item-name">' + value + '</div>';
            var percentDom = '<div class="legend-item-percent">' + items[value] + '</div>';
            return '<div class="g2-legend-list-item">' + markerDom + nameDom + percentDom + '</div>';
          },
          'g2-legend-list-item': {
             marginRight: '0px'
           }
        });
    chart.render();
    ENV.chart = chart;

    var updateChart = function(){
        $.getJSON("stat", function(data){
            data = data.stat
            if (data.length == 0)
                return;
            index = 0;
            for(let i = 0; i < data.length / numOfType; i++){
                for(let j = 0; j < numOfType; j++){
                    data[index].time = i;
                    index ++;
                }
            }
            // index -= 1;
            // Update Current Value for each type
            for (i = 0; i < index; i++) {
                // for (j = 0; j < numOfType; j++) {
                    if (data[i].type == "cpu"){
                        // if (data[i].value > 1)
                        //     data[i].value = 1;
                        data[i].test = data[i].value / 0.6875;
                        data[i].value=undefined
                        items[data[i].type] = (data[i].test * 2200).toFixed(2) + "% / Max:2200%";
                    }
                    // items[data[i].type] = (data[i].value * 100).toFixed(2) + "%";
                    if (data[i].type == "infiniband"){
                        items[data[i].type] = (data[i].value).toFixed(2)+"MB" + " / Max:1120MB";
                    }
                    
                // }
            }
            chart.changeData(data);
      });
    };
    setInterval(updateChart, refreshInterval);
});
