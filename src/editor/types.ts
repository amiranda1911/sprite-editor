export interface Vector2D {
    x : number;
    y : number;
};


// Elementos de interface gráfica
export class gObject {
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

  isInside(cursor: Vector2D): boolean {
    return (
      cursor.x >= this.position.x &&
      cursor.x <= this.position.x + this.size.x &&
      cursor.y >= this.position.y &&
      cursor.y <= this.size.y + this.position.y
    );
  }
}

export class GCanvas extends gObject {
  zoom = 11
  srcSize :Vector2D
  srcPosition : Vector2D
  constructor(
    positon : Vector2D,
    size: Vector2D,
    label: string,
    onClick: () => void
  ) {
    super(positon, size, label, onClick);
    
    this.srcSize = { ...size }
    this.srcPosition =  { ...positon}
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.size.x = this.srcSize.x * this.zoom
    this.size.y = this.srcSize.y * this.zoom
    this.position.x = this.srcPosition.x - this.size.x/2
    this.position.y = this.srcPosition.y - this.size.y/2
    super.draw(ctx);
  }
  
} 