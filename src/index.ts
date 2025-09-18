
import {Editor} from './editor/editor';
import './reset.css';
import './style.css';




const editor_container = document.getElementById('editor-container')  as HTMLCanvasElement;

const editor = new Editor(editor_container, {x:16, y:16})