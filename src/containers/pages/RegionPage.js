import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './RegionPage.scss';

const RegionPage = () => {
  const { regionName } = useParams();
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showButton, setShowButton] = useState(false);

  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchRegionData = async () => {
      setLoading(true);
      setError(null);

      try {
        const regionToGenerationMap = {
          kanto: 1,
          johto: 2,
          hoenn: 3,
          sinnoh: 4,
          unova: 5,
          kalos: 6,
          alola: 7,
          galar: 8,
          paldea: 9,
        };

        const generationId = regionToGenerationMap[regionName.toLowerCase()];

        if (!generationId) {
          setError('Invalid region name.');
          setLoading(false);
          return;
        }

        const response = await fetch(`https://pokeapi.co/api/v2/generation/${generationId}/`);
        const data = await response.json();

        const pokemonData = await Promise.all(
          data.pokemon_species.map(async (pokemon) => {
            const baseName = pokemon.name;
            let url = `https://pokeapi.co/api/v2/pokemon/${baseName}`;
            // Check if this Pokémon has forms (like Deoxys)
            if (baseName === 'deoxys') {
              url = `https://pokeapi.co/api/v2/pokemon/${baseName}-normal`; 
            }

            try {
              const pokemonResponse = await fetch(url);
              const pokemonDetails = await pokemonResponse.json();
              
              const imageUrl = pokemonDetails.sprites?.other?.showdown?.front_default || pokemonDetails.sprites?.front_default || '';

              const speciesId = pokemon.url.match(/\/(\d+)\/$/)?.[1] || null;

              return {
                name: baseName,
                image: imageUrl,
                id: speciesId ? parseInt(speciesId, 10) : null,
              };
            } catch (err) {
              console.error(`Failed to fetch details for ${baseName}`);
              return null;
            }
          })
        );

        const validPokemonData = pokemonData.filter(pokemon => pokemon !== null);
        
        validPokemonData.sort((a, b) => (a.id || 0) - (b.id || 0));

        setPokemonList(validPokemonData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching region data:', err);
        setError('Failed to load Pokémon data.');
        setLoading(false);
      }
    };

    fetchRegionData();
  }, [regionName]);

  if (loading) {
    return <p>Loading Pokémon for {regionName}...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="region-page">
      <h1>Pokémon in {regionName.charAt(0).toUpperCase() + regionName.slice(1)}</h1>
      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          <div key={pokemon.name} className="pokemon-card">
            <div className="pokemon-image">
              {pokemon.image && (
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="pokemon-img"
                />
              )}
            </div>
            <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <Link to={`/pokemon/${pokemon.name.replace(/ /g, '-')}`}>View Details</Link>
          </div>
        ))}
      </div>

      <button
        className={`back-to-top ${showButton ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
};

export default RegionPage;
