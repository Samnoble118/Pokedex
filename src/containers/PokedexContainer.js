import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import './ThePokedex.scss';
import pokemonLogo from '../Assets/pokemonLogo.svg.png';
import PokemonDetails from './PokemonDetails';
import ErrorMessage from './ErrorMessage'; 
import { Link } from 'react-router-dom';

function PokedexContainer() {
    const [pokemonList, setPokemonList] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const formatText = (text) =>
        text
            .replace(/-/g, ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0');
                const data = await response.json();
                setPokemonList(data.results);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load the Pokémon list!');
                setLoading(false);
            }
        };
        fetchPokemonList();
    }, []);

    const fuse = new Fuse(pokemonList, { keys: ['name'], threshold: 0.4 });

    const handleSearch = () => {
        setError(null); 
        if (!searchTerm.trim()) {
            setError('Please enter a Pokémon name!');
            setSuggestions([]);
            return;
        }
        const results = fuse.search(searchTerm);
        if (results.length === 0) {
            setError('No Pokémon found!');
        } else {
            setSuggestions(results.map((result) => result.item));
        }
    };

    const debouncedHandleSearch = debounce(handleSearch, 300);

    const fetchPokemonDetails = async (url) => {
        try {
            setError(null);
            setLoading(true);
            const response = await fetch(url);
            const data = await response.json();
            setSelectedPokemon({
                name: formatText(data.name),
                abilities: data.abilities.map((ability) => formatText(ability.ability.name)).join(', '),
                image: data.sprites.front_default,
                hoverImage: data.sprites.front_shiny || data.sprites.front_default,  
                games: data.game_indices.map((game) => formatText(game.version.name)).join(', '),
                types: data.types.map((type) => formatText(type.type.name)).join(', '),
            });
            setCurrentImage(data.sprites.front_default);
            setSuggestions([]);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(`Couldn't find the Pokémon!`);
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setError('');
        setSelectedPokemon(null);
        setCurrentImage('');
        setSuggestions([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }    

    return (
        <div className="pokedex-container">
            <img src={pokemonLogo} alt="Pokédex Logo" className="pokedex-logo" />
            <h1>Pokédex</h1>

            {error && <ErrorMessage error={error} clearSearch={clearSearch} />}  

            <div>
                <select onChange={(e) => fetchPokemonDetails(e.target.value)}>
                    <option value="">Choose your Pokémon</option>
                    {pokemonList
                        .filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((pokemon) => (
                            <option key={pokemon.name} value={pokemon.url}>
                                {formatText(pokemon.name)}
                            </option>
                        ))}
                </select>

                <input
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        debouncedHandleSearch();
                    }}
                    onKeyDown={handleKeyDown}  
                    placeholder="Enter Pokémon name..."
                />

                <button onClick={handleSearch} type="button">
                    SEARCH
                </button>
            </div>

            {suggestions.length > 0 && (
                <ul className="suggestions">
                    {suggestions.map((pokemon, index) => (
                        <li key={index} onClick={() => fetchPokemonDetails(pokemon.url)}>
                            {formatText(pokemon.name)}
                        </li>
                    ))}
                </ul>
            )}

            {selectedPokemon && (
                <div className="pokemon-summary">
                    <PokemonDetails
                        selectedPokemon={selectedPokemon}
                        currentImage={currentImage}
                        setCurrentImage={setCurrentImage}
                    />
                    <Link to={`/pokemon/${encodeURIComponent(selectedPokemon.name.toLowerCase().replace(/ /g, '-'))}`}>
                        <button className="view-more-btn">SEE MORE</button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default PokedexContainer;
