/*

draws the aim UI.
handles the mouse events for aiming (mousemove) and firing (mouseup)

*/

var UI = {
  
  centerx: 0,
  centery: 0,
  canvas: null,
  modes : ["wait", "aim"],
  currentMode: "wait",
  
  init: function(canvas) {
    UI.canvas = canvas;
    UI.centerx = config.screenSize.width/2;
    UI.centery = config.screenSize.height/2;
    $(canvas).bind("mousemove", UI.aim);
    $(canvas).bind("mouseup", UI.fire);
  },
    
  // update aiming
  aim: function(evt) {      
    var offset = $(UI.canvas).offset();
    
    UI.aim = { 
      x : evt.pageX - offset.left,
      y : -(evt.pageY - offset.top) 
    }
    
    var x = UI.aim.x;
    var y = UI.aim.y;
    
    var angle = world.UIAngle = Math.atan2( y,x );
    var power = world.UIPower = Math.sqrt( x*x + y*y );
    world.UIPoint = { x:x, y:y };
    
    
    //console.log(evt.pageY, offset.top)
    console.log("aim: " + x + "," + y);
    console.log("angle: " + angle + ", power:" + power);
  },
  
  // calculate angle / power from current aim
  fire: function(evt) {
    console.log("fire");
  },
};