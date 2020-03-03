function tick() {
  graphEnv.svg.selectAll('circle')
    .attr('cx', (d,i)=>d.x)
    .attr('cy', (d,i)=>d.y);
  graphEnv.svg.selectAll('line')
    .attr('x1', (d,i)=>d.source.x)
    .attr('y1', (d,i)=>d.source.y)
    .attr('x2', (d,i)=>d.target.x)
    .attr('y2', (d,i)=>d.target.y);
}
function dragstarted(d, force) {
  if (!d3.event.active) force.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}
function dragended(d, force) {
  if (!d3.event.active) force.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
function makeNodeLine(id_list, label_list, conn_list) {
  let nodes = [], edges = [];
  for(let i=0; i < id_list.length; ++ i) {
    if(typeof(label_list) == "undefined")
      nodes.push({id:id_list[i]});
    else
      nodes.push({id:id_list[i], label: label_list[i]});
  }
  for(let i=0; i < conn_list.length; ++ i) {
    edges.push({"source": conn_list[i][0], "target":conn_list[i][1]});
  }
  return [nodes, edges];
}
function makeNormalForce(nodes, edges) {
  var force = d3.forceSimulation()
        .force('forcex', d3.forceX().x(graphEnv.mw/2))
        .force('forcey', d3.forceY().y(graphEnv.mh/2))
        .nodes(nodes)
        .force('body', d3.forceManyBody().strength(-90))
        .force('link', d3.forceLink(edges).id((d)=>d.id).distance(0.4 * Math.min(graphEnv.mh, graphEnv.mw)));
  return force;
}
function bindAndAlign(circles, nodes, lines, edges) {
  updatelines = lines.data(edges);
  updatelines.exit().remove();
  updatelines.enter().append('line');
  
  circles = circles.data(nodes);
  circles.enter().append('circle').append('title');
  circles.exit().remove();
}
function bindAndAlignFco(circles, nodes, lines, edges) {
  lines = lines.data(edges);
  lines.exit().remove();
  lines.enter().append('line').append('title');
  
  circles = circles.data(nodes);
  circles.enter().append('circle').append('title');
  circles.exit().remove();
}


function stylizeNormalGraph() {
  var lines = graphEnv.svg.selectAll('line'),
      circles = graphEnv.svg.selectAll('circle');

  circles.call(d3.drag()
       .on('start', function(d){dragstarted(d, graphEnv.force);})
       .on('drag', dragged)
       .on('end', function(d){dragended(d, graphEnv.force);}))
    .on('contextmenu', d3.contextMenu(node_menu()))
    .attr('r', 0.02 * Math.min(graphEnv.mh, graphEnv.mw));
  
  if(ENV.apps === "gm")
    circles.style('fill', (d,i)=> graphEnv.colorScale(d.label));
  else
    circles.style('fill', (d,i)=> graphEnv.colorScale(d.id%24));

  circles.select("title").text((d)=>{
    let a = "";
    if(typeof d.id !== "undefined")
      a = "id: "+d.id;
    if(typeof d.label !== "undefined")
      a = a + '\nlabel: '+ d.label;
    return a;
  });

  lines.style('stroke', 'black').style('stroke-width', 2)
    .on('contextmenu', d3.contextMenu(edge_menu));
}

function stylizeMcGraph() {
  var lines = graphEnv.svg.selectAll('line'),
      circles = graphEnv.svg.selectAll('circle');
  lines.style('stroke', 'rgba(0,0,0,0.05)').style('stroke-width', 0.8);
  
  circles.call(d3.drag()
       .on('start', function(d){dragstarted(d, graphEnv.force);})
       .on('drag', dragged)
       .on('end', function(d){dragended(d, graphEnv.force);}))
    .style('fill', (d, i)=> d3.interpolateYlGnBu(-graphEnv.lineLinear(i)))
    .attr('r', 0.01 * Math.min(graphEnv.mh, graphEnv.mw));

  circles.select("title").text((d)=>{
    let a = "";
    if(typeof d.id !== "undefined")
      a = "id: "+d.id;
    if(typeof d.label !== "undefined")
      a = a + '\nlabel: '+ d.label;
    return a;
  });
}

function stylizeFcoGraph() {
  var lines = graphEnv.svg.selectAll('line'),
      circles = graphEnv.svg.selectAll('circle');

  lines.style('stroke', d=>d3.interpolateYlGnBu(graphEnv.lineLinear(d.weight)))
    .style('stroke-width', d=>graphEnv.lineLinear(d.weight) * 5 + 2)
    .on('contextmenu', d3.contextMenu(edge_menu));
  lines.select('title').text((d)=>"edge weight: "+d.weight);
  
  circles.call(d3.drag()
       .on('start', function(d){dragstarted(d, graphEnv.force);})
       .on('drag', dragged)
       .on('end', function(d){dragended(d, graphEnv.force);}))
    .on('contextmenu', d3.contextMenu(node_menu()))
    .style('fill', "rgba(190,186,186,0.7)")
    .attr('r', 0.02 * Math.min(graphEnv.mh, graphEnv.mw));
  
  circles.select("title").text((d)=>{
    let a = "";
    if(typeof d.id !== "undefined")
      a = "id: "+d.id;
    if(typeof d.label !== "undefined")
      a = a + '\nlabel: '+ d.label;
    return a;
  });
}

function resumeTaskGraphNote(state) {
  $('#graphnote table').append(
    ['<tr><td>resume status: <span id="resumeState">', state,'</span></td></tr>'].join(''));
}
/* ---------------------------- render functions --------------------- */
function rendertcGraph(taskRes) {
  var {subg_list, label_list, conn_list, count, task_id="0", seed_id="0"} = taskRes;
  var [nodes, edges] = makeNodeLine(subg_list, label_list, conn_list);
  var svg = graphEnv.svg = d3.select('#maingraph');
  var force = graphEnv.force = makeNormalForce(nodes, edges);
  bindAndAlign(svg.selectAll("circle"), nodes, svg.selectAll('line'), edges);
  stylizeNormalGraph();

  force.on('tick', tick);

  if($('#graphnote>h4').length === 0){
    $('#graphnote').append('<h4>Real-time TC Task Sample</h4>');
    $('#graphnote').append('<table></table>');
    $('#graphnote table').append(
      ['<tr><td>task id: <span id="taskId">', task_id,'</span></td></tr>'].join(''));
    $('#graphnote table').append(
      ['<tr><td>seed id: <span id="seedId">', seed_id,'</span></td></tr>'].join(''));
    $('#graphnote table').append(
      ['<tr><td>task triangle count: <span id="tccount">', count,'</span></td></tr>'].join(''));
  }else{
    $('#taskId').text(task_id);
    $('#seedId').text(seed_id);
    $('#tccount').text(count);
  }
  $('#graphnote').show();
}
function rendergmGraph(taskRes) {
  var {subg_list, label_list, conn_list, count, task_id="0", seed_id="0"} = taskRes;
  var [nodes, edges] = makeNodeLine(subg_list, label_list, conn_list);
  var svg = graphEnv.svg = d3.select('#maingraph');
  var force = graphEnv.force = makeNormalForce(nodes, edges);
  bindAndAlign(svg.selectAll("circle"), nodes, svg.selectAll('line'), edges);
  stylizeNormalGraph();
  force.on('tick', tick);
 
  if($('#graphnote>h4').length === 0){
    $('#graphnote').append('<h4>Real-time GM Task Sample</h4>');
    $('#graphnote').append('<table></table>');
    $('#graphnote table').append(
      ['<tr><td>task id: <span id="taskId">', task_id,'</span></td></tr>'].join(''));
    $('#graphnote table').append(
      ['<tr><td>seed id: <span id="seedId">', seed_id,'</span></td></tr>'].join(''));
    $('#graphnote table').append(
      ['<tr><td>task matched pattern count: <span id="gmcount">', count,'</span></td></tr>'].join(''));
  }else{
    $('#taskId').text(task_id);
    $('#seedId').text(seed_id);
    $('#gmcount').text(count);
  }
  $('#graphnote').show();
}
function rendermcGraph(taskRes) {
  var {size, count}  = taskRes; 
  var lineLinear = graphEnv.lineLinear = d3.scaleLinear();
  lineLinear.domain([0, size]).range([-0.7,-0.3]);

  if($('#graphnote>h4').length === 0){
    $('#graphnote').append('<h4>Real-time Max Clique</h4>');
    $('#graphnote').append('<table></table>');
    $('#graphnote table').append(
      ['<tr><td>max clique size: <span id="mcsize">', size,'</span></td></tr>'].join(''));
    $('#graphnote table').append(
      ['<tr><td>max clique count: <span id="mccount">', count,'</span></td></tr>'].join(''));
  }else{
    $('#mcsize').text(size);
    $('#mccount').text(count);
  }
  $('#graphnote').show();

  var raw_node = taskRes["mc"][0];
  var nodes = []
  var edges = []
  for(let i=0; i < raw_node.length; ++ i){
    nodes.push({id: raw_node[i]});
    for(let j=i + 1; j < raw_node.length; ++j){
      edges.push({"source": raw_node[i], "target": raw_node[j]});
    }
  }
  
  var svg = graphEnv.svg = d3.select('#maingraph');
  var wind = Math.min(graphEnv.mh, graphEnv.mw);
  var force = graphEnv.force = makeNormalForce(nodes, edges);
  force.force('link').distance(0.5 * wind);
    
  bindAndAlign(svg.selectAll("circle"), nodes, svg.selectAll('line'), edges);
  stylizeMcGraph();
  force.on('tick',tick); 
}
function rendercdGraph(taskRes) {
  var {subg_list, label_list, conn_list, subg_size, task_id="0", seed_id="0"} = taskRes;
  var [nodes, edges] = makeNodeLine(subg_list, label_list, conn_list);
  var svg = graphEnv.svg = d3.select('#maingraph');
  var force = graphEnv.force = makeNormalForce(nodes, edges);
  
  bindAndAlign(svg.selectAll("circle"), nodes, svg.selectAll('line'), edges);
  stylizeNormalGraph();

  force.on('tick', tick);
  
  if($('#graphnote>h4').length === 0){
    $('#graphnote').append('<h4>Real-time CD Task Sample</h4>');
    $('#graphnote').append('<table></table>');
    $('#graphnote table').append(
      ['<tr><td>task id: <span id="taskId">', task_id,'</span></td></tr>'].join(''));
    $('#graphnote table').append(
      ['<tr><td>seed id: <span id="seedId">', seed_id,'</span></td></tr>'].join(''));
    $('#graphnote table').append(
      ['<tr><td>community size: <span id="cdsize">', subg_size,'</span></td></tr>'].join(''));
  }
  else{
    $('#taskId').text(task_id);
    $('#seedId').text(seed_id);
    $('#cdsize').text(subg_size);
  }
  $('#graphnote').show();
}
function renderfcoGraph(taskRes) {
  var lineLinear = graphEnv.lineLinear = d3.scaleLinear();
  
  var {subg_list, label_list, conn_weight, conn_list, subg_size, task_id="0", seed_id="0"} = taskRes;
  var [nodes, edges] = makeNodeLine(subg_list, label_list, conn_list);
  for(let i = 0; i < conn_weight.length; ++ i){
    edges[i].weight = conn_weight[i];
  }
  var svg = graphEnv.svg = d3.select('#maingraph');
  var force = graphEnv.force = makeNormalForce(nodes, edges);

  var min_weight = Math.min(...conn_weight), max_weight = Math.max(...conn_weight);
  lineLinear.domain([min_weight, max_weight + 0.0001]).range([0.3,0.7]);

  bindAndAlignFco(svg.selectAll("circle"), nodes, svg.selectAll('line'), edges);
  stylizeFcoGraph();

  force.on('tick',tick); 

  if($('#graphnote>h4').length === 0){
    $('#graphnote').append('<h4>Real-time FCO Task Sample</h4>');
    $('#graphnote').append('<table></table>');
    $('#graphnote table').append(
      ['<tr><td>task id: <span id="taskId">', task_id,'</span></td></tr>'].join(''));
    $('#graphnote table').append(
      ['<tr><td>seed id: <span id="seedId">', seed_id,'</span></td></tr>'].join(''));
    $('#graphnote table').append(
      ['<tr><td>cluster size: <span id="fcosize">', subg_size,'</span></td></tr>'].join(''));
  }
  else{
    $('#taskId').text(task_id);
    $('#seedId').text(seed_id);
    $('#fcosize').text(subg_size);
  }
  $('#graphnote').show();
}
// draw ground truth pattern
function makeGmPattern(svg) {
  var gt_nodes = [
    {name: "a", cx: 47.52, cy:48.59},
    {name: "b", cx: 33.44, cy: 75.08},
    {name: "c", cx: 63.43, cy: 74.02},
    {name: "b", cx: 49.25, cy: 100.46},
    {name: "d", cx: 50.13, cy: 130.44}];
  var gt_edges = [
    {"source": 0, "target": 1}, {"source": 0, "target": 2},
    {"source": 1, "target": 2}, {"source": 2, "target": 3},
    {"source": 3, "target": 4}];
  
  var ls = svg.append("g").selectAll("line").data(gt_edges).enter().append('line')
    .style('stroke', 'black').style('stroke-width', 2)
    .attr('x1', (d,i)=>gt_nodes[d["source"]].cx)
    .attr('y1', (d,i)=>gt_nodes[d["source"]].cy)
    .attr('x2', (d,i)=>gt_nodes[d["target"]].cx)
    .attr('y2', (d,i)=>gt_nodes[d["target"]].cy);
  var cirs = svg.append("g").selectAll("circle").data(gt_nodes).enter().append('circle').attr('r', 10)
    .style('fill', (d, i)=> graphEnv.colorScale(d.name))
    .attr('cx', (d, i)=> d.cx).attr('cy', (d,i)=>d.cy)
  cirs.append('title').text((d)=>d.name);
}

function renderGraphVisualize(taskRes) {
  if(typeof(taskRes) == "undefined" || taskRes.length === 0) return;

  if(taskRes.task_id === -1) return;

  if (ENV.current_status == 2) {
    ENV.current_status = 3;
    $('#pauseButton').removeClass('disabled');
  }

  $('#graphPanel .dimmer').removeClass('active');

  console.log('graph visual: ', taskRes);
  if(taskRes["status"] === "empty"){
    resumeTaskGraphNote("No result was generated.");
    return;
  }
  else if(taskRes["status"] === "resume"){
    resumeTaskGraphNote("Get new result");
    d3.select('#maingraph').selectAll('*').remove();
  }
  else{
    ENV.removed_edges = ENV.removed_nodes = undefined;
    ENV.seed_id = taskRes['seed_id'];
    d3.select('#maingraph').selectAll('*').remove();
  }

  if (ENV.apps === "tc"){
    rendertcGraph(taskRes);
  }
  else if (ENV.apps === "mc"){
    rendermcGraph(taskRes);
  }
  else if (ENV.apps === "gm"){
    rendergmGraph(taskRes);
  }
  else if (ENV.apps === "cd"){
    rendercdGraph(taskRes);
  }
  else if (ENV.apps === "fco"){
    renderfcoGraph(taskRes);
  }
}



/* ----------------------- */
$(document).ready(function() {

  var workers = {
    "V()": {
      "consumers": 2,
      "count": 20
    },
    "has([\"name\",neq(\"Tom\")],[\"age\", eq(20)])": {
      "consumers": 2,
      "inputQueue":  "V()",
      "stage": "running"
    },
    "and(spawn)": {
      "consumers": 2,
      "inputQueue": "has([\"name\",neq(\"Tom\")],[\"age\", eq(20)])"
    },
    "in(\"created\").count().is(2)": {
      "consumers": 2,
      "inputQueue": "and(spawn)"
    },
    "out(\"knows\").has(\"name\",\"Tom\")": {
      "consumers": 0,
      "inputQueue": "and(spawn)"
    },
    "and(merge)": {
      "consumers": 0,
      "inputQueue": "out(\"knows\").has(\"name\",\"Tom\")?in(\"created\").count().is(2)"
    }
  };

  var svg = d3.select("#dagre");
  var inner = svg.select("#dagreg");
  var zoom = d3.zoom().on("zoom",function(){
        inner.attr("transform", d3.event.transform);
      });
  svg.call(zoom)

  var render = new dagreD3.render();

  var g = new dagreD3.graphlib.Graph();
  g.setGraph({
    nodesep: 20,
    ranksep: 20,
    // rankdir: "TD",
    marginx: 20,
    marginy: 20
  });

  function draw(isUpdate) {
    for (var id in workers) {
      var worker = workers[id];

      var className = worker.consumers ? "running" : "stopped";
      var html = "<div>";
      html += "<span class=status></span>";
      // html += "<span class=consumers>"+worker.consumers+"</span>";
      html += "<span class=name>" + id + "</span>";
      // html += "<span class=queue><span class=counter>"+worker.count+"</span></span>";
      html += "</div>";
      g.setNode(id, {
        labelType: "html",
        shape : "circle",
        label: html,
        rx: 5,
        ry: 5,
        padding: 0,
        class: className
      });
      if (worker.inputQueue) {
        res = worker.inputQueue.split("?")
        for (var ids in res){
          console.log(res[ids])
          g.setEdge(res[ids], id, {
            // label: id,
            width: 20
          });
        }
      }
    }
    inner.call(render, g);
    // Zoom and scale to fit
    var graphWidth = g.graph().width;
    var graphHeight = g.graph().height;
    var width = parseInt(svg.style("width").replace(/px/, ""));
    var height = parseInt(svg.style("height").replace(/px/, ""));
    var zoomScale = Math.min(width / graphWidth, height / graphHeight);
    var translateX = (width / 2) - ((graphWidth * zoomScale) / 2)
    var translateY = (height / 2) - ((graphHeight * zoomScale) / 2);
    // var svgZoom = isUpdate ? svg.transition().duration(500) : svg;
    var svgZoom = svg;
    // svgZoom.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(zoomScale));
    svgZoom.call(zoom.transform, d3.zoomIdentity.scale(zoomScale));
  }

  draw(true)

  // setInterval(function() {
  //   var stoppedWorker1Count = workers["Is()"].count;
  //   var stoppedWorker2Count = workers["And()"].count;
  //   for (var id in workers) {
  //     workers[id].count = Math.ceil(Math.random() * 3);
  //     if (workers[id].inputThroughput) workers[id].inputThroughput = Math.ceil(Math.random() * 250);
  //   }
  //   workers["Is()"].count = stoppedWorker1Count + Math.ceil(Math.random() * 100);
  //   workers["And()"].count = stoppedWorker2Count + Math.ceil(Math.random() * 100);
  //   draw(true);
  // }, 1000);
  // // Do a mock change of worker configuration
  // setInterval(function() {
  //   workers["Agre()"] = {
  //     "consumers": 0,
  //     "count": 0,
  //     "inputQueue": "Aggregate()",
  //     "inputThroughput": 50
  //   }
  // }, 5000);
  // // Initial draw, once the DOM is ready
  // document.addEventListener("DOMContentLoaded", draw);
});


