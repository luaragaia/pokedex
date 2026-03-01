export const POKEMON_TYPES = {
    normal: { name: 'Normal', color: '#9ca3af' },
    fire: { name: 'Fogo',  color: '#ff6b35' },
    water: { name: 'Água', color: '#3b82f6' },
    grass: { name: 'Planta', color: '#22c55e' },
    electric: { name: 'Elétrico', color: '#eab308' },
    ice: { name: 'Gelo', color: '#67e8f9' },
    fighting: { name: 'Lutador', color: '#dc2626' },
    poison: { name: 'Veneno', color: '#a855f7' },
    ground: { name: 'Terra', color: '#d97706' },
    flying: { name: 'Voador', color: '#818cf8' },
    psychic: { name: 'Psíquico', color: '#ec4899' },
    bug: { name: 'Inseto', color: '#84cc16' },
    rock: { name: 'Pedra', color: '#78716c' },
    ghost: { name: 'Fantasma', color: '#6366f1' },
    dragon: { name: 'Dragão', color: '#7c3aed' },
    dark: { name: 'Sombrio', color: '#374151' },
    steel: { name: 'Aço', color: '#94a3b8' },
    fairy: { name: 'Fada', color: '#f472b6' },
}

export const STAT_LABELS = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  spAtk: 'Ataque Especial',
  spDef: 'Defesa Especial',
  speed: 'Velocidade'
}

export const STAT_MAX = {
  hp: 255,
  attack: 190,
  defense: 230,
  spAtk: 194,
  spDef: 230,
  speed: 180
}

export const CONFIG = {
  PER_PAGE: 18,
  DEBOUNCE_DELAY: 400,
  MAX_POKEMON_LIMIT: 100000,
  API_BASE_URL: 'https://pokeapi.co/api/v2'
}
