$(document).ready(function(){
    var jsonPath = "load_json/runtime-infos/throughput_data.json";
    const refreshInterval = 1000; //In ms
    const numOfType = 1;         //Number of type to display
    const maxItem   = 35;        //Maximun number of item in each json file
    const chartColors = ['#5b9bd5'];
    var timelineh = $('#throughChart').height();

    var chartheight = timelineh;

    var tchart = new G2.Chart({
          container: 'throughChart',
          forceFit: true,
          height: chartheight,
          animate: false,
          padding: ["7", '18', '30', '50']
        });
    tchart.scale('time', {
            tickInterval: maxItem
          });
    tchart.scale('value', {
            max:6,
            min:0
        });
    tchart.axis('value', {
          label: {
                  textStyle: {
                            fill: '#000000'
                          }
                },
          line:{ stroke: 'grey' }
        });
    tchart.axis('time', {
          label: {
                  textStyle: {
                            fill: '#000000'
                          }
                }
        });
    tchart.tooltip(false);
    tchart.line().position('time*value').color('type', chartColors).size(2.3);

    var items = {"throughput" : "100"};
    tchart.legend({
          useHtml: true,
          position: 'top',
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
    tchart.render();
    ENV.tchart = tchart;

    var updateChart = function(){
        $.getJSON("thpt", function(data){

            data = data.stat
            if (data.length == 0)
                return;
            index = 0;
            for(let i = 0; i < data.length / numOfType; i++){
                for(let j = 0; j < numOfType; j++){
                    data[index].time = i*2;
                    index ++;
                }
            }
            // index -= 1;
            // Update Current Value for each type
            for (i = 0; i < index; i++) {
                // for (j = 0; j < numOfType; j++) {
                    // if (data[i].type == "cpu")
                        // if (data[i].value > 1)
                        //     data[i].value = 1;
                        // data[i].value = data[i].value / 1.25;
                    // items[data[i].type] = (data[i].value * 100).toFixed(2) + "%";
                    // if (data[i].type == "infiniband")
                    //     data[i].value = data[i].value / 315;
                    items[data[i].type] = data[i].value;
                // }
            }
            tchart.changeData(data);
      });
    };
    $("#throughputStart").click(
        function(){
            timestamp=0
            $.ajax({  
                type: 'POST',  
                url: "runrequest",  
                dataType: "json",  
                data: { qid: 0, 
                    mode: "thpt"},  
                async:false,  
                success: function (result) {
                    timestamp=result.timestamp
                },  
                failure: function (result) {  
                    alert("post thpt failed");  
                }  
            })
            $("#throughputStart")[0].disabled=true
            setTimeout(function (){
                $("#throughputStart")[0].disabled=false
            }, 5000)
        }
    )

    setInterval(updateChart, refreshInterval);


});
