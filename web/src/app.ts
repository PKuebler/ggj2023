import { Game, RoomConfig, WorkerT } from './game';
import { Renderer } from './render';

window.addEventListener('load', () => {
	'use strict';

	let canvas = document.getElementById('canvas') as
		HTMLCanvasElement;
	let context = canvas.getContext('2d');
	if (context !== null) {
		startApp(canvas, context);
	}
});

class App {
	_canvas: HTMLCanvasElement;
	_context: CanvasRenderingContext2D;
	_renderer: Renderer
	_game: Game
	_selectedBlueprint: RoomConfig | undefined;
	_selectedWorker: WorkerT | undefined;
	_last: number = 0;

	constructor(game: Game, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this._canvas = canvas;
		this._context = context;
		this._game = game;
		this._renderer = new Renderer(this._game, this._canvas, this._context);
	}

	startLoop(now: number) {
		const delta = now - this._last;
		this._game.gameLoop(delta);
		this._renderer.draw(delta)
		window.requestAnimationFrame(this.startLoop.bind(this));

		this._last = now;
	}

	click(x: number, y: number) {
		const clickedBlueprint = this._renderer.uiOnScreen(x,y)
		const clickedWorker = this._renderer.workerOnScreen(x,y)
		if (clickedBlueprint) {
			if (this._game.enoughResourcesToBuildAvailable(clickedBlueprint)) {
				this._renderer.setMode("build")
				this._selectedBlueprint = clickedBlueprint;
			}
		} else if (clickedWorker) {
			this._renderer.setMode("move")
			this._selectedWorker = clickedWorker;
		} else {
			if (this._renderer.getMode() === "build" && this._selectedBlueprint) {
				// build to:
				const buildPos = this._renderer.screenToMap(x,y)
				this._game.buildRoom(this._selectedBlueprint, {x:buildPos.x, y:buildPos.y})
				this._selectedBlueprint = undefined;
			} else if (this._renderer.getMode() === "move" && this._selectedWorker) {
				const room = this._renderer.roomOnScreen(x,y)
				if (room) {
					this._game.moveWorker(this._selectedWorker, room)
				}
				this._selectedWorker = undefined;
			}

			this._renderer.setMode("inspect")
		}
		console.log(this._renderer.roomOnScreen(x,y))
	}

	hover(x: number, y: number) {
		this._renderer.hoverScreen(x, y)
	}
}

function startApp(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
	const game = new Game();
	const app = new App(game, canvas, context);

	canvas.addEventListener('click', (event) => {
		app.click(event.offsetX, event.offsetY);
	})

	canvas.addEventListener('mousemove', (event) => {
		app.hover(event.offsetX, event.offsetY);
	})

	app.startLoop(0);
}
