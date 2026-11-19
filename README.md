# dev-portifolio

Portfólio de desenvolvedor de **Guilherme Dugonski** — uma viagem espacial guiada pela rolagem, construída com [GSAP](https://gsap.com) e seus plugins.

**Site:** https://dugonski.github.io/dev-portifolio/

## A experiência

Cada seção é uma etapa da missão, com uma interação de scroll própria:

| # | Seção | Experiência | Plugins |
|---|-------|-------------|---------|
| 00 | Preloader | Contagem regressiva de lançamento que se abre em cortina | `CustomEase` |
| 01 | Lançamento | Título se desfaz, planeta fica para trás e o campo de estrelas entra em dobra | `ScrollTrigger` (pin + scrub), `SplitText` |
| 02 | Órbita | Anéis desenhados pela rolagem, satélite em órbita e texto revelado palavra por palavra | `DrawSVGPlugin`, `MotionPathPlugin`, `SplitText` |
| 03 | Constelação | O stack vira um mapa estelar: linhas traçadas e nomes decodificados | `DrawSVGPlugin`, `ScrambleTextPlugin` |
| 04 | Missões | Rolagem vertical vira viagem horizontal pelos projetos | `ScrollTrigger` (`containerAnimation`) |
| 05 | Trajetória | Foguete percorre uma rota calculada a partir dos checkpoints | `MotionPathPlugin`, `DrawSVGPlugin` |
| 06 | Horizonte | Letras emergem de um buraco negro; marquee reage à velocidade do scroll | `SplitText`, `Observer` |

Global: `ScrollSmoother` (smooth scroll), `ScrollToPlugin`, cursor customizado, botões magnéticos, HUD com a distância percorrida até a Lua e campo de estrelas em canvas que acelera com a velocidade da rolagem.

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

- **Textos, projetos e jornada:** `index.html`
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
