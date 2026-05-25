# Pokédex

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![PokéAPI](https://img.shields.io/badge/PokéAPI-EF5350?style=flat)

Aplicação web para consulta de Pokémon, construída com HTML, CSS e JavaScript puro (sem frameworks ou bundlers). Consome a [PokéAPI](https://pokeapi.co) para exibir dados atualizados de todos os Pokémon disponíveis.

---

## Descrição

A Pokédex permite listar, buscar e filtrar Pokémon por nome ou tipo. Ao clicar em um card, um modal exibe informações detalhadas: estatísticas de batalha, habilidades, taxa de captura e cadeia de evoluções. A aplicação é totalmente responsiva, com menu mobile e suporte a navegação por teclado.

---

## Tecnologias utilizadas

- **HTML5** — estrutura semântica
- **CSS3** — estilização e responsividade
- **JavaScript (ES Modules)** — lógica da aplicação sem bundler
- **PokéAPI** — `https://pokeapi.co/api/v2` — fonte de dados
- **Google Fonts** — tipografia DM Sans
- **localStorage** — cache da lista de Pokémon para otimizar buscas

---

## Funcionalidades

- Listagem de Pokémon com paginação (18 por página)
- Busca por nome com debounce (400ms)
- Filtro por tipo (18 tipos, cada um com cor própria)
- Botão para limpar filtros
- Modal de detalhes com:
  - Imagem oficial, nome e número
  - Tipos com indicação visual por cor
  - Peso, altura e XP base
  - Habilidades (incluindo habilidades ocultas)
  - Taxa de captura com dificuldade (Fácil / Médio / Muito Difícil)
  - Barras de estatísticas (HP, Ataque, Defesa, Ataque Especial, Defesa Especial, Velocidade)
  - Cadeia de evoluções
- Skeleton loading durante o carregamento
- Lazy loading de imagens
- Menu mobile com overlay
- Acessibilidade: focus trap no modal, navegação por teclado (Enter, Escape, Tab)
- Estado reativo gerenciado localmente via classe `ReactiveState`

---

## Pré-requisitos

- Navegador moderno com suporte a ES Modules (Chrome 61+, Firefox 60+, Edge 79+, Safari 10.1+)
- Servidor HTTP local (necessário por conta dos caminhos absolutos e uso de `type="module"`)

> **Não é necessário** instalar Node.js, npm ou qualquer dependência — o projeto não possui `package.json`.

---

## Instalação

```bash
git clone https://github.com/luaragaia/pokedex.git
cd pokedex
```

---

## Como rodar

O projeto usa `type="module"` e caminhos absolutos (ex.: `/assets/...`), portanto **não funciona abrindo o `index.html` diretamente pelo sistema de arquivos (`file://`)**. É necessário servi-lo via HTTP.

### Opção 1 — Live Server (VS Code)

1. Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Clique com o botão direito em `index.html` > **Open with Live Server**

### Opção 2 — Python

```bash
# Python 3
python -m http.server 8080
```

Acesse `http://localhost:8080` no navegador.

### Opção 3 — Node.js (npx)

```bash
npx serve .
```

---

## Scripts disponíveis

Este projeto não utiliza gerenciador de pacotes. Não há scripts de build, lint ou test configurados.

---

## Estrutura de pastas

```
pokedex/
├── assets/           # Ícones e imagens (SVG, PNG)
├── css/
│   └── style.css     # Estilos globais e componentes
├── js/
│   ├── app.js        # Ponto de entrada — inicialização e eventos
│   ├── api.js        # Integração com a PokéAPI
│   ├── cache.js      # Cache da lista de Pokémon via localStorage
│   ├── constants.js  # Tipos, cores, labels de stats e configuração global
│   ├── focusTrap.js  # Acessibilidade — armadilha de foco no modal
│   ├── state.js      # Gerenciamento de estado reativo
│   ├── types.js      # Definições de tipos via JSDoc
│   ├── ui.js         # Renderização de componentes no DOM
│   └── utils.js      # Funções utilitárias (debounce, loading, erro)
└── index.html        # Documento principal
```

---

## Autor

**Luara Rosa De Azevedo Gaia**
- GitHub: [@luaragaia](https://github.com/luaragaia)
- E-mail: luaragaia.dev@gmail.com
