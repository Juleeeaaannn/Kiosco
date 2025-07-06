import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/TotalesVentas.css';
import { Nav } from './Nav';

const TotalesVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState('hoy');
  const [loading, setLoading] = useState(true);
  const [totales, setTotales] = useState({
    efectivo: 0,
    transferencia: 0,
    total: 0
  });

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('ventas')
        .select('fecha_hora, metodo_pago, precio_venta');

      if (error) {
        console.error('Error al obtener ventas:', error);
      } else {
        setVentas(data);
      }
      setLoading(false);
    };

    fetchVentas();
  }, []);

  useEffect(() => {
    const hoy = new Date();
    let inicio;

    switch (filtro) {
      case 'hoy':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        break;
      case 'semana':
        const primerDia = hoy.getDate() - hoy.getDay() + 1;
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), primerDia);
        break;
      case 'mes':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        break;
      case 'anio':
        inicio = new Date(hoy.getFullYear(), 0, 1);
        break;
      default:
        inicio = null;
    }

    let efectivo = 0;
    let transferencia = 0;

    ventas.forEach((v) => {
      const fechaVenta = new Date(v.fecha_hora);
      if (!inicio || fechaVenta >= inicio) {
        const monto = parseFloat(v.precio_venta) || 0;
        if (v.metodo_pago === 'efectivo') efectivo += monto;
        if (v.metodo_pago === 'transferencia') transferencia += monto;
      }
    });

    setTotales({
      efectivo,
      transferencia,
      total: efectivo + transferencia
    });
  }, [filtro, ventas]);

  return (
    <div className="totales-container">
      <h2 className="totales-title">Totales de Ventas</h2>

      <div className="filtro-box">
        <label htmlFor="filtro-select">Filtrar por:</label>
        <select
          id="filtro-select"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-select"
        >
          <option value="hoy">Hoy</option>
          <option value="semana">Esta semana</option>
          <option value="mes">Este mes</option>
          <option value="anio">Este año</option>
        </select>
      </div>

      {loading ? (
        <p className="totales-loading">Cargando datos...</p>
      ) : (
        <div className="totales-list">
          <div className="totales-item efectivo">
            <span>Efectivo</span> <span>${totales.efectivo.toFixed(2)}</span>
          </div>
          <div className="totales-item transferencia">
            <span>Mercado Pago</span> <span>${totales.transferencia.toFixed(2)}</span>
          </div>
          <div className="totales-item total">
            <span>Total</span> <span>${totales.total.toFixed(2)}</span>
          </div>
        </div>
      )}
      <nav>
        <Nav estado="totales" />
      </nav>
    </div>
  );
};

export default TotalesVentas;
