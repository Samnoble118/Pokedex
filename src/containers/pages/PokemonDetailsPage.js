import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './PokemonDetailsPage.scss';

function PokemonDetailsPage() {
    const { name } = useParams();  
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const formatText = (text) =>
        text
            .replace(/-/g, ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                const data = await response.json();
                setPokemon({
                    name: formatText(data.name),
                    abilities: data.abilities.map((ability) => formatText(ability.ability.name)).join(', '),
                    image: data.sprites.other['official-artwork'].front_default,
                    hoverImage: data.sprites.other['official-artwork'].front_shiny,
                    games: data.game_indices.map((game) => formatText(game.version.name)).join(', '),
                    types: data.types.map((type) => formatText(type.type.name)).join(', '),
                    stats: data.stats.map((stat) => ({
                        name: formatText(stat.stat.name),
                        baseStat: stat.base_stat,
                    })),
                    pokedexId: data.id,
                    height: data.height,
                    weight: data.weight, 
                });                
                setLoading(false);
            } catch (err) {
                setError('Failed to load Pokémon details!');
                setLoading(false);
            }
        };

        fetchPokemonDetails();
    }, [name]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="pokemon-details-page">
            
            <button className="go-back-btn" onClick={() => navigate(-1)}>
                ← Go Back
            </button>
            
            <img
                src={pokemon.image}
                alt={pokemon.name}
                onMouseEnter={() => setPokemon({ ...pokemon, image: pokemon.hoverImage })}
                onMouseLeave={() => setPokemon({ ...pokemon, image: pokemon.image })}
            />
            <h1>{pokemon.name}</h1>

            <div className="pokedexId">
                <h5>Pokedex ID:</h5>
                <p>{`#${pokemon.pokedexId.toString().padStart(4, '0')}`}</p>
            </div>

            <div className="types">
                <h5>Type:</h5>
                <p>{pokemon.types}</p>
            </div>

            {pokemon.stats && (
                <div className="stats">
                    <h5>Stats:</h5>
                    <ul>
                        {pokemon.stats.map((stat, index) => (
                            <li key={index}>
                                {stat.name}: {stat.baseStat} 
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="abilities">
                <h5>Abilities:</h5>
                <p>{pokemon.abilities}</p>
            </div>

            <div className="games">
                <h5>Game Appearances:</h5>
                <p>{pokemon.games}</p>
            </div>

            <div className="weight">
                <h5>Weight:</h5>
                <p>{pokemon.weight}</p>
            </div>

            <div className="height">
                <h5>Height:</h5>
                <p>{pokemon.height}</p>
            </div>

        </div>
    );
}

export default PokemonDetailsPage;
