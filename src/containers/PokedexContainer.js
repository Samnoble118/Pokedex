import { useState, useEffect } from 'react';

function PokedexContainer() {
    const [pokemonList, setPokemonList] = useState([]); 
    const [selectedPokemon, setSelectedPokemon] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // format the text reponse 
    const formatText = (text) => {
        return text
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    // Fetch the list of Pokemon 
    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0');
                const data = await response.json();
                setPokemonList(data.results);
                setLoading(false);
            } catch (err) {
                setError(`Failed to load the Pokémon list!`);
                setLoading(false);
            }
        };
        fetchPokemonList();
    }, []);

    // Fetch a selected Pokemon 
    const fetchPokemonDetails = async (url) => {
        try {
            setError(null);
            setLoading(true);
            const response = await fetch(url);
            const data = await response.json();
            const hoverImage = data.sprites.front_shiny;
            const defaultImage = data.sprites.front_default;
            setSelectedPokemon({
                name: formatText(data.name),
                abilities: data.abilities.map((ability) => formatText(ability.ability.name)).join(', '),
                image: defaultImage,
                games: data.game_indices.map((game) => formatText(game.version.name)).join(', '),
                hoverImage: hoverImage,
            });
            setCurrentImage(defaultImage);
            setLoading(false);
        } catch (err) {
            setError(`Couldn't find the Pokémon!`);
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setError('Please enter a Pokémon name!');
            return;
        }        
        
        try {
            setError(null); 
            setLoading(true);
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
            if (!response.ok) {
                throw new Error('Pokémon not found');
            }
            const data = await response.json();
            const hoverImage = data.sprites.front_shiny;
            const defaultImage = data.sprites.front_default;
            setSelectedPokemon({
                name: formatText(data.name),
                abilities: data.abilities.map((ability) => formatText(ability.ability.name)).join(', '),
                image: data.sprites.front_default,
                games: data.game_indices.map((game) => formatText(game.version.name)).join(', '),
                hoverImage: data.sprites.front_shiny,
            });
            setCurrentImage(defaultImage);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Pokédex</h1>

            {error && (
                <div>
                    <p>{error}</p>
                    <button onClick={() => {
                        setSearchTerm('');
                        setError('');
                        setSelectedPokemon(null); 
                        setCurrentImage(''); 
                    }}>
                        Clear Search
                    </button>
                </div>
            )}

            <select onChange={(e) => fetchPokemonDetails(e.target.value)}>
                <option value="">Choose your Pokémon</option>
                {pokemonList.map((pokemon) => (
                    <option key={pokemon.name} value={pokemon.url}>
                        {formatText(pokemon.name)}
                    </option>
                ))}
            </select>
            
            <input
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setError(null); 
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
                placeholder="Enter Pokémon name..."
            />
            <button onClick={handleSearch} type='button'>Search your Pokémon!</button>

            {/* Display Pokémon details */}
            {selectedPokemon && (
                <div>
                    <img
                        src={currentImage}
                        alt={selectedPokemon.name}
                        onMouseEnter={() => setCurrentImage(selectedPokemon.hoverImage)} 
                        onMouseLeave={() => setCurrentImage(selectedPokemon.image)} 
                    />
                    <h4>{selectedPokemon.name}</h4>
                    {selectedPokemon.abilities && selectedPokemon.abilities.length > 0 && (
                        <p>Abilities: {selectedPokemon.abilities}</p>
                    )}
                    {selectedPokemon.games && selectedPokemon.games.length > 0 && (
                        <p>Game Appearances: {selectedPokemon.games}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default PokedexContainer;
