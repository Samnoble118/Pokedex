import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PokedexContainer from './containers/PokedexContainer';
import PokemonDetailsPage from './containers/pages/PokemonDetailsPage';
import RegionPage from './containers/pages/RegionPage';
import Navbar from './containers/Navbar'; 

function App() {
  const basename = process.env.NODE_ENV === 'production' ? '/Pokedex' : '/';

  return (
    <Router basename={basename}>
      <div className="App">
        <Navbar />

        <header className="App-header">
          <Routes>
            <Route path="/" element={<PokedexContainer />} />
            <Route path="/region/:regionName" element={<RegionPage />} />
            <Route path="/pokemon/:name" element={<PokemonDetailsPage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
