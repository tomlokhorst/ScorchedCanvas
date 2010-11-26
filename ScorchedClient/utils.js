function rgba(r,g,b,a)
{
  return "rgba(" + ~~r + "," + ~~g + "," + ~~b + "," + (a === undefined ? 1 : a)  + ")";
}

function assert(expr, msg)
{
	if (expr) {
		throw msg;
	}
}