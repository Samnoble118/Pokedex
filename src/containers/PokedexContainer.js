import { useState, useEffect } from 'react';

function PokedexContainer() {
    const [pokemonList, setPokemonList] = useState([]); 
    const [selectedPokemon, setSelectedPokemon] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch the list of Pokemon 
    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                setLoading(true);
                const reponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0');
                const data = await reponse.json();
                setPokemonList(data.results);
                setLoading(false);
            } catch (err) {
                setError('Failed to load the Pokemon list!');
                setLoading(false);
            }
        };
        fetchPokemonList();
    }, []);
}

export default PokedexContainer;
