type Position = {
	x: number;
	y: number;
}

type Costs = {
	wood: number;
	stone: number;
}

type Sprite = {
	x: number;
	y: number;
}

export type Room = {
	sprites: Sprite[];
	uiButton: Sprite;
	width: number;
	costs: Costs;
	time: number;
}

type Resource = {
	name: string;
	size: number;
}

export type MapRoom = {
	workers: [];
	resources: Resource[];
	type: string;
	level: number;
	position: Position;
}

type Rooms = {
	[key:string]: Room;
}

type Config = {
	rooms: Rooms;
}

export class Game {
	config(): Config {
		return {
			rooms: {
				"kitchen": {
					sprites: [{x: 2, y: 0}, {x: 3, y: 0}],
					uiButton: {x: 4, y: 0},
					width: 2,
					costs: {
						wood: 2,
						stone: 3
					},
					time: 10
				},
				"mushroom-nursery": {
					sprites: [{x: 8, y: 0},{x: 9, y: 0},{x: 7, y: 0}],
					uiButton: {x: 7, y: 0},
					width: 3,
					costs: {
						wood: 2,
						stone: 3,
					},
					time: 10
				},
				"quarry": {
					sprites: [{x: 5, y: 0},{x: 6, y: 0},{x: 4, y: 0}],
					uiButton: {x: 5, y: 0},
					width: 3,
					costs: {
						wood: 2,
						stone: 3,
					},
					time: 10
				},
				"staircase": {
					sprites: [{x: 1, y: 0}],
					uiButton: {x: 6, y: 0},
					width: 1,
					costs: {
						wood: 2,
						stone: 3,
					},
					time: 10
				}
			}
		}
	}

	rooms(): MapRoom[] {
		return [
			{
				workers: [],
				resources: [
					{
						name: "wood",
						size: 10
					},
					{
						name: "mushroom",
						size: 10
					}
				],
				type: "mushroom-nursery",
				level: 1.0,
				position: {
					x: 2,
					y: 2
				}
			},
			{
				workers: [],
				resources: [],
				type: "staircase",
				level: 1.0,
				position: {
					x: 1,
					y: 2
				}
			},
			{
				workers: [],
				resources: [
					{
						name: "cooked-mushroom",
						size: 10
					}
				],
				type: "kitchen",
				level: 1.0,
				position: {
					x: 3,
					y: 3
				}
			},
			{
				workers: [],
				resources: [
					{
						name: "stone",
						size: 10
					}
				],
				type: "quarry",
				level: 1.0,
				position: {
					x: 4,
					y: 4
				}
			}
		]
	}
}
