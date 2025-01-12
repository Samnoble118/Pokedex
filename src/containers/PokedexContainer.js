import { useState, useEffect } from 'react';

function PokedexContainer() {
    const [pokemonList, setPokemonList] = useState([]); 
    const [selectedPokemon, setSelectedPokemon] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState('');

    // format the Pokemon name reponse 
    const formatPokemonName = (name) => {
        return name
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
            setLoading(true);
            const response = await fetch(url);
            const data = await response.json();
            const hoverImage = data.sprites.front_shiny;
            const defaultImage = data.sprites.front_default;
            setSelectedPokemon({
                name: formatPokemonName(data.name),
                abilities: data.abilities.map((ability) => ability.ability.name).join(', '),
                image: defaultImage,
                games: data.game_indices.map((game) => game.version.name).join(', '),
                hoverImage: hoverImage,
            });
            setCurrentImage(defaultImage);
            setLoading(false);
        } catch (err) {
            setError(`Couldn't find the Pokémon!`);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Pokédex</h1>
            <select onChange={(e) => fetchPokemonDetails(e.target.value)}>
                <option value="">Choose your Pokémon</option>
                {pokemonList.map((pokemon) => (
                    <option key={pokemon.name} value={pokemon.url}>
                        {pokemon.name}
                    </option>
                ))}
            </select>

            {/* display the Pokemon */}
            {selectedPokemon && (
                <div>
                    <img
                        src={currentImage}
                        alt={selectedPokemon.name}
                        onMouseEnter={() => setCurrentImage(selectedPokemon.hoverImage)} 
                        onMouseLeave={() => setCurrentImage(selectedPokemon.image)} 
                    />
                    <h4>{selectedPokemon.name}</h4>
                    <p>Abilities: {selectedPokemon.abilities}</p>
                    <p>Game Appearances: {selectedPokemon.games}</p>
                </div>
            )}
        </div>
    );
}

export default PokedexContainer;
