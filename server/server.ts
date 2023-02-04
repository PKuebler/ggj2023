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

interface mapRoom {
	workers: [];
	resources: [];
	type: string;
	level: number;
	position: Position;
}

interface Rooms {
	[key:string]: Room;
}

interface Config {
	rooms: Rooms;
}

interface 

type Entry<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T];

function filterObject<T extends object>(
	obj: T,
	fn: (entry: Entry<T>, i: number, arr: Entry<T>[]) => boolean,
) {
	return Object.fromEntries(
		(Object.entries(obj) as Entry<T>[]).filter(fn),
	) as Partial<T>;
}

// Game-Loop
function gameLoop() {
	buildRoom("kitchen", { x: 2, y: 2 });
	map.rooms.forEach((element) => {
		console.log(element);
		if (element.workers.length > 0) {
			element.workers.forEach((worker) => {
				console.log(worker);
				//worker.work();
			});
		}
	});
}

function buildRoom(room: string, position: Position) {
	console.log(config.rooms[room])
}

let loop = setInterval(gameLoop, 1000);

let config = {
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

let map = {
	rooms: [
		{
			workers: [],
			resources: [
				{
					name: "wood",
					size: 10,
				},
				{
					name: "mushroom",
					size: 10,
				},
			],
			type: "mushroom-nursery",
			level: 1.0,
			position: {
				x: 2,
				y: 2,
			},
		},
		{
			workers: [],
			resources: [
				{
					name: "cooked-mushroom",
					size: 10,
				},
			],
			type: "kitchen",
			level: 1.0,
			position: {
				x: 3,
				y: 3,
			},
		},
		{
			workers: [],
			resources: [
				{
					name: "stone",
					size: 10,
				},
			],
			type: "quarry",
			level: 1.0,
			position: {
				x: 4,
				y: 4,
			},
		},
	],
};
