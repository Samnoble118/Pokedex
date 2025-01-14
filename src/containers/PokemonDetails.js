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
    );
}

export default PokemonDetails;
