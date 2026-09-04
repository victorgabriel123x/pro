# Residência Avarandada — modelo 3D para o site

Visualizador 3D do projeto arquitetônico legal (residência unifamiliar térrea),
gerado a partir de `PRO-CASA-AVARANDA-R00.ifc`.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | A página do visualizador. Não precisa de build nem de dependências. |
| `modelo.glb` | O modelo 3D (5,2 MB). Precisa ficar **na mesma pasta** e com **este nome**. |
| `.nojekyll` | Evita que o GitHub Pages processe a pasta com o Jekyll. |

## Publicar no GitHub Pages

1. Crie um repositório novo (pode ser público ou privado, se você tem GitHub Pro).
2. Envie os três arquivos para a **raiz** do repositório, na branch `main`.
   Pelo site: **Add file → Upload files**, arraste os três, **Commit changes**.
3. No repositório: **Settings → Pages**.
4. Em *Build and deployment*, escolha **Deploy from a branch**,
   branch `main`, pasta `/ (root)`. Salve.
5. Em 1–2 minutos o endereço aparece na mesma tela:
   `https://SEU-USUARIO.github.io/NOME-DO-REPO/`

Esse é o link para mandar ao cliente.

## Observações

- **Não funciona por duplo clique.** Aberto como `file://`, o navegador bloqueia a
  leitura do `.glb`. Precisa ser servido por HTTP — o GitHub Pages já resolve isso.
- O `modelo.glb` tem 5,2 MB, bem abaixo do limite de 100 MB do Git. Não precisa de Git LFS.
- A página busca a biblioteca Three.js (v0.160.0) em `cdn.jsdelivr.net`. Só isso vem de fora.
- Para trocar o modelo depois, basta substituir o `modelo.glb` mantendo o nome.

## Testar localmente antes de publicar

Dentro desta pasta:

    python -m http.server 8000

Depois abra `http://localhost:8000`.
