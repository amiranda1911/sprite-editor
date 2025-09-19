import { map, type GCanvas, type Vector2D } from "./types";

export class PTool {
	position: Vector2D
	canvas: GCanvas
	color: string
	constructor(
		position: Vector2D,
		canvas: GCanvas,
		color: string
	) {
		this.position = position
		this.canvas = canvas
		this.color = color
	}

	click = () => {}
}

export class Pen extends PTool {
	
	
	constructor(
		position: Vector2D,
		canvas: GCanvas,
		color: string
	) {
		super(
		position,
		canvas,
		color)
	}

	
	click = () => {
		
		let pointer : Vector2D = {x : 0 , y : 0}

		pointer.x = Math.floor(map(
			this.position.x,
			this.canvas.position.x, 
			this.canvas.position.x + this.canvas.size.x,
			0, 
			this.canvas.srcSize.x
		))

		
		pointer.y = Math.floor(map(
			this.position.y,
			this.canvas.position.y, 
			this.canvas.position.y + this.canvas.size.y,
			0, 
			this.canvas.srcSize.y
		))

		const i = (pointer.y * this.canvas.srcSize.x + pointer.x) * 4;
		
		this.canvas.srcImage.data[i + 0] = 0;   // R
    this.canvas.srcImage.data[i + 1] = 0;     // G
    this.canvas.srcImage.data[i + 2] = 0;     // B
    this.canvas.srcImage.data[i + 3] = 255;   // A (opaco)
		// Faz o update da imagem para atualizar o pixel
		this.canvas.scroll(0)
	};

}
