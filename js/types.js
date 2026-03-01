/**
 * @typedef {Object} PokemonType
 * @property {string} name - Nome em português do tipo
 * @property {string} color - Cor hexadecimal do tipo
 */

/**
 * @typedef {Object} PokemonStats
 * @property {number} hp - Hit Points
 * @property {number} attack - Ataque
 * @property {number} defense - Defesa
 * @property {number} spAtk - Ataque Especial
 * @property {number} spDef - Defesa Especial
 * @property {number} speed - Velocidade
 */

/**
 * @typedef {Object} PokemonAbility
 * @property {string} name - Nome da habilidade
 * @property {boolean} isHidden - Se é habilidade oculta
 */

/**
 * @typedef {Object} Evolution
 * @property {number} id - ID do Pokémon
 * @property {string} name - Nome do Pokémon
 * @property {string} imgUrl - URL da imagem
 */

/**
 * @typedef {Object} Pokemon
 * @property {number} id - ID único do Pokémon
 * @property {string} name - Nome do Pokémon
 * @property {string[]} types - Array de tipos (ex: ['fire', 'flying'])
 * @property {string} primaryType - Tipo primário
 * @property {string} imgUrl - URL da imagem
 * @property {string} number - Número formatado (ex: '#001')
 * @property {number} height - Altura em metros
 * @property {number} weight - Peso em kg
 * @property {PokemonStats} stats - Estatísticas do Pokémon
 * @property {PokemonAbility[]} abilities - Habilidades
 * @property {number} baseExperience - XP base
 * @property {number} captureRate - Taxa de captura (0-255)
 * @property {Evolution[]} evolutions - Evoluções
 */

/**
 * @typedef {Object} AppState
 * @property {number} currentPage - Página atual
 * @property {number} perPage - Itens por página
 * @property {string} query - Termo de busca
 * @property {number} total - Total de pokémons
 * @property {string|null} activeType - Tipo ativo no filtro
 */

/**
 * @typedef {Object} PokemonListResponse
 * @property {Pokemon[]} pokemons - Array de pokémons
 * @property {number} total - Total de pokémons disponíveis
 */

export {}
