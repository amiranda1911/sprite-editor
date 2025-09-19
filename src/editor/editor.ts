import { Pen, PTool } from "./tools"
import { GCanvas, type GObject, type Vector2D } from "./types"



export class Editor {
  
  //Canvas container do editor
  container : HTMLCanvasElement
  ctx : CanvasRenderingContext2D
   
  //Elementos do editor
  canvasEditor : GCanvas
  pTools : Array<PTool>
  gElements : Array<GObject>
  //Ferramentas de desenho
  pen : Pen

  //Dispositivos de interface humana
  cursor :Vector2D  

  //Aquivo
  fileSize : Vector2D
  
  constructor(
    container :HTMLCanvasElement,
    filesize: Vector2D,
  ){
    
    this.cursor = {x:0,y:0}
    this.container = container
    
    this.container.width = window.innerWidth;   // largura real
    this.container.height = window.innerHeight;
    
    this.ctx = this.container.getContext('2d') as CanvasRenderingContext2D
    this.fileSize = filesize
    this.gElements = Array()
    this.pTools = Array()


    this.canvasEditor = new GCanvas(
        {x: this.container.width/2 , y: this.container.height/2}, 
        filesize, 
        "Canvas",
        () => {}
      )

    this.pen = new Pen(this.cursor, this.canvasEditor, "#000")
    
    this.pTools.push(this.pen)
    
    this.canvasEditor.onClick = () => this.pen.click()
    this.gElements.push(this.canvasEditor)

    
    

    container.addEventListener("mousemove", this.mouseInputHandler)
    container.addEventListener("mousedown", this.mouseInputHandler)
    container.addEventListener("mouseup", this.mouseInputHandler)
    container.addEventListener("click", this.mouseInputHandler)
    container.addEventListener("wheel", this.wheelInputHandler)
    container.addEventListener("contextmenu", (event: MouseEvent) => {
      event.preventDefault(); // impede o menu
      console.log("Menu de contexto bloqueado");
    });

    this.update()
  } 


  getContainerSize = (): Vector2D => {
    return { x: this.container.width, y: this.container.height };
  };
  

  update = () => {
    const size = this.getContainerSize();
    // Limpa o canvas
    this.ctx.clearRect(0, 0, size.x, size.y);
    
    
    // TODO
    this.gElements.forEach(element => {
        element.hover = element.isInside(this.cursor) ? true : false
        element.draw(this.ctx);
      }
    )
    // Chama novamente na próxima frame
    requestAnimationFrame(this.update);
  };

  mouseInputHandler = (event : MouseEvent) => {
   
    switch (event.type) {
      case "mousemove":
        let cursor = getMousePos(this.container, event)
        this.cursor.x = cursor.x
        this.cursor.y = cursor.y
      break;
          
      default:
        this.gElements.forEach(element => {
          if(element.isInside(this.cursor)){
            element.onClick()
          }
        })
      return;
    }
  }

  wheelInputHandler = (event: WheelEvent) => {
    let deltaY = event.deltaY; // valor do scroll vertical
    
    // delta com o wheel do mouse gera o valor com +/-100, normalizado para somente 1  
    deltaY = deltaY > 100 ? 1 : deltaY
    deltaY = deltaY < -100 ? -1 : deltaY

    this.gElements.forEach(element => {
      if(element.isInside(this.cursor)) 
        element.scroll(deltaY)
    })
  }
}


const getMousePos = (canvas: HTMLCanvasElement, event: MouseEvent) : Vector2D => {
    const rect = canvas.getBoundingClientRect(); // posição e tamanho do canvas na tela
    const scaleX = canvas.width / rect.width;    // escala horizontal real
    const scaleY = canvas.height / rect.height;  // escala vertical real

    return {
          x: (event.clientX - rect.left) * scaleX,
          y: (event.clientY - rect.top) * scaleY
    };
}

