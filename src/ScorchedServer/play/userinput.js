/*

draws the aim UI.
handles the mouse events for aiming (mousemove) and firing (mouseup)

*/

var UI = {
  canvas: null,
  socket: null,
  modes : ["wait", "aim"],
  currentMode: "wait",
  
  init: function(canvas, socket) {
    UI.canvas = canvas;
    UI.socket = socket;

    // registering events on canvas to prevent stealing events on the name input box
    $(canvas).bind("mousemove", UI.aim);
    $(canvas).bind("touchmove", UI.aim);
    $(canvas).bind("mouseup", UI.fire);
    $(canvas).bind("touchend", UI.fire);
    $(canvas).bind("mousedown", UI.startAim);
    $(canvas).bind("touchstart", UI.startAim);

  },
  
  // get the x,y coords relative to the canvas, in canvas pixels, corrected for css scaling
  getCanvasCoord: function(evt) {
    // get coords relative to the page
    var pageX, pageY;
    
    // check if we're on a touch device
    var touches = evt.originalEvent.touches;
    if (touches && touches.length) {
      pageX =  touches[0].pageX;
      pageY =  touches[0].pageY;
    }
    else {
      pageX = evt.pageX;
      pageY = evt.pageY;
    }
    
    // correct for:
    // 1. the offset of the canvas element
    // 2. screen pixels vs canvas pixels (there is a difference when the canvas is scaled using css)
    var c = $(UI.canvas);
    var offset = c.offset();
    var hor_ratio = c.attr("width") / c.width();
    var vert_ratio = c.attr("height") / c.height();
    
    var canvasX = hor_ratio * (pageX-offset.left);
    var canvasY = config.screenSize.height - vert_ratio * (pageY-offset.top);
    
    return { x:canvasX, y:canvasY };
  },
  
  startAim: function(evt) {
    world.guiAim = true;
    UI.aim(evt);
  },
  
  // update aiming
  aim: function(evt) {      
    evt.preventDefault();
        
    var pos = UI.getCanvasCoord(evt);
            
    world.guiPoint = pos;
    
    var dx = pos.x - world.me.pos;
    var dy = pos.y - world.me.posy;

    world.guiAngle = Math.atan2(dy, dx);
    world.guiPower = Math.sqrt( dx*dx + dy*dy ) / 100;
  },
  
  // calculate angle / power from current aim
  fire: function(evt) {
    evt.preventDefault();
    if (world.gameover) return;
    world.guiAim = false;
    //console.log("fire");
    UI.socket.send({
      type : 'fireRequest',
      angle : world.guiAngle,
      barrelAngle : world.guiAngle,
      power : world.guiPower,
      weaponType : 'cannon'
    });
  },
};
