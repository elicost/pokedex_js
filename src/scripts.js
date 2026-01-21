let pokemonRepository = (function () {
    let pokeList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function getAll () {
        return pokeList;
    }

    function add (pokemon) {
        
        if (Object.keys(pokemon).includes('name') &&
            (typeof pokemon === 'object')) {
            pokeList.push(pokemon);
        } else {
            console.log('This is not an object or is missing key values')
        }
    };

    function addListItem(pokemon) {
        let pokeListContainer = document.querySelector('#pokeList');
      
        // BOOSTRAP COLUMNS
        let col = document.createElement('div');
        col.classList.add('col-6', 'col-md-4', 'col-lg-3', 'mb-3');
        
        // BOOTSTRAP BUTTONS
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('btn', 'btn-primary', 'btn-block', 'text-capitalize');
      
        // MODAL TRIGGER VIA DATA ATTRIBUTES
        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', '#pokemonModal');
        
        button.addEventListener('click', function () {
            showDetails(pokemon);
        });
        
        //  UPDATED APPEND FOR BOOTSTRAP LAYOUT
        col.appendChild(button);
        pokeListContainer.appendChild(col);
    }

// 	ADD SEARCH FUNCTION
    function populateDatalist() {
        const datalist = document.querySelector('#pokemon-names');
		pokeList.forEach(pokemon => {
			const option = document.createElement('option');
			option.value = pokemon.name;
			datalist.appendChild(option);
		});
    }

//	INSTRUCT SEARCH FUNCTION TO NEGATE CASE-SENSITIVITY, ALLOW PARTIAL-MATCH
	function filterPokemon(query) {
		const items = document.querySelectorAll('#pokeList > div');
		const lowerQuery = query.toLowerCase().trim();
		
		items.forEach(item => {
			const button = item.querySelector('button');
			const match = button.textContent
				.toLowerCase()
				.includes(lowerQuery);
			
			item.hidden = !match;
		});
	}
  
    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
                console.log(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        })
    }

    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types.map(t => t.type.name).join(', ');
        }).catch(function (e) {
            console.error(e);
        });
    }
    
    function showDetails(pokemon) {
    // UPDATED LOAD DETAILS FOR BOOTSTRAP
        loadDetails(pokemon).then(function () {
            document.querySelector('#pokemonModalLabel').innerText = pokemon.name;
            document.querySelector('#pokemon-image').src = pokemon.imageUrl;
            document.querySelector('#pokemon-image').alt = pokemon.name;
            document.querySelector('#pokemon-height').innerText = 'Height: ' + pokemon.height;
            document.querySelector('#pokemon-types').innerText = 'Types: ' + pokemon.types;
        })
    }
  
    return {
        getAll,
        add,
        addListItem,
        loadList,
        loadDetails,
        showDetails,
		populateDatalist,
		filterPokemon
		
    }

})()

pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon) {
        pokemonRepository.addListItem(pokemon);
    });

//	POPULATE SEARCH FIELD
pokemonRepository.populateDatalist();
	
});

//	LISTEN FOR SEARCH FIELD INPUT
document.getElementById('search-pokemon').addEventListener('input', function(e) {
	const value = e.target.value.toLowerCase();
	pokemonRepository.filterPokemon(value);
	
	const match = pokemonRepository
		.getAll()
		.find(p => p.name === value);
	
	if (match) {
		pokemonRepository.showDetails(match);
		$('#pokemonModal').modal('show');
	}
});