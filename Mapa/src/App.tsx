// src/App.tsx
import './App.css'; // Asegúrate de que esta importación esté presente
import SpainMap from './components/SpainMap';

function App() {
  return (
    <div className="App">
      <h1>Mapa de Viajes</h1>
      <SpainMap />
    </div>
  );
}

export default App;