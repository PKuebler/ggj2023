export type Position = {
	x: number;
	y: number;
};

type Costs = {
	wood: number;
	stone: number;
};

export type Sprite = {
	x: number;
	y: number;
};

export type RoomConfig = {
	sprites: Sprite[];
	uiButton: Sprite;
	uiDisabledButton: Sprite;
	width: number;
	costs: Costs;
	time: number;
	type: string;
};

export interface WorkerT {
	name: string;
	hunger: number;
	thirst: number;
	position: Position;
}

interface Resources {
	wood: number;
	stone: number;
	mushroom: number;
	cookedMushroom: number;
	waterBucket: number;
}

export type MapRoom = {
	workers: string[];
	resources: Resources;
	type: string;
	level: number;
	position: Position;
};

type Rooms = {
	[key: string]: RoomConfig;
};

interface MapT {
	rooms: MapRoom[];
}

type Config = {
	rooms: Rooms;
};

export class Game {
	_resources: Resources = {
		wood: 10,
		stone: 10,
		mushroom: 10,
		cookedMushroom: 10,
		waterBucket: 10,
	};
	_workers: WorkerT[] = [
		{ name: "Dieter", hunger: 0, thirst: 0, position: { x: 2, y: 2 } },
	];
	map: MapT = {
		rooms: [
			{
				workers: [],
				resources: {
					wood: 10,
					stone: 0,
					mushroom: 10,
					cookedMushroom: 0,
					waterBucket: 0,
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
					stone: 0,
					wood: 0,
					mushroom: 0,
					cookedMushroom: 10,
					waterBucket: 0,
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
					wood: 10,
					mushroom: 10,
					cookedMushroom: 0,
					waterBucket: 0,
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
	_config: Config = {
		rooms: {
			kitchen: {
				sprites: [
					{ x: 2, y: 0 },
					{ x: 3, y: 0 },
				],
				uiButton: { x: 4, y: 0 },
				uiDisabledButton: { x: 8, y: 0 },
				width: 2,
				costs: {
					wood: 2,
					stone: 3,
				},
				time: 10,
				type: "kitchen",
			},
			mushroom_nursery: {
				sprites: [
					{ x: 8, y: 0 },
					{ x: 9, y: 0 },
					{ x: 7, y: 0 },
				],
				uiButton: { x: 7, y: 0 },
				uiDisabledButton: { x: 9, y: 0 },
				width: 3,
				costs: {
					wood: 2,
					stone: 3,
				},
				time: 10,
				type: "mushroom_nursery",
			},
			quarry: {
				sprites: [
					{ x: 5, y: 0 },
					{ x: 6, y: 0 },
					{ x: 4, y: 0 },
				],
				uiButton: { x: 5, y: 0 },
				uiDisabledButton: { x: 10, y: 0 },
				width: 3,
				costs: {
					wood: 2,
					stone: 3,
				},
				time: 10,
				type: "quarry",
			},
			staircase: {
				sprites: [{ x: 1, y: 0 }],
				uiButton: { x: 6, y: 0 },
				uiDisabledButton: { x: 11, y: 0 },
				width: 1,
				costs: {
					wood: 2,
					stone: 3,
				},
				time: 10,
				type: "staircase",
			},
			spring: {
				sprites: [{ x: 1, y: 0 }],
				uiButton: { x: 6, y: 0 },
				uiDisabledButton: { x: 10, y: 0 },
				width: 1,
				costs: {
					wood: 2,
					stone: 3,
				},
				time: 10,
				type: "spring",
			},
		},
	};
	gameLoop() {
		this.map.rooms.forEach((room) => {
			if (room.workers.length > 0) {
				room.workers.forEach((worker) => {
					room.type === "mushroom_nursery" && this.mushroom_nursery(room);
					room.type === "kitchen" && this.kitchen(room);
					room.type === "quarry" && this.quarry(room);
					room.type === "spring" && this.spring(room);
					if (
						room.type === "mushroom_nursery" ||
						room.type === "kitchen" ||
						room.type === "quarry"
					) {
						let useWorker = this._workers.filter(
							(workerT) => workerT.name === worker,
						)[0];
						useWorker.hunger += 0.1;
						useWorker.thirst += 0.1;
						if (useWorker.hunger > 1 || useWorker.thirst > 1) {
							console.log("Worker is dead");
							this.moveWorker(useWorker, { x: 0, y: 0 });
							this._workers = this._workers.filter(
								(workerT) => workerT.name !== worker,
							);
						}
					}
					if (room.type === "lunchroom") {
						let useWorker = this._workers.filter(
							(workerT) => workerT.name === worker,
						)[0];
						if (this._resources.cookedMushroom > 0 && useWorker.hunger > 0.5) {
							useWorker.hunger -= 0.5;
							this._resources.cookedMushroom -= 1;
						}
						if (this._resources.waterBucket > 0 && useWorker.thirst > 0.5) {
							useWorker.thirst -= 0.5;
							this._resources.waterBucket -= 1;
						}
					}
				});
			}
		});
	}
	moveWorker(worker: WorkerT, position: Position) {
		worker.position = position;
		this.map.rooms.forEach((room) => {
			if (
				room.position.x === Math.floor(position.x) &&
				room.position.y === Math.floor(position.y)
			) {
				if (!room.workers.includes(worker.name)) room.workers.push(worker.name);
			} else {
				room.workers.forEach((workerName, index) => {
					if (workerName === worker.name) {
						room.workers.splice(index, 1);
					}
				});
			}
		});
	}
	canBuildRoom(room: RoomConfig) {
		const config = this.config();
		if (config.rooms[room.type].costs.wood >= this._resources.wood) {
			return false;
		}
		if (config.rooms[room.type].costs.stone >= this._resources.stone) {
			return false;
		}
		return true;
	}
	buildRoom(room: RoomConfig, position: Position) {
		const config = this.config();
		if (config.rooms[room.type].costs.wood >= this._resources.wood) {
			console.log(
				`Not enough wood for ${room.type} at position X:${position.x} Y:${position.y}`,
			);
			return false;
		}
		if (config.rooms[room.type].costs.stone >= this._resources.stone) {
			console.log(
				`Not enough stone for ${room.type} at position X:${position.x} Y:${position.y}`,
			);
			return false;
		}
		let canbuild = true;
		this.map.rooms.forEach((roomT) => {
			if (roomT.position.y !== position.y) {
				return;
			}
			let withcheck = this._config.rooms[roomT.type].width;
			if (roomT.position.x === position.x) {
				console.log(
					`Room already exists at position X:${position.x} Y:${position.y}`,
				);
				canbuild = false;
				return;
			}
			for (let i = 1; i < withcheck; i++) {
				if (roomT.position.x === position.x - i) {
					console.log(
						`Room already exists at position X:${position.x} Y:${position.y}`,
					);
					canbuild = false;
					return;
				}
			}
		});
		if (canbuild) {
			this._resources.wood -= config.rooms[room.type].costs.wood;
			this._resources.stone -= config.rooms[room.type].costs.stone;
			this.map.rooms.push({
				workers: [],
				resources: {
					wood: 0,
					stone: 0,
					mushroom: 0,
					cookedMushroom: 0,
					waterBucket: 0,
				},
				type: room.type,
				level: 1.0,
				position: position,
			});
			return true;
		}
		return false;
	}
	mushroom_nursery(room: MapRoom) {
		this._resources.mushroom += 1 * room.level;
		this._resources.wood += 1 * room.level;
	}
	kitchen(room: MapRoom) {
		if (this._resources.mushroom > 0) {
			this._resources.cookedMushroom += 1 * room.level;
			this._resources.mushroom -= 1 * room.level;
		}
	}
	quarry(room: MapRoom) {
		this._resources.stone += 1 * room.level;
	}
	spring(room: MapRoom) {
		this._resources.waterBucket += 1 * room.level;
	}
	config(): Config {
		return this._config;
	}

	rooms(): MapRoom[] {
		return this.map.rooms;
	}

	resources(): Resources {
		return this._resources;
	}

	workers(): WorkerT[] {
		return this._workers;
	}
}
