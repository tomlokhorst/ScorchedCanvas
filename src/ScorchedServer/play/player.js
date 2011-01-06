function Player(options) {
  this.id = options.id;
  this.name = options.name;
  this.health = options.health;
  this.score = options.score;
  this.angle = options.angle;
  this.barrelAngle = options.barrelAngle;
  this.color = options.color;
  this.shape = options.shape;
  this.pos = options.pos;
  this.posy = options.posy;

  
}

Player.prototype =
{
  computeVectors : function ()
  {
    var tank = {};
    tank.center = Vector.fromCart(this.pos, this.posy)
    tank.rect = Rectangle.fromCenter(tank.center, config.tankWidth, config.tankHeight);
    tank.body = {};
    tank.body.leftTop = tank.rect.leftTop.add(config.tankGapWidth, 0);
    tank.body.rightTop = tank.rect.rightTop.add(-config.tankGapWidth, 0);
    tank.body.leftBottom = tank.rect.leftBottom;
    tank.body.rightBottom = tank.rect.rightBottom;
    tank.barrel = {};
    tank.barrel.start = tank.center;
    tank.barrel.end = tank.center.add(config.barrelLength, 0).rotate(this.barrelAngle - this.angle, tank.barrel.start);
    tank.turret = {};
    tank.turret.center = Vector.fromCart(tank.center.x, tank.rect.bottom - tank.rect.height + 1);
    tank.turret.radius = 2 * config.tankWidth / 4;
    tank.turret.startAngle = Math.PI - (Math.PI / 3.5);
    tank.turret.endAngle = 2 * Math.PI + (Math.PI / 3.5);
    tank.turret.anticlockwise = true;
    tank.health = {};
    tank.health.y = tank.rect.bottom - config.healthIndicatorBottomMargin
    tank.health.start = Vector.fromCart(tank.rect.left, tank.health.y);
    tank.health.middle = Vector.fromCart(tank.rect.left + config.tankWidth * this.health, tank.health.y);
    tank.health.end = Vector.fromCart(tank.rect.left + config.tankWidth, tank.health.y)
    if (this.id == world.me.id)
      world.me.tank = tank;

    // Rotate tank
    tank.body = vectorSpaceRotate(tank.body, this.angle, tank.center);
    tank.barrel = vectorSpaceRotate(tank.barrel, this.angle, tank.center);
    tank.turret = vectorSpaceRotate(tank.turret, this.angle, tank.center);
    tank.turret.startAngle += this.angle;
    tank.turret.endAngle += this.angle;
    tank.health = vectorSpaceRotate(tank.health, this.angle, tank.center);

    this.tank = tank;
  }
}
