// Hier Typescript-Code einfügen
interface Position {
	x: number;
	y: number;
}

interface Costs {
	wood: number;
	stone: number;
}

interface Room {
	spriteName: string;
	width: number;
	costs: Costs;
	time: number;
}

interface WorkerT {
	name: string;
	hunger: number;
	thirst: number;
	position: Position;
}

interface mapRoom {
	workers: string[];
	resources: Resources;
	type: string;
	level: number;
	position: Position;
}

interface Resources {
	wood?: number;
	stone?: number;
	mushroom?: number;
	cookedMushroom?: number;
	waterBucket?: number;
}

interface Rooms {
	[key: string]: Room;
}

interface MapT {
	rooms: mapRoom[];
}

interface Config {
	rooms: Rooms;
}
// Game-Loop
function gameLoop() {
	map.rooms.forEach((room) => {
		if (room.workers.length > 0) {
			room.workers.forEach((worker) => {
				room.type === "mushroom_nursery" && mushroom_nursery(room);
				room.type === "kitchen" && kitchen(room);
				room.type === "quarry" && quarry(room);
				if(room.type === "mushroom_nursery" || room.type === "kitchen" || room.type === "quarry")
				{
					let useWorker = workers.filter((workerT) => workerT.name === worker)[0];
					useWorker.hunger += 0.1;
					useWorker.thirst += 0.1;
					if(useWorker.hunger > 1 || useWorker.thirst > 1) {
						console.log("Worker is dead");
						moveWorker(useWorker, { x: 0, y: 0 });
						workers = workers.filter((workerT) => workerT.name !== worker);
					}
				}
				if(room.type === "lunchroom")
				{
					let useWorker = workers.filter((workerT) => workerT.name === worker)[0];
					if(typeof resources.cookedMushroom !== "undefined" && resources.cookedMushroom > 0 && useWorker.hunger > 0.5) {
						useWorker.hunger -= 0.5;
						resources.cookedMushroom -= 1;
					}
					if(typeof resources.waterBucket !== "undefined" && resources.waterBucket > 0 && useWorker.thirst > 0.5) {
						useWorker.thirst -= 0.5;
						resources.waterBucket -= 1;
					}
				}
			});
		}
	});
	console.log(workers, resources);
}

// room functions
function mushroom_nursery(room: mapRoom) {
	if (typeof resources.mushroom === "undefined") {
		resources.mushroom = 1 * room.level;
	}
	resources.mushroom += 1 * room.level;
	if (typeof resources.wood === "undefined") {
		resources.wood = 1 * room.level;
	}
	resources.wood += 1 * room.level;
}

function kitchen(room: mapRoom) {
	if (typeof resources.cookedMushroom === "undefined" && typeof resources.mushroom !== "undefined" && resources.mushroom > 0) {
		resources.cookedMushroom = 1 * room.level;
		resources.mushroom -= 1 * room.level;
	}
	else if (typeof resources.cookedMushroom !== "undefined" && typeof resources.mushroom !== "undefined" && resources.mushroom > 0) {
		resources.cookedMushroom += 1 * room.level;
		resources.mushroom -= 1 * room.level;
	}
	// Nope
}

function quarry(room: mapRoom) {
	if (typeof resources.stone === "undefined") {
		resources.stone = 1 * room.level;
	}
	resources.stone += 1 * room.level;
}

// Remove Room
function removeRoom(position: Position) {
	map.rooms.forEach((room, index) => {
		if (room.position.x === position.x && room.position.y === position.y) {
			map.rooms.splice(index, 1);
		}
	});
}

// Bewege Worker
function moveWorker(worker: WorkerT, position: Position) {
	worker.position = position;
	map.rooms.forEach((room) => {
		if (room.position.x === Math.floor(position.x) && room.position.y === Math.floor(position.y)) {
			if(!room.workers.includes(worker.name))
				room.workers.push(worker.name);
		}
		else {
			room.workers.forEach((workerName, index) => {
				if (workerName === worker.name) {
					room.workers.splice(index, 1);
				}
			});
		}
	});
}

// Baue einen Raum
function buildRoom(room: string, position: Position) {
	if (
		typeof resources.wood !== "undefined" &&
		config.rooms[room].costs.wood >= resources.wood
	) {
		console.log(
			`Not enough wood for ${room} at position X:${position.x} Y:${position.y}`,
		);
		return false;
	}
	if (
		typeof resources.stone !== "undefined" &&
		config.rooms[room].costs.stone >= resources.stone
	) {
		console.log(
			`Not enough stone for ${room} at position X:${position.x} Y:${position.y}`,
		);
		return false;
	}
	if (
		typeof resources.wood !== "undefined" &&
		typeof resources.stone !== "undefined"
	) {
		resources.wood -= config.rooms[room].costs.wood;
		resources.stone -= config.rooms[room].costs.stone;
	}
	map.rooms.push({
		workers: [],
		resources: {},
		type: room,
		level: 1.0,
		position: position,
	});
	return true;
}
// Game Loop Starten (1000ms)
let loop = setInterval(gameLoop, 500);

// Initialisierung
let resources: Resources = {
	wood: 10,
	stone: 10,
};

let config: Config = {
	rooms: {
		kitchen: {
			spriteName: "",
			width: 3,
			costs: {
				wood: 2,
				stone: 3,
			},
			time: 10,
		},
	},
};

let workers: WorkerT[] = [
	{
		name: "Dieter",
		hunger: 0.1,
		thirst: 0.1,
		position: {
			x: 1,
			y: 1,
		},
	},
];

let map: MapT = {
	rooms: [
		{
			workers: [],
			resources: {
				wood: 10,
				mushroom: 10,
			},
			type: "mushroom_nursery",
			level: 1.0,
			position: {
				x: 2,
				y: 2,
			},
		},
		{
			workers: [],
			resources: {
				cookedMushroom: 10,
			},
			type: "kitchen",
			level: 1.0,
			position: {
				x: 3,
				y: 3,
			},
		},
		{
			workers: [],
			resources: {
				stone: 10,
			},
			type: "quarry",
			level: 1.0,
			position: {
				x: 4,
				y: 4,
			},
		},
	],
};
