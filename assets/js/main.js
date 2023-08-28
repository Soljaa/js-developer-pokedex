const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modalBtn = document.getElementById('modalBtn')
const details = document.getElementById('details')
const inner = document.getElementById('inner')
const background = document.getElementById('content')
let modalFlag = 0

const pokemonsInfo = {}

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="card pokemon ${pokemon.type}" id=${pokemon.number}>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    if (modalFlag) {
        return
    }
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemons.map((pokemon) => {
            pokemonsInfo[pokemon.number] = pokemon
        })
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        window.scroll({
            top: document.body.scrollHeight,
            behavior: "smooth",
        })
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)

    }
})

details.addEventListener('click', (event) => {
    if (event.target.matches('#modalBtn')) {
        details.style.display = 'none';
        background.style.opacity = '1';
        modalFlag = 0;
        inner.innerHTML = ''
    }
})

pokemonList.addEventListener('click', (event) => {
    if (modalFlag) {
        return
    }
    let card = event.target.closest(".card")
    if (card) {
        let selectedPokemon = pokemonsInfo[card.id]
        let modalContent = `
            <btn class="close-modal" type="button" id="modalBtn"> X </btn>
            <div class="image-info">
            <div class="pokemon-image">
                <img src="${selectedPokemon.photo}">
            </div>
            <h2 class="pokemon-name">${selectedPokemon.name} #${selectedPokemon.number}</h2>
            <div class="pokemon-info">                
                <p class="pokemon-height">Height: ${selectedPokemon.height / 10} m</p>
                <p class="pokemon-ability">Ability: ${selectedPokemon.ability}</p>
                <p class="pokemon-weight">Weight: ${selectedPokemon.weight} kg</p>
                <p class="pokemon-types">Types: ${selectedPokemon.type}</p>
            </div>
            </div>
            <h3 class="stats-title">Stats</h3>
            <div class="pokemon-stats">            
                <p class="stat">HP: ${selectedPokemon.stats.hp}</p>
                <p class="stat">Special Defense: ${selectedPokemon.stats['special-defense']}</p>
                <p class="stat">Defense: ${selectedPokemon.stats.defense}</p>
                <p class="stat">Special Attack: ${selectedPokemon.stats['special-attack']}</p>
                <p class="stat">Attack: ${selectedPokemon.stats.attack}</p>
                <p class="stat">Speed: ${selectedPokemon.stats.speed}</p>
            </div>
        `
        inner.innerHTML += modalContent
        details.style.display = 'flex'
        background.style.opacity = '0.5'
        modalFlag = 1
    }
})
