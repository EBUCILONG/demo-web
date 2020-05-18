// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

(function($) {
    
  function maybeCall(thing, ctx) {
      return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
  }
  
  function Tipsy(element, options) {
      this.$element = $(element);
      this.options = options;
      this.enabled = true;
      this.fixTitle();
  }
  
  Tipsy.prototype = {
      show: function() {
          var title = this.getTitle();
          if (title && this.enabled) {
              var $tip = this.tip();
              
              $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
              $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
              $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);
              
              var pos = $.extend({}, this.$element.offset(), {
                  width: this.$element[0].offsetWidth || 0,
                  height: this.$element[0].offsetHeight || 0
              });

              // if (typeof this.$element[0].nearestViewportElement == 'object') {
                  // SVG
        var el = this.$element[0];
                  var rect = el.getBoundingClientRect();
        pos.width = rect.width;
        pos.height = rect.height;
              // }

              
              var actualWidth = $tip[0].offsetWidth,
                  actualHeight = $tip[0].offsetHeight,
                  gravity = maybeCall(this.options.gravity, this.$element[0]);
              
              var tp;
              switch (gravity.charAt(0)) {
                  case 'n':
                      tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                      break;
                  case 's':
                      tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                      break;
                  case 'e':
                      tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                      break;
                  case 'w':
                      tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                      break;
              }
              
              if (gravity.length == 2) {
                  if (gravity.charAt(1) == 'w') {
                      tp.left = pos.left + pos.width / 2 - 15;
                  } else {
                      tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                  }
              }
              
              $tip.css(tp).addClass('tipsy-' + gravity);
              $tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
              if (this.options.className) {
                  $tip.addClass(maybeCall(this.options.className, this.$element[0]));
              }
              
              if (this.options.fade) {
                  $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
              } else {
                  $tip.css({visibility: 'visible', opacity: this.options.opacity});
              }

              var t = this;
              var set_hovered  = function(set_hover){
                  return function(){
                      t.$tip.stop();
                      t.tipHovered = set_hover;
                      if (!set_hover){
                          if (t.options.delayOut === 0) {
                              t.hide();
                          } else {
                              setTimeout(function() { 
                                  if (t.hoverState == 'out') t.hide(); }, t.options.delayOut);
                          }
                      }
                  };
              };
             $tip.hover(set_hovered(true), set_hovered(false));
          }
      },
      
      hide: function() {
          if (this.options.fade) {
              this.tip().stop().fadeOut(function() { $(this).remove(); });
          } else {
              this.tip().remove();
          }
      },
      
      fixTitle: function() {
          var $e = this.$element;
          
          if ($e.attr('title') || typeof($e.attr('original-title')) != 'string') {
              $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
          }
          // if (typeof $e.context.nearestViewportElement == 'object'){                                                        
              if ($e.children('title').length){
                  $e.append('<original-title>' + ($e.children('title').text() || '') + '</original-title>')
                      .children('title').remove();
              }
          // }
      },
      
      getTitle: function() {
          
          var title, $e = this.$element, o = this.options;
          this.fixTitle();

          if (typeof o.title == 'string') {
              var title_name = o.title == 'title' ? 'original-title' : o.title;
              if ($e.children(title_name).length){
                  title = $e.children(title_name).html();
              } else{
                  title = $e.attr(title_name);
              }
              
          } else if (typeof o.title == 'function') {
              title = o.title.call($e[0]);
          }
          title = ('' + title).replace(/(^\s*|\s*$)/, "");
          return title || o.fallback;
      },
      
      tip: function() {
          if (!this.$tip) {
              this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
          }
          return this.$tip;
      },
      
      validate: function() {
          if (!this.$element[0].parentNode) {
              this.hide();
              this.$element = null;
              this.options = null;
          }
      },
      
      enable: function() { this.enabled = true; },
      disable: function() { this.enabled = false; },
      toggleEnabled: function() { this.enabled = !this.enabled; }
  };
  
  $.fn.tipsy = function(options) {
      
      if (options === true) {
          return this.data('tipsy');
      } else if (typeof options == 'string') {
          var tipsy = this.data('tipsy');
          if (tipsy) tipsy[options]();
          return this;
      }
      
      options = $.extend({}, $.fn.tipsy.defaults, options);

      if (options.hoverlock && options.delayOut === 0) {
    options.delayOut = 100;
}
      
      function get(ele) {
          var tipsy = $.data(ele, 'tipsy');
          if (!tipsy) {
              tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
              $.data(ele, 'tipsy', tipsy);
          }
          return tipsy;
      }
      
      function enter() {
          var tipsy = get(this);
          tipsy.hoverState = 'in';
          if (options.delayIn === 0) {
              tipsy.show();
          } else {
              tipsy.fixTitle();
              setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
          }
      }
      
      function leave() {
          var tipsy = get(this);
          tipsy.hoverState = 'out';
          if (options.delayOut === 0) {
              tipsy.hide();
          } else {
              var to = function() {
                  if (!tipsy.tipHovered || !options.hoverlock){
                      if (tipsy.hoverState == 'out') tipsy.hide(); 
                  }
              };
              setTimeout(to, options.delayOut);
          }    
      }

      if (options.trigger != 'manual') {
          var binder = options.live ? 'live' : 'bind',
              eventIn = options.trigger == 'hover' ? 'mouseenter' : 'focus',
              eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
          this[binder](eventIn, enter)[binder](eventOut, leave);
      }
      
      return this;
      
  };
  
  $.fn.tipsy.defaults = {
      className: null,
      delayIn: 0,
      delayOut: 0,
      fade: false,
      fallback: '',
      gravity: 'n',
      html: false,
      live: false,
      offset: 0,
      opacity: 0.8,
      title: 'title',
      trigger: 'hover',
      hoverlock: false
  };
  
  // Overwrite this method to provide options on a per-element basis.
  // For example, you could store the gravity in a 'tipsy-gravity' attribute:
  // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
  // (remember - do not modify 'options' in place!)
  $.fn.tipsy.elementOptions = function(ele, options) {
      return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
  };
  
  $.fn.tipsy.autoNS = function() {
      return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
  };
  
  $.fn.tipsy.autoWE = function() {
      return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
  };
  
  /**
   * yields a closure of the supplied parameters, producing a function that takes
   * no arguments and is suitable for use as an autogravity function like so:
   *
   * @param margin (int) - distance from the viewable region edge that an
   *        element should be before setting its tooltip's gravity to be away
   *        from that edge.
   * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
   *        if there are no viewable region edges effecting the tooltip's
   *        gravity. It will try to vary from this minimally, for example,
   *        if 'sw' is preferred and an element is near the right viewable 
   *        region edge, but not the top edge, it will set the gravity for
   *        that element's tooltip to be 'se', preserving the southern
   *        component.
   */
   $.fn.tipsy.autoBounds = function(margin, prefer) {
  return function() {
    var dir = {ns: prefer[0], ew: (prefer.length > 1 ? prefer[1] : false)},
        boundTop = $(document).scrollTop() + margin,
        boundLeft = $(document).scrollLeft() + margin,
        $this = $(this);

    if ($this.offset().top < boundTop) dir.ns = 'n';
    if ($this.offset().left < boundLeft) dir.ew = 'w';
    if ($(window).width() + $(document).scrollLeft() - $this.offset().left < margin) dir.ew = 'e';
    if ($(window).height() + $(document).scrollTop() - $this.offset().top < margin) dir.ns = 's';

    return dir.ns + (dir.ew ? dir.ew : '');
  };
  };
})(jQuery);

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

  var states = {
    

    "g": {
      description:"<B>Function:</B> Take out the graph<br><B>Route:</B> Round-Robin",
      parallel:"",
      shape:"circle",
      class:"waiting"
    },

    "V": {
      description:"<B>Function:</B> Take out the vertices stored locally<br><B>Route:</B> Round-Robin",
      parallel:"",
      shape:"circle",
      class:"waiting"
    },

    "has": {
      description:"<B>Cache:</B> FIFO<br><B>Route:</B> Round-Robin",
      parallel:"",
      shape:"circle",
      class:"waiting"
    },

    "hasLabel": {
      description:"<B>Cache:</B> FIFO<br><B>Route:</B> Round-Robin",
      parallel:"",
      shape:"circle",
      class:"waiting"
    },

    "properties":{
      description:"<B>Cache:</B> FIFO<br><B>Route:</B> Round-Robin",
      parallel:"",
      shape:"circle",
      class:"waiting"
    },

    "union":{
      description:"<B>Type:</B> Branch Spawn<br><B>Cache:</B> FIFO<br><B>Route:</B> Round-Robin",
      parallel:"",
      shape:"circle",
      class:"waiting"
    },

    "union_b":{
      description:"<B>Type:</B> Branch Barrier<br><B>Cache:</B> FIFO<br><B>Route:</B> Static (on Coordinator)",
      parallel:"",
      shape:"circle",
      class:"waiting"
    },

    "count":{
      description:"<B>Type:</B> Barrier<br><B>Cache:</B> FIFO<br><B>Route:</B> Static (on Coordinator)",
      parallel:"",
      shape:"circle",
      class:"waiting"
    },

    "out":{
      description:"<br><B>Cache:</B> FIFO<br><B>Route:</B> Round-Robin",
      parallel:"",
      shape:"circle",
      class:"waiting"
    },
    "both":{
      description:"<br><B>Cache:</B> FIFO<br><B>Route:</B> Round-Robin",
      parallel:"",
      shape:"circle",
      class:"waiting"
    }
  };

  function draw(queryid, isUpdate) {

    // var mystates={emp:"s"}
    // mystates = JSON.parse(JSON.stringify(states));
    var timestamp
    $.ajax({  
      type: 'POST',  
      url: "runrequest",  
      dataType: "json",  
      data: { qid: queryid, 
              mode: "single"},  
      async:false,  
      success: function (result) {
          timestamp=result.timestamp
      },  
      failure: function (result) {  
          alert("post single failed");  
      }  
    })

    svg = d3.select("svg");
    inner = svg.append("g");
    zoom = d3.zoom().on("zoom",function(){
        inner.attr("transform", d3.event.transform);
      });
    svg.call(zoom)

    render = new dagreD3.render();

    g = new dagreD3.graphlib.Graph();
    g.setGraph({
      nodesep: 30,
      ranksep: 50,
      // rankdir: "TD",
      marginx: 20,
      marginy: 20
    });

    // g.setNode()
    var steps=[]
    var params=[]
    var activer=[]
    var threader=[]
    // g.V().has("ori_id", "5497614562441").union(hasLabel("comment").properties("content", "creationDate"), hasLabel("post").properties("imageFile", "creationDate"))
    if(queryid == 1){
      steps=["V","has","properties"]
      params=["", "", ""]
      activer=[0,0,0]
      threader=[0,0,0]
    }

    if(queryid == 2){
      steps=["V","has","out","has"]
      params=["", "", "",""]
      activer=[0,0,0,0]
      threader=[0,0,0,0]
    }

    if(queryid == 3){
      steps=["V", "has", "both", "has"]
      params=["", "","",""]
      activer=[0,0,0,0]
      threader=[0,0,0,0]
    }

    if(queryid == 4){
      steps=["V", "out", "has", "count"]
      params=["", "", "", ""]
      activer=[0,0,0,0]
      threader=[0,0,0,0]
    }

    if(queryid == 5){
      steps=["V", "hasLabel", "union", "has", "has"]
      params=["", "","","", ""]
      activer=[0,0,0,0,0]
      threader=[0,0,0,0,0]
    }

    if(queryid == 6){
      steps=["V", "has", "union", "union", "out","out","out"]
      params=["", "","","", "","",""]
      activer=[0,0,0,0,0,0,0]
      threader=[0,0,0,0,0,0,0]
    }

    if(queryid == 7){
      steps=["V", "has", "union", "union", "out","out","out"]
      params=["", "","","", "","",""]
      activer=[0,0,0,0,0,0,0]
      threader=[0,0,0,0,0,0,0]
    }

    if(queryid == 8){
      steps=["V", "has", "union", "union", "out", "properties","out","properties","out","properties"]
      params=["", "","","", "","","","","",""]
      activer=[0,0,0,0,0,0,0,0,0,0]
      threader=[0,0,0,0,0,0,0,0,0,0]
    }


    var i;
    for (i = 0; i < steps.length; ++i) {
      // do something with `substr[i]`
      var state=steps[i]
      var value = JSON.parse(JSON.stringify(states[state]));
      if(params[i].length > 0){
        value.description=value.description+"<br><B>Param:</B>"+params[i]
      }
      else{
        value.description=value.description
      }
      value.label = i.toString() + "." +state;
      var label=value.label
      steps[i]=label
      value.rx = value.ry = 5;
      g.setNode(label, value);
    }
    // Set up the edges
    // steps=["V","has","has","has"]
    if(queryid == 1){
      g.setEdge("0.V",     "1.has",     {});
      g.setEdge("1.has", "2.properties", {});
      // g.setEdge("1.properties", "2.count", {});
    }

    if(queryid == 2){
      g.setEdge("0.V",     "1.has",     {});
      g.setEdge("1.has", "2.out", {});
      g.setEdge("2.out", "3.has", {});
    }

    if(queryid == 3){
      g.setEdge("0.V",     "1.has",     {});
      g.setEdge("1.has",   "2.both",  {});
      g.setEdge("2.both", "3.has",  {});
   
    }

    if(queryid == 4){
      g.setEdge("0.V",     "1.out",     {});
      g.setEdge("1.out", "2.has", {});
      g.setEdge("2.has",  "3.count",{});
    }

    if(queryid == 5){
      g.setEdge("0.V",     "1.hasLabel",     {});
      g.setEdge("1.hasLabel",   "2.union",  {});
      g.setEdge("2.union", "3.has",  {});
      g.setEdge("2.union", "4.has",  {});
    }

    if(queryid == 6){
      g.setEdge("0.V",     "1.has",     {});
      g.setEdge("1.has",   "2.union",  {});
      g.setEdge("2.union", "3.union",  {});
      g.setEdge("2.union", "6.out",  {});
      g.setEdge("3.union", "4.out",  {});
      g.setEdge("3.union", "5.out",  {});      
    }

    if(queryid == 7){
      g.setEdge("0.V",     "1.has",     {});
      g.setEdge("1.has",   "2.union",  {});
      g.setEdge("2.union", "3.union",  {});
      g.setEdge("2.union", "6.out",  {});
      g.setEdge("3.union", "4.out",  {});
      g.setEdge("3.union", "5.out",  {});      
    }


    if(queryid == 8){
      g.setEdge("0.V",     "1.has",     {});
      g.setEdge("1.has",   "2.union",  {});
      g.setEdge("2.union", "3.union",  {});
      g.setEdge("2.union", "8.out",  {});
      g.setEdge("8.out", "9.properties", {});
      g.setEdge("3.union", "4.out",  {});
      g.setEdge("4.out", "5.properties", {});
      g.setEdge("3.union", "6.out", {});      
      g.setEdge("6.out",  "7.properties",{});      
    }

    inner.call(render, g);
    var graphWidth = g.graph().width;
        var graphHeight = g.graph().height;
        var width = parseInt(svg.style("width").replace(/px/, ""));
        var height = parseInt(svg.style("height").replace(/px/, ""));
        var zoomScale = Math.min(width / graphWidth, height / graphHeight);
        var translateX = (width / 2) - ((graphWidth * zoomScale) / 2)
        var translateY = (height / 2) - ((graphHeight * zoomScale) / 2);
        // var svgZoom = isUpdate ? svg.transition().duration(500) : svg;
        var svgZoom = svg;
        svgZoom.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(zoomScale));

    var styleTooltipColor = function(activer, threader, name, node) {
      indexer = steps.findIndex(function(elem){return elem==name})
      active=activer[indexer]
      if(active == 0){
        node.class="waiting"
      } 
      else {
        node.class="running"
      }
    };

    var styleTooltip = function(activer, threader, name, node) {
      indexer = steps.findIndex(function(elem){return elem==name})
      active=activer[indexer]
      if(active == 0){
        node.class="waiting"
      } 
      else {
        node.class="running"
      }
      description=node.description
      return "<p class='name'>" + name + "</p><p class='description'>" + description+ "<br><B>Parallelism:</B>" + threader[indexer].toString();
    };

    var updater = setInterval(function(){
      $.getJSON("update?timestamp="+timestamp.toString(), function(data){

       // Zoom and scale to fit
        raw_activer=data.activer
        alive=data.status
       //parse the data
        for(i=0; i < activer.length; i++){
          activer[i]=0
        }
        for(i=0; i< raw_activer.length;i++){
          step_index=raw_activer[i].steps
          step_thread=raw_activer[i].threads
          activer[step_index]=1
          if(threader[step_index] < step_thread){
            threader[step_index]=step_thread
          }
        }


        inner.selectAll("g.node").attr("title", function(v) {styleTooltipColor(activer, threader,v, g.node(v)) })
        inner.call(render, g);
        var graphWidth = g.graph().width;
        var graphHeight = g.graph().height;
        var width = parseInt(svg.style("width").replace(/px/, ""));
        var height = parseInt(svg.style("height").replace(/px/, ""));
        var zoomScale = Math.min(width / graphWidth, height / graphHeight);
        var translateX = (width / 2) - ((graphWidth * zoomScale) / 2)
        var translateY = (height / 2) - ((graphHeight * zoomScale) / 2);
        // var svgZoom = isUpdate ? svg.transition().duration(500) : svg;
        var svgZoom = svg;
        svgZoom.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(zoomScale));
        if(alive==1){
        inner.selectAll("g.node").attr("title", function(v) { return styleTooltip(activer, threader,v, g.node(v)) }).each(function(v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); });
        inner.call(render, g);
        clearInterval(updater)
        }
        // svgZoom.call(zoom.transform, d3.zoomIdentity.scale(zoomScale));
      });
    }, 100)
  }


  $("#singleQStart").click(
    function(){
      $("#innerSVG")[0].innerHTML=''
      // query=document.getElementByClassName("text").value
      // query=$(".text").value
      // console.log(query)
      // console.log($("#queryContent"))
      select=$("#dropdown")
      Qquery=select[0].innerText.toString()
      queryid=parseInt(Qquery.substr(1))
      if(query != "Select Query"){
        $("#originalQuery")[0].innerHTML=queries[queryid]
        draw(queryid, true)
      }
    }
  )

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


