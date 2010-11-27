// Only internal representation. Doesn't get sent around.
var world = {
	landscape: [],
	players: [],
	me: {},
	bullets: [],
	explosions: [],
	playerId: null,
	bullets: [],
	guiAim : false,
	guiAngle: 45,
	guiPower: 10,
	guiPoint: { x:0, y:0 },
	nextRound: null,
	gameover: false
};
