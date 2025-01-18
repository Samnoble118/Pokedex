import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import pokemonLogo from '../Assets/pokemonLogo.svg.png';

const regions = [
  'Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova',
  'Kalos', 'Alola', 'Galar', 'Paldea'
];

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={pokemonLogo} alt="Pokémon Logo" />
      </Link>
      <div className="navbar-toggle" onClick={toggleMobileMenu}>
        <div className={`burger-icon ${isMobileMenuOpen ? 'active' : ''}`} />
      </div>
      <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="navbar-links">
          {regions.map((region) => (
            <li key={region}>
              <Link to={`/region/${region.toLowerCase()}`} className="navbar-link">
                {region}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
