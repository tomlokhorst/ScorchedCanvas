/*

draws the aim UI.
handles the mouse events for aiming (mousemove) and firing (mouseup)

*/

var UI = {
  centerx: 0,
  centery: 0,
  canvas: null,
  socket: null,
  modes : ["wait", "aim"],
  currentMode: "wait",
  
  init: function(canvas, socket) {
    UI.canvas = canvas;
    UI.socket = socket;
    UI.centerx = config.screenSize.width/2;
    UI.centery = config.screenSize.height/2;
    $(canvas).bind("mousemove", UI.aim);
    $(canvas).bind("touchmove", UI.aim);
    $(canvas).bind("mouseup", UI.fire);
    $(canvas).bind("touchend", UI.fire);
    $(canvas).bind("mousedown", UI.startAim);
    $(canvas).bind("touchstart", UI.startAim);
  },
    
  startAim: function(evt) {

    evt.preventDefault();
    world.guiAim = true;
    
    if (evt.touches && evt.touches.length)
    {
      var xpos = evt.touches[0].pageX;
      var ypos =  evt.touches[0].pageY;
    }
    else
    {
      var xpos = evt.pageX;
      var ypos =  evt.pageY;
    }
    $("#log").html(xpos + "," + ypos);
  },
  
  // update aiming
  aim: function(evt) {      
    evt.preventDefault();
    var offset = $(UI.canvas).offset();
    
    var xpos, ypos;
    if (evt.touches && evt.touches.length) {
      xpos = evt.touches[0].pageX;
      ypos =  evt.touches[0].pageY;
    }
    else {
      xpos = evt.pageX;
      ypos =  evt.pageY;
    }
    
    var x = xpos - offset.left;
    var y = config.screenSize.height - (ypos - offset.top);
    world.guiPoint = { x:x, y:y };
    
    var centerx = config.screenSize.width/2;
    var dx = x - centerx;
    world.guiAngle = Math.atan2(y, dx);
    world.guiPower = Math.sqrt( dx*dx + y*y ) / 100;
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
		power : world.guiPower,
		weaponType : 'cannon'
	});
  },
};