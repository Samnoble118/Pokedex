import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import './PokedexContainer.scss';
import pokemonLogo from '../Assets/pokemonLogo.svg.png';

function PokedexContainer() {
    const [pokemonList, setPokemonList] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]); 

    const formatText = (text) => {
        return text
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    // Fetch Pokémon list
    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0');
                const data = await response.json();
                setPokemonList(data.results);
                setLoading(false);
            } catch (err) {
                setError('Failed to load the Pokémon list!');
                setLoading(false);
            }
        };
        fetchPokemonList();
    }, []);

    const fuse = new Fuse(pokemonList, {
        keys: ['name'],
        threshold: 0.4, 
    });

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setError('Please enter a Pokémon name!');
            setSuggestions([]); 
            return;
        }

        const results = fuse.search(searchTerm);
        setSuggestions(results.map(result => result.item)); 
    };

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
            setSuggestions([]); 
            setLoading(false);
        } catch (err) {
            setError(`Couldn't find the Pokémon!`);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="pokedex-container">
            <img src={pokemonLogo} alt="Pokédex Logo" className="pokedex-logo" />
            <h1>Pokédex</h1>
        
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setError('');
                            setSelectedPokemon(null);
                            setCurrentImage('');
                            setSuggestions([]);
                        }}
                    >
                        Clear Search
                    </button>
                </div>
            )}
        
            <div>
                <select onChange={(e) => fetchPokemonDetails(e.target.value)}>
                    <option value="">Choose your Pokémon</option>
                    {pokemonList.map((pokemon) => (
                        <option key={pokemon.name} value={pokemon.url}>
                            {formatText(pokemon.name)}
                        </option>
                    ))}
                </select>
        
                <input
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch();
                    }}
                    placeholder="Enter Pokémon name..."
                />
                <button onClick={handleSearch} type="button">
                    Search
                </button>
            </div>
        
            {suggestions.length > 0 && (
                <ul className="suggestions">
                    {suggestions.map((pokemon, index) => (
                        <li
                            key={index}
                            onClick={() => fetchPokemonDetails(pokemon.url)}
                        >
                            {formatText(pokemon.name)}
                        </li>
                    ))}
                </ul>
            )}
        
            {selectedPokemon && (
                <div className="selected-pokemon">
                    <img
                        src={currentImage}
                        alt={selectedPokemon.name}
                        onMouseEnter={() => setCurrentImage(selectedPokemon.hoverImage)}
                        onMouseLeave={() => setCurrentImage(selectedPokemon.image)}
                    />
                    <h4>{selectedPokemon.name}</h4>

                    {selectedPokemon.abilities && (
                        <div className="abilities">
                            <h5>Abilities:</h5>
                            <ul>
                                {selectedPokemon.abilities.split(', ').map((ability, index) => (
                                    <li key={index}>{ability}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {selectedPokemon.games && (
                        <div className="games">
                            <h5>Game Appearances:</h5>
                            <ul>
                                {selectedPokemon.games.split(', ').map((game, index) => (
                                    <li key={index}>{game}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PokedexContainer;
