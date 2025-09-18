/******************************************************
declare module "*.css";

"Se alguém fizer import './algum-arquivo.css', considere isso como um módulo válido.
Eu não sei os tipos exatos, mas não dê erro."

O efeito prático:

TypeScript: Para de dar erro na compilação (TS2307).
Webpack: Continua processando o .css com os loaders (style-loader, css-loader), injeta o estilo no HTML e funciona normalmente no navegador.

O erro vinha do TypeScript (checagem de tipos).
A solução foi criar uma declaração de módulo global (global.d.ts) dizendo que arquivos .css podem ser importados.
Isso é só para o compilador TS não reclamar.

Quem realmente "carrega" o CSS no bundle é o Webpack.

******************************************/

declare module "*.css";
