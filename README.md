# Casa Karina e Tiago

Site de apresentação do projeto executivo da residência, com dois visualizadores 3D independentes carregando os modelos IFC arquitetônico e estrutural direto no navegador.

Site estático puro. Sem backend, sem build, sem npm. Basta subir a pasta.

---

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub, público, com qualquer nome (por exemplo `casa-karina-e-tiago`)
2. Envie **todo o conteúdo desta pasta** para a raiz do repositório
   Pelo site: botão **Add file** › **Upload files** › arraste tudo › **Commit changes**
   Pelo terminal:
   ```bash
   git init
   git add .
   git commit -m "Casa Karina e Tiago"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/casa-karina-e-tiago.git
   git push -u origin main
   ```
3. No repositório vá em **Settings** › **Pages**
4. Em **Source** escolha **Deploy from a branch**, branch `main`, pasta `/ (root)` e salve
5. Em um ou dois minutos o endereço aparece na própria página de Settings, no formato
   `https://SEU-USUARIO.github.io/casa-karina-e-tiago/`

Todos os caminhos do site são relativos, então ele funciona igual na raiz do domínio ou dentro de um subdiretório. O arquivo `.nojekyll` já está incluído para o GitHub servir a pasta `assets` sem processamento.

---

## Estrutura

```
index.html                      página única, todo o conteúdo
.nojekyll                       desliga o Jekyll no GitHub Pages
assets/
  css/site.css                  sistema visual completo
  js/main.js                    narrativa, animações e controles
  js/viewer.js                  Three.js + That Open Fragments empacotados
  js/fragments-worker.mjs       worker que processa a geometria fora da thread principal
  js/gsap.js                    GSAP + ScrollTrigger empacotados
  img/                          renders otimizados em duas resoluções
models/
  arquitetonico.frag            modelo arquitetônico, 2,9 MB
  estrutural.frag               modelo estrutural, 46 KB
  ifc/                          os IFC originais, para download e arquivo
```

---

## Os modelos 3D

Os arquivos IFC originais foram convertidos para o formato **Fragments** do That Open Engine antes de entrarem no site:

| Modelo | IFC original | Fragments | Redução |
|---|---|---|---|
| Arquitetônico | 45,1 MB | 2,9 MB | 16x |
| Estrutural | 331 KB | 46 KB | 7x |

É o que permite o modelo abrir em segundos no celular. Os IFC originais continuam no repositório em `models/ifc/` e ficam disponíveis para download no rodapé do site.

### Para atualizar um modelo

Quando o projeto mudar, gere um novo `.frag` a partir do IFC atualizado:

```bash
npm install @thatopen/fragments three web-ifc
```

```js
// converter.mjs
import { IfcImporter } from "@thatopen/fragments";
import fs from "node:fs/promises";

const importer = new IfcImporter();
importer.wasm = { absolute: true, path: "./node_modules/web-ifc/" };

const bytes = new Uint8Array(await fs.readFile("ARQUITETONICO.ifc"));
const frag = await importer.process({ bytes });
await fs.writeFile("models/arquitetonico.frag", frag);
```

```bash
node converter.mjs
```

Substitua o `.frag` na pasta `models/` e publique de novo. Nada mais precisa mudar.

---

## Ver localmente antes de publicar

O site precisa ser servido por HTTP, porque o visualizador usa um Web Worker e módulos ES. Abrir o `index.html` com dois cliques não funciona.

```bash
# com Python, já instalado na maioria dos computadores
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

---

## Como o site foi montado

**Visualizadores** Three.js com OrbitControls e That Open Fragments, empacotados em arquivos locais. Nenhuma CDN é necessária para o 3D funcionar, o que evita que o site quebre se algum serviço externo cair.

**Carregamento sob demanda** cada modelo só começa a baixar quando a seção correspondente se aproxima da tela, com barra de progresso real medida em bytes recebidos.

**Controle no celular** o modelo só captura o toque depois que a pessoa toca nele, então a rolagem da página nunca briga com a rotação do modelo. Tocar fora devolve a rolagem. Todos os botões têm no mínimo 48 por 48 pixels.

**Filtros estruturais** pilares, vigas, lajes, escada e fundações podem ser ligados e desligados individualmente, e as contagens ao lado de cada filtro são lidas do próprio modelo.

**Tipografia** Bodoni Moda para os títulos, Jost para o texto e IBM Plex Mono para as cotas e etiquetas técnicas, carregadas do Google Fonts com fallbacks locais definidos no CSS.

**Acessibilidade** navegação por teclado com foco visível, textos alternativos nas imagens, contraste dentro do padrão WCAG AA e respeito a `prefers-reduced-motion`.

---

## Créditos

Projeto arquitetônico: **Thayanne Meireles**
Projeto estrutural: **Valadares**, engenheiro projetista
Site desenvolvido por **Valadares**
