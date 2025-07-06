import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/VentasForm.css';
import { Nav } from './Nav';

const VentasForm = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [precioVenta, setPrecioVenta] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data, error } = await supabase.from('usuarios').select();
      if (error) {
        console.error('Error al obtener usuarios:', error);
      } else {
        setUsuarios(data);
      }
    };

    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuarioId || !precioVenta) {
      setMensaje('Completa todos los campos');
      return;
    }

    const { error } = await supabase.from('ventas').insert([
      {
        id_usuario: parseInt(usuarioId),
        metodo_pago: metodoPago,
        precio_venta: parseFloat(precioVenta),
        fecha_hora: new Date().toLocaleString("en-US", {
        timeZone: "America/Argentina/Buenos_Aires",
        }).toString(),
        id_producto: null
      }
    ]);

    if (error) {
      console.error(error);
      setMensaje('Error al guardar la venta');
    } else {
      setMensaje('✅ Venta registrada correctamente');
      setUsuarioId('');
      setMetodoPago('efectivo');
      setPrecioVenta('');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Registrar Venta</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Usuario</label>
          <select
            className="form-select"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
          >
            <option value="">Selecciona un usuario</option>
            {usuarios.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.nomyap}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Método de pago</label>
          <select
            className="form-select"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div className="form-group">
          <label>Monto vendido</label>
          <input
            type="number"
            className="form-input"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
            min="-9999999.99"
            step="0.01"
            placeholder="Ej: 1500.00"
          />
        </div>

        <button type="submit" className="form-button">
          Registrar Venta
        </button>

        {mensaje && <p className="form-message">{mensaje}</p>}
      </form>
      <nav>
        <Nav estado="venta" />
      </nav>
    </div>
  );
};

export default VentasForm;
