import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/ListaVentas.css"; // Asegúrate de que la ruta sea correcta
import { Nav } from "./Nav";

const ListaVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioFiltro, setUsuarioFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVentas();
    fetchUsuarios();
  }, []);

  const fetchVentas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ventas")
      .select("id_venta, precio_venta,metodo_pago, fecha_hora, usuarios (nomyap, id_usuario)")
      .order("fecha_hora", { ascending: false });

    if (error) {
      console.error("Error al obtener ventas:", error);
    } else {
      setVentas(data);
    }
    setLoading(false);
  };

  const fetchUsuarios = async () => {
    const { data, error } = await supabase.from("usuarios").select();
    if (!error) setUsuarios(data);
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  const formatearHora = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const horas = fecha.getHours().toString().padStart(2, "0");
    const minutos = fecha.getMinutes().toString().padStart(2, "0");
    return `${horas}:${minutos}`;
  };

  const handleEliminar = async (id) => {
    const clave = prompt("Ingresá la contraseña para eliminar:");
    if (clave !== "1234") {
      alert("❌ Contraseña incorrecta");
      return;
    }

    const { error } = await supabase.from("ventas").delete().eq("id_venta", id);
    if (error) {
      alert("Error al eliminar");
    } else {
      alert("✅ Venta eliminada");
      fetchVentas();
    }
  };

  // 🔍 Filtro combinado
  const ventasFiltradas = ventas.filter((v) => {
    const pasaUsuario =
      usuarioFiltro === "" || v.usuarios?.id_usuario === parseInt(usuarioFiltro);
    const pasaFecha =
      fechaFiltro === "" ||
      new Date(v.fecha_hora).toISOString().split("T")[0] === fechaFiltro;
    return pasaUsuario && pasaFecha;
  });
  //---------------------------------------------------------
  const clase =(venta) =>{ 
    if (parseFloat(venta.precio_venta) > 0) {
      return `venta-precio positivo`;
    } else { 
      return `venta-precio negativo`;
    } 
  }
  return (
    <div className="contenedor">
      <h2 className="titulo">Historial de Ventas</h2>

      <div className="filtros">
        <div className="grupo">
          <label>Filtrar por Usuario</label>
          <select
            className="select"
            value={usuarioFiltro}
            onChange={(e) => setUsuarioFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            {usuarios.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.nomyap}
              </option>
            ))}
          </select>
        </div>

        <div className="grupo">
          <label>Filtrar por Día</label>
          <input
            type="date"
            className="input"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="mensaje">Cargando ventas...</p>
      ) : ventasFiltradas.length === 0 ? (
        <p className="mensaje">No hay ventas para ese filtro.</p>
      ) : (
        <ul className="lista-ventas">
          {ventasFiltradas.map((venta) => (
            
            <li className={`item-venta-linea ${venta.metodo_pago === "efectivo" ? "contEF" : "contTRANSF"}`} key={venta.id_venta}>
            
            <span className="venta-dato user">{venta.usuarios?.nomyap}</span>
            <span className={`venta-dato metodo ${venta.metodo_pago === "efectivo" ? "metodo_ef" : "metodo_tansf"}`}>
              {venta.metodo_pago === "efectivo" ? "💵" :<span> <img src="../icons/mp.png" className="icon-img"/> </span> }
            </span>
            <span className="venta-dato hora">{formatearHora(venta.fecha_hora)}</span>
            <span className="venta-dato fecha">{formatearFecha(venta.fecha_hora)}</span>

            <span className={`venta-dato monto ${clase(venta)}`}>
              ${parseFloat(venta.precio_venta).toFixed(2)}
            </span>
            <button className="boton-eliminar" onClick={() => handleEliminar(venta.id_venta)}>🗑️</button>
          </li>
          ))}
        </ul>
      )}
      <nav>
        <Nav estado="lista" />
      </nav>
    </div>
  );
};

export default ListaVentas;
