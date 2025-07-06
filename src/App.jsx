import './App.css'
import ListaVentas from './components/ListaVentas';
import TotalesVentas from './components/TotalesVentas'
import VentasForm from './components/VentasForm'
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VentasForm />} />
          <Route path="/totales" element={<TotalesVentas />} />
          <Route path="/lista" element={<ListaVentas />} />
        </Routes>
      </BrowserRouter>
      </div>
    </>
  )
}

export default App
