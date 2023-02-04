import { Loader } from './loader';
import { Game, RoomConfig, MapRoom, Sprite, Position, WorkerT } from './game';

export class Renderer {
	_game: Game;
	_canvas: HTMLCanvasElement;
	_ctx: CanvasRenderingContext2D;
	_loader: Loader;

	_tileWidth: number;
	_tileHeight: number;

	_hoverX: number;
	_hoverY: number;
	_hoverRoom: MapRoom | undefined;
	_hoverWorker: WorkerT | undefined;

	_uiX: number;
	_uiY: number;

	_mode: string;

	_workerSprite: Sprite;
	_workerHoverSprite: Sprite;
	_workerAreaMin: Position;
	_workerAreaMax: Position;

	constructor(game: Game, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this._game = game
		this._canvas = canvas;
		this._ctx = context;

		this._tileWidth = 64;
		this._tileHeight = 64;

		this._hoverX = 0;
		this._hoverY = 0;
		this._hoverRoom = undefined;
		this._hoverWorker = undefined;

		this._uiX = 0;
		this._uiY = this._canvas.height-62;

		this._mode = "inspect";

		this._workerSprite = {
			x: 10,
			y: 0
		};

		this._workerHoverSprite = {
			x: 11,
			y: 0
		};

		this._workerAreaMin = {
			x: 24,
			y: 25,
		}
		this._workerAreaMax = {
			x: 40,
			y: 64,
		}

		this._loader = new Loader({
			tile_ground: 'assets/ground.png',
			ui: 'assets/ui.png',
		});
		this._loader.load();
	}

	draw(now: number) {
		// draw background
		this._ctx.fillStyle = "rgb(16, 17, 18)";
		this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

		// set text
		this._ctx.font = "14px Arial";

		// wait for image loading
		if (!this._loader.finish) {
			this._ctx.fillText(`Load Assets: ${this._loader.process}`, 20, 20);
			return
		}

		const ground = this._loader.getImage('tile_ground')
		const ui = this._loader.getImage('ui')

		// rooms
		const config = this._game.config()
		this._game.rooms().forEach((room) => {
			const screenPos = this.mapToScreen(room.position.x, room.position.y)
			const sprites = config.rooms[room.type].sprites

			sprites.forEach((sprite, i) => {
				this._ctx.drawImage(ground, sprite.x*this._tileWidth, sprite.y*this._tileHeight, this._tileWidth, this._tileHeight, screenPos.x+i*this._tileWidth, screenPos.y, this._tileWidth, this._tileHeight);
			})
		})

		// hover
		if (this._hoverRoom) {
			const sprites = config.rooms[this._hoverRoom.type].sprites
			const screenPosStart = this.mapToScreen(this._hoverRoom.position.x, this._hoverRoom.position.y)
			const screenPosEnd = this.mapToScreen(this._hoverRoom.position.x+sprites.length-1, this._hoverRoom.position.y)
			this._ctx.drawImage(ui, 2*this._tileWidth, 0*this._tileHeight, this._tileWidth, this._tileHeight, screenPosStart.x, screenPosStart.y, this._tileWidth, this._tileHeight);
			this._ctx.drawImage(ui, 3*this._tileWidth, 0*this._tileHeight, this._tileWidth, this._tileHeight, screenPosEnd.x, screenPosEnd.y, this._tileWidth, this._tileHeight);
		} else if (this._mode === "build") {
			// only if build mode
			const mapPos = this.screenToMap(this._hoverX, this._hoverY)

			const screenPos = this.mapToScreen(mapPos.x, mapPos.y)
			this._ctx.drawImage(ui, 1*this._tileWidth, 0*this._tileHeight, this._tileWidth, this._tileHeight, screenPos.x, screenPos.y, this._tileWidth, this._tileHeight);
		}

		// workers
		this._game.workers().forEach((worker) => {
			const screenPos = this.mapToScreen(worker.position.x, worker.position.y)
			this._ctx.drawImage(ground, this._workerSprite.x*this._tileWidth, this._workerSprite.y*this._tileHeight, this._tileWidth, this._tileHeight, screenPos.x, screenPos.y, this._tileWidth, this._tileHeight);
		})

		if (this._hoverWorker) {
			const screenPos = this.mapToScreen(this._hoverWorker.position.x, this._hoverWorker.position.y)
			this._ctx.drawImage(ground, this._workerHoverSprite.x*this._tileWidth, this._workerHoverSprite.y*this._tileHeight, this._tileWidth, this._tileHeight, screenPos.x, screenPos.y, this._tileWidth, this._tileHeight);
		}

		// ui
		const roomNames = Object.keys(config.rooms)
		for (let i = 0; i < roomNames.length; i++) {
			const room = config.rooms[roomNames[i]];
			let sprite = room.uiButton;
			if (!this._game.canBuildRoom(room)) {
				sprite = room.uiDisabledButton;
			}
			this._ctx.drawImage(ui, sprite.x*this._tileWidth, sprite.y*this._tileHeight, this._tileWidth, this._tileHeight, this._uiX+i*this._tileWidth, this._uiY, this._tileWidth, this._tileHeight);
		}

		this._ctx.fillStyle = "white";
		const resources = this._game.resources()

		this._ctx.fillText(`Wood: ${resources.wood} Stone: ${resources.stone} Mushroom: ${resources.mushroom} CookedMushroom: ${resources.cookedMushroom} WaterBucket: ${resources.waterBucket}`, 20, 20);
	}

	setMode(mode: string) {
		this._mode = mode;
	}

	getMode(): string {
		return this._mode;
	}

	uiOnScreen(screenX: number, screenY: number): RoomConfig | undefined {
		const config = this._game.config()

		if (screenX < this._uiX || screenY < this._uiY || screenY > this._uiY+this._tileWidth) {
			return undefined
		}

		const roomNames = Object.keys(config.rooms)
		for (let i = 0; i < roomNames.length; i++) {
			if (screenX > this._uiX+i*this._tileWidth && screenX < this._uiX+(i+1)*this._tileWidth) {
				return config.rooms[roomNames[i]];
			}
		}

		return undefined
	}

	roomOnScreen(screenX: number, screenY: number): MapRoom | undefined {
		const config = this._game.config()

		const mapPos = this.screenToMap(this._hoverX, this._hoverY)

		for (const room of this._game.rooms()) {
			if (mapPos.x < room.position.x || mapPos.y < room.position.y) {
				continue
			}

			const sprites = config.rooms[room.type].sprites

			if (mapPos.x > room.position.x+sprites.length-1 || mapPos.y > room.position.y) {
				continue
			}

			return room
		}

		return undefined
	}

	workerOnScreen(screenX: number, screenY: number): WorkerT | undefined {
		const workers = this._game.workers()
		for (const worker of workers) {
			const workerPos = this.mapToScreen(worker.position.x, worker.position.y)
			const minX = workerPos.x + this._workerAreaMin.x
			const maxX = workerPos.x + this._workerAreaMax.x
			const minY = workerPos.y + this._workerAreaMin.y
			const maxY = workerPos.y + this._workerAreaMax.y

			if (screenX < minX || screenY < minY) {
				continue
			}

			if (screenX > maxX || screenY > maxY) {
				continue
			}

			return worker
		}
	}

	hoverScreen(screenX: number, screenY: number) {
		this._hoverX = screenX
		this._hoverY = screenY

		this._hoverRoom = this.roomOnScreen(screenX, screenY)
		this._hoverWorker = this.workerOnScreen(screenX, screenY)
	}

	screenToMap(screenX: number, screenY: number) {
		return {
			x: Math.floor(screenX/this._tileWidth),
			y: Math.floor(screenY/this._tileHeight)
		};
	}

	mapToScreen(mapX: number, mapY: number) {
		return {
			x: mapX*this._tileWidth,
			y: mapY*this._tileHeight
		}
	}
}
