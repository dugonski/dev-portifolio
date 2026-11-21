# dev-portifolio

Portfólio de desenvolvedor de **Guilherme Dugonski** — uma viagem espacial guiada pela rolagem, construída com [GSAP](https://gsap.com) e seus plugins.

**Site:** https://dugonski.github.io/dev-portifolio/

## A experiência

Cada seção é uma etapa da missão, com uma interação de scroll própria:

| # | Seção | Experiência | Plugins |
|---|-------|-------------|---------|
| — | Preloader | Boot log de terminal com contagem até a ignição | `CustomEase` |
| 00 | Lançamento | `whoami` digitado, título se desfaz e o campo de estrelas entra em dobra | `ScrollTrigger` (pin + scrub), `SplitText`, `TextPlugin` |
| 01 | Sobre | Editor `about.ts` digitado linha a linha pela rolagem | `ScrollTrigger`, `SplitText` |
| 02 | Skills | O stack vira um mapa estelar; tooltip em formato JSON | `DrawSVGPlugin`, `ScrambleTextPlugin` |
| 03 | Projetos | Scroll horizontal por cards em formato de repositório, com `git clone` copiável | `ScrollTrigger` (`containerAnimation`) |
| 04 | Jornada | `git log --graph`: foguete percorre a rota passando pelos commits | `MotionPathPlugin`, `DrawSVGPlugin` |
| 05 | Contato | Letras emergem de um buraco negro e um `git commit` é digitado no terminal | `SplitText`, `TextPlugin`, `Observer` |

Global: `ScrollSmoother` (smooth scroll), `ScrollToPlugin`, cursor customizado, botões magnéticos, status bar estilo editor (branch, arquivo da seção atual e distância percorrida até a Lua) e campo de estrelas em canvas que acelera com a velocidade da rolagem.

Respeita `prefers-reduced-motion` e tem layouts específicos para mobile.

## Stack

- HTML, CSS e JavaScript puros — sem etapa de build
- GSAP 3.13 (todos os plugins são gratuitos desde a 3.13), versionado em `assets/vendor/gsap`
- Fontes self-hosted: Unbounded, Space Grotesk e JetBrains Mono (SIL Open Font License)

## Estrutura

```
index.html
assets/
  css/style.css
  fonts/
  js/
    core.js            # plugins, smoother, cursor, nav, HUD
    starfield.js       # campo de estrelas em canvas
    main.js            # preloader e orquestração das cenas
    scenes/            # uma cena por seção
  vendor/gsap/
.github/workflows/deploy.yml
```

## Rodando localmente

```bash
python3 -m http.server 8000
```

Abra http://localhost:8000.

## Editando o conteúdo

- **Textos, código do editor, projetos e jornada:** `index.html`
- **Boot log do preloader:** array `BOOT` em `assets/js/main.js`
- **Skills da constelação:** array `SKILLS` em `assets/js/scenes/constellation.js`
- **Cores:** variáveis em `:root` no topo de `assets/css/style.css`

## Deploy

O workflow `.github/workflows/deploy.yml` publica o site no GitHub Pages a cada push na `main`.
Na primeira vez, ative em **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Convenções

**Branches** — `tipo/descricao-curta`:

- `feat/` nova funcionalidade
- `fix/` correção
- `style/` ajustes visuais
- `refactor/` refatoração
- `docs/` documentação
- `ci/` integração e deploy
- `chore/` manutenção

**Commits** — [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/):

```
feat(missions): add horizontal scroll project gallery
fix(hero): prevent title overflow on small screens
```

Cada branch é integrada à `main` com merge `--no-ff`, preservando o histórico das features.
