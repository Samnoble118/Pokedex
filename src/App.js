import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PokedexContainer from './containers/PokedexContainer';
import PokemonDetailsPage from './containers/pages/PokemonDetailsPage';
import RegionPage from './containers/pages/RegionPage';

function App() {
  const basename = process.env.NODE_ENV === 'production' ? '/Pokedex' : '/';

  return (
    <Router basename={basename}>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<PokedexContainer />} />
            <Route path="/region/:regionName" element={<RegionPage />} /> {/* Add this */}
            <Route path="/pokemon/:name" element={<PokemonDetailsPage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

