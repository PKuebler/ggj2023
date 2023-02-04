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
	neighboringRooms: MapRoom[];
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
	_child = 0;
	_workers: WorkerT[] = [
		{ name: "Worker1", hunger: 0, thirst: 0, position: { x: 2, y: 2 } },
		{ name: "Worker2", hunger: 0, thirst: 0, position: { x: 3, y: 2 } },
	];
	map: MapT = {
		rooms: [
			{
				workers: [],
				neighboringRooms: [],
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
				neighboringRooms: [],
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
				neighboringRooms: [],
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
				sprites: [{ x: 15, y: 0 }],
				uiButton: { x: 15, y: 0 },
				uiDisabledButton: { x: 14, y: 0 },
				width: 1,
				costs: {
					wood: 2,
					stone: 3,
				},
				time: 10,
				type: "spring",
			},
			lunchroom: {
				sprites: [
					{ x: 13, y: 0 },
					{ x: 14, y: 0 },
				],
				uiButton: { x: 12, y: 0 },
				uiDisabledButton: { x: 13, y: 0 },
				width: 2,
				costs: {
					wood: 2,
					stone: 3,
				},
				time: 10,
				type: "lunchroom",
			},
			bedroom: {
				sprites: [
					{ x: 16, y: 0 },
					{ x: 18, y: 0 },
				],
				uiButton: { x: 16, y: 0 },
				uiDisabledButton: { x: 17, y: 0 },
				width: 2,
				costs: {
					wood: 2,
					stone: 3,
				},
				time: 10,
				type: "bedroom",
			},
		},
	};

	gameLoop() {
		this.map.rooms.forEach((room) => {
			if (room.workers.length > 0) {
				room.workers.forEach((worker) => {
					let useWorker = this._workers.filter(
						(workerT) => workerT.name === worker,
					)[0];
					room.type === "mushroom_nursery" && this.mushroom_nursery(room);
					room.type === "kitchen" && this.kitchen(room);
					room.type === "quarry" && this.quarry(room);
					room.type === "spring" && this.spring(room);
					room.type === "bedroom" && this.bedroom(room);
					if (
						room.type === "mushroom_nursery" ||
						room.type === "kitchen" ||
						room.type === "quarry"
					) {
						useWorker.hunger += 0.1;
						useWorker.thirst += 0.1;
						if (useWorker.hunger > 1 || useWorker.thirst > 1) {
							console.log("Worker is dead");
							this.removeWorker(useWorker);
							this._workers = this._workers.filter(
								(workerT) => workerT.name !== worker,
							);
						}
					}
					if (room.type === "lunchroom") {
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
	removeWorker(worker: WorkerT) {
		this.map.rooms.forEach((room) => {
			room.workers.forEach((workerName, index) => {
				if (workerName === worker.name) {
					room.workers.splice(index, 1);
				}
			});
		});
	}
	moveWorker(worker: WorkerT, targetRoom: MapRoom) {
		if (
			targetRoom.workers.length >= this._config.rooms[targetRoom.type].width
		) {
			return;
		}

		this.removeWorker(worker);

		worker.position.x = targetRoom.position.x + targetRoom.workers.length;
		worker.position.y = targetRoom.position.y;

		if (!targetRoom.workers.includes(worker.name))
			targetRoom.workers.push(worker.name);
	}
	enoughResourcesToBuildAvailable(room: RoomConfig) {
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
		if (!this.enoughResourcesToBuildAvailable(room)) {
			console.log(
				`Not enough resources for ${room.type} at position X:${position.x} Y:${position.y}`,
			);
			return;
		}
		let canbuild = true;
		let isRoomNearBy = false;
		this.map.rooms.forEach((roomOnMap) => {
			let roomWidth = this._config.rooms[roomOnMap.type].width;
			if (!isRoomNearBy) {
				if (roomOnMap.type === "staircase") {
					if (
						position.y === roomOnMap.position.y &&
						(position.x === roomOnMap.position.x - 1 ||
							position.x === roomOnMap.position.x + roomWidth)
					) {
						isRoomNearBy = true;
					} else if (
						(position.y === roomOnMap.position.y - 1 ||
							position.y === roomOnMap.position.y + 1) &&
						position.x === roomOnMap.position.x
					) {
						isRoomNearBy = true;
					}
				} else {
					if (
						position.y === roomOnMap.position.y &&
						(position.x === roomOnMap.position.x - 1 ||
							position.x === roomOnMap.position.x + roomWidth)
					) {
						isRoomNearBy = true;
					}
				}
			}

			if (
				position.y === roomOnMap.position.y &&
				position.x >= roomOnMap.position.x &&
				position.x < roomOnMap.position.x + roomWidth
			) {
				canbuild = false;
				return;
			}
		});

		if (canbuild && isRoomNearBy) {
			this._resources.wood -= config.rooms[room.type].costs.wood;
			this._resources.stone -= config.rooms[room.type].costs.stone;
			this.map.rooms.push({
				workers: [],
				neighboringRooms: [],
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
			this.updateNavMesh();
			return true;
		}
		return false;
	}
	updateNavMesh() {
		this.map.rooms.forEach((a) => {
			a.neighboringRooms = [];
			this.map.rooms.forEach((b) => {
				if (a === b) {
					return;
				}

				if (a.type === "staircase") {
					if (
						b.position.y - 1 === a.position.y ||
						b.position.y + 1 === a.position.y
					) {
					} else if (b.position.y === a.position.y) {
						if (
							b.position.x === a.position.x - 1 ||
							b.position.x + this._config.rooms[b.type].width - 1 ===
								a.position.x
						) {
							a.neighboringRooms.push(b);
						}
					}
					return;
				}

				if (
					b.position.y === a.position.y &&
					(b.position.x === a.position.x - 1 ||
						b.position.x + this._config.rooms[b.type].width - 1 ===
							a.position.x)
				) {
					a.neighboringRooms.push(b);
				}
			});
		});
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
	bedroom(room: MapRoom) {
		if (room.workers.length === 2) {
			this._child += 0.05;
		}
		if (this._child > 0.99) {
			// new worker
			this._workers.push({
				name: `Worker${this.workers.length + 1}`,
				hunger: 0,
				thirst: 0,
				position: { x: room.position.x, y: room.position.y },
			});
			this._child = 0;
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
