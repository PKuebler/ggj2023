import { Game, RoomConfig } from './game';
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
	_blueprint: RoomConfig | undefined;

	constructor(game: Game, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this._canvas = canvas;
		this._context = context;
		this._game = game;
		this._renderer = new Renderer(this._game, this._canvas, this._context);
	}

	startLoop(now: number) {
		this._renderer.draw(now)
		window.requestAnimationFrame(this.startLoop.bind(this));
	}

	click(x: number, y: number) {
		const clickedBlueprint = this._renderer.uiOnScreen(x,y)
		if (clickedBlueprint) {
			this._renderer.setMode("build")
			this._blueprint = clickedBlueprint;
		} else {
			if (this._renderer.getMode() === "build" && this._blueprint) {
				// build to:
				const buildPos = this._renderer.screenToMap(x,y)
				this._game.buildRoom(this._blueprint, {x:buildPos.x, y:buildPos.y})
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
