Crie um site premium, elegante, sofisticado e emocional para apresentar o projeto da futura casa de um casal.

O site deve contar uma história, começando pelo sonho da casa, passando pelo projeto arquitetônico e depois mostrando como esse projeto ganha forma através da estrutura.

Use mensagens alegres, acolhedoras e sofisticadas ao longo de toda a página.

O site precisa funcionar perfeitamente hospedado no GitHub Pages. Estruture o projeto para deploy estático, sem depender de backend, servidor próprio ou recursos que não funcionem em hospedagem estática.

Comece pelo Projeto Arquitetônico.

Crie uma seção exclusiva com o IFC arquitetônico em um visualizador 3D totalmente interativo dentro do site. O cliente deve conseguir girar, aproximar, afastar, mover a câmera, explorar em 360°, resetar a visualização e abrir em tela cheia.

O IFC não deve depender do scroll. O controle deve ser feito diretamente pelo usuário com mouse no desktop e gestos de toque no celular.

Depois crie uma transição elegante para o Projeto Estrutural.

Crie uma segunda seção totalmente independente com outro visualizador 3D contendo apenas o IFC estrutural.

O cliente deve conseguir explorar pilares, vigas, lajes e fundações, girar, mover, dar zoom, resetar a câmera e usar tela cheia.

Se possível, permita ativar e desativar categorias como pilares, vigas, lajes e fundações.

O IFC arquitetônico e o IFC estrutural devem ficar em visualizadores separados.

O site deve ser mobile first e funcionar muito bem em celular.

No mobile:

Use controles por toque intuitivos
Evite botões pequenos
Crie botões grandes e fáceis de tocar
Evite conflitos entre o scroll da página e a movimentação do modelo 3D
Permita entrar em modo tela cheia para explorar melhor o IFC
Adapte o tamanho e a posição dos controles
Mantenha boa performance mesmo em aparelhos intermediários
Reduza efeitos pesados quando necessário
Tenha carregamento progressivo dos arquivos IFC
Mostre uma tela de loading elegante enquanto o modelo carrega

O design deve ser premium, chique, minimalista e inspirado em apresentações de arquitetura de alto padrão.

Use tipografia editorial sofisticada, bastante espaço em branco, animações GSAP suaves, microinterações refinadas e transições elegantes.

Importante:

O projeto deve ser compatível com GitHub Pages.

Evite qualquer dependência de backend.

Configure corretamente caminhos relativos de assets para funcionar em subdiretórios do GitHub Pages.

Não use caminhos absolutos que quebrem no deploy.

Os arquivos IFC devem ficar em uma pasta pública do projeto e serem carregados corretamente após a publicação.

Caso use Vite, configure corretamente o base path para GitHub Pages.

Caso use Next.js, utilize apenas uma abordagem compatível com export estático e GitHub Pages.

Prefira Vite + JavaScript ou Vite + React caso isso torne o deploy e o visualizador IFC mais estáveis.

Use Three.js, IFC.js, That Open Engine ou outra solução compatível com navegador e hospedagem estática.

Priorize performance, responsividade, experiência mobile e estabilidade.

O resultado final deve funcionar localmente e também publicado diretamente no GitHub Pages, sem necessidade de servidor adicional.
