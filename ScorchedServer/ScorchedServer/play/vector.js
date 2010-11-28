function Vector(x, y) {
	this.x = x;
	this.y = y;

	this.add = function(that, factor) {
		if (factor === undefined) {
			factor = 1;
		}
		return new Vector(this.x + that.x * factor, this.y + that.y * factor);
	}

	this.scale = function(factor) {
		return new Vector(x * factor, y * factor);
	}
}

Vector.fromPolar = function(th, r) {
	return Vector.fromCart(Math.cos(th) * r, Math.sin(th) * r);
};

Vector.fromCart = function(x, y) {
	return new Vector(x, y);
};

Vector.origin = Vector.fromCart(0, 0);