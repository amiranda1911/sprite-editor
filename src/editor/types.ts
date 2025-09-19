import type { PTool } from "./tools";

export interface Vector2D {
    x : number;
    y : number;
};

// Elementos de interface gráfica
export class GObject {
  position : Vector2D
  size : Vector2D
  label: string;
  hover: boolean;
  onClick: () => void;

  constructor(
    positon : Vector2D,
    size: Vector2D,
    label: string,
    onClick: () => void
  ) {
    this.position = positon;
    this.size = size;
    this.label = label;
    this.onClick = onClick;
    this.hover = false;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = !this.hover ? "#888" : "#444";
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y,);
    
  }

  scroll = (delta : number) => {}

  isInside(cursor: Vector2D): boolean {
    return (
      cursor.x >= this.position.x &&
      cursor.x <= this.position.x + this.size.x &&
      cursor.y >= this.position.y &&
      cursor.y <= this.size.y + this.position.y
    );
  }
}

export class GCanvas extends GObject {
  zoom = 6
  minZoom = 5
  maxZoom = 500
  srcSize :Vector2D
  srcPosition : Vector2D
  srcImage : ImageData
  scaledImage : ImageData
  constructor(
    positon : Vector2D,
    size: Vector2D,
    label: string,
    onClick: () => void
  ) {
    super(positon, size, label, onClick);
    
    this.srcSize = { ...size }
    this.srcPosition =  { ...positon}
    this.srcImage = createAphaBackground(this.srcSize),this.zoom
    this.scaledImage = scaleImageData(this.srcImage, this.zoom)
    
  }

  scroll = (delta : number) => {
    this.zoom  = (this.zoom < this.minZoom) && delta < 0 ? this.minZoom : this.zoom += delta
    this.zoom  = (this.zoom > this.maxZoom ) && delta > 0 ? this.maxZoom : this.zoom += delta
    this.scaledImage = scaleImageData(this.srcImage, this.zoom)
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.size.x = this.srcSize.x * this.zoom
    this.size.y = this.srcSize.y * this.zoom
    this.position.x = this.srcPosition.x - this.size.x/2
    this.position.y = this.srcPosition.y - this.size.y/2

    ctx.putImageData(
      this.scaledImage,
      this.position.x, 
      this.position.y)
  }

} 

const createAphaBackground = (fileSize : Vector2D ) : ImageData => {
  const image = new ImageData(fileSize.x, fileSize.y)
  let color = 136 
  for (let y = 0; y < fileSize.y; y++) {
    for (let x = 0; x < fileSize.x; x++) {
      const i = (y * fileSize.x + x) * 4;
      image.data[i + 0] = color;   // R
      image.data[i + 1] = color;     // G
      image.data[i + 2] = color;     // B
      image.data[i + 3] = 255;   // A (opaco)

      color = (color == 136) ? 85 : 136
    }
    color = (color == 136) ? 85 : 136
  }
  return image
}

const scaleImageData = (src: ImageData, scale : number): ImageData => {
  const newWidth : number = src.width * scale;
  const newHeight = src.height * scale;
  const dst = new ImageData(newWidth, newHeight);

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const srcX = Math.floor(x / scale);
      const srcY = Math.floor(y / scale);

      const srcIndex: number = (srcY * src.width + srcX) * 4;
      const dstIndex: number = (y * newWidth + x) * 4;

      dst.data[dstIndex + 0] = src.data[srcIndex + 0]!; // R
      dst.data[dstIndex + 1] = src.data[srcIndex + 1]!; // G
      dst.data[dstIndex + 2] = src.data[srcIndex + 2]!; // B
      dst.data[dstIndex + 3] = src.data[srcIndex + 3]!; // A
    }
  }

  return dst;
}

export const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}