import React from 'react';

function PokemonDetails({ selectedPokemon, currentImage, setCurrentImage }) {
    if (!selectedPokemon) return null;

    return (
        <div className="selected-pokemon">
            <img
                src={currentImage}
                alt={selectedPokemon.name}
                onMouseEnter={() => setCurrentImage(selectedPokemon.hoverImage)}
                onMouseLeave={() => setCurrentImage(selectedPokemon.image)}
            />
            <h4>{selectedPokemon.name}</h4>

            <div className="pokemonDetails"> 
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

                {selectedPokemon.types && (
                    <div className="types">
                        <h5>Type:</h5>
                        <ul>
                            {selectedPokemon.types.split(', ').map((type, index) => (
                                <li key={index}>{type}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PokemonDetails;
