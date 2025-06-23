import { useEffect, useState } from "react";
import { obtenerTareasDeUsuario, cambiarEstadoTarea, eliminarTarea } from "../utils/tareasService";
import { auth } from "../firebase";

const TaskList = ({ setTareaEnEdicion }) => {
  const [tareas, setTareas] = useState([]);

  // Obtener año y mes actuales como string (mes con dos dígitos)
  const anioActual = new Date().getFullYear();
  const mesActual = String(new Date().getMonth() + 1).padStart(2, "0");

  // Inicializamos los estados con el año y mes actual abiertos
  const [gruposAniosAbiertos, setGruposAniosAbiertos] = useState({ [anioActual]: true });
  const [gruposMesesAbiertos, setGruposMesesAbiertos] = useState({ [`${anioActual}-${mesActual}`]: true });

  const cargarTareas = async () => {
    if (!auth.currentUser) return;
    const tareasUsuario = await obtenerTareasDeUsuario(auth.currentUser.uid);
    tareasUsuario.sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega));
    setTareas(tareasUsuario);
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const agruparTareasPorAnioYMes = (tareas) => {
    return tareas.reduce((grupos, tarea) => {
      const fecha = new Date(tarea.fechaEntrega);
      const anio = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");

      if (!grupos[anio]) grupos[anio] = {};
      if (!grupos[anio][mes]) grupos[anio][mes] = [];

      grupos[anio][mes].push(tarea);
      return grupos;
    }, {});
  };

  const grupos = agruparTareasPorAnioYMes(tareas);

  const toggleGrupoAnio = (anio) => {
    setGruposAniosAbiertos((prev) => {
      if (prev[anio]) return {};
      return { [anio]: true };
    });
    // Cuando cambias año, también puedes cerrar todos los meses (opcional)
    setGruposMesesAbiertos({});
  };

  const toggleGrupoMes = (anio, mes) => {
    const key = `${anio}-${mes}`;
    setGruposMesesAbiertos((prev) => {
      if (prev[key]) return {};
      return { [key]: true };
    });
  };

  const renderTituloMes = (anio, mes) => {
    const fecha = new Date(Number(anio), Number(mes) - 1, 1);
    return fecha.toLocaleString("es-ES", { year: "numeric", month: "long" });
  };

  const manejarToggleCompletada = async (tarea) => {
    try {
      await cambiarEstadoTarea(tarea.id, !tarea.completada);
      await cargarTareas();
    } catch (error) {
      console.error("Error cambiando estado de la tarea:", error);
    }
  };

  const manejarEliminarTarea = async (id) => {
    try {
      await eliminarTarea(id);
      await cargarTareas();
    } catch (error) {
      console.error("Error eliminando la tarea:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 ">Tus Tareas</h2>
      {tareas.length === 0 ? (
        <p>No tienes tareas aún.</p>
      ) : (
        Object.entries(grupos).map(([anio, meses]) => (
          <section key={anio} className="mb-6 border-2 border-zinc-300 rounded-lg p-4 shadow-lg bg-zinc-300">

            <h2
              onClick={() => toggleGrupoAnio(anio)}
              className="cursor-pointer font-bold text-2xl mb-4 select-none"
            >
              {anio} {gruposAniosAbiertos[anio] ? "▼" : "▶"}
            </h2>

            {gruposAniosAbiertos[anio] &&
              Object.entries(meses).map(([mes, tareasDelMes]) => {
                const keyMes = `${anio}-${mes}`;
                return (
                  <div key={keyMes} className="mb-4 ml-4">
                    <h3
                      onClick={() => toggleGrupoMes(anio, mes)}
                      className="cursor-pointer font-semibold text-xl mb-2 select-none"
                    >
                      {renderTituloMes(anio, mes)} {gruposMesesAbiertos[keyMes] ? "▼" : "▶"}
                    </h3>

                    {gruposMesesAbiertos[keyMes] && (
                      <ul className="space-y-2 ml-4">
                        {tareasDelMes.map((tarea) => (
                          <li
                            key={tarea.id}
                            className={`p-3 rounded transition-all duration-300 ${
                              tarea.completada
                                ? "bg-green-100 line-through text-gray-500"
                                : "bg-gray-100"
                            }`}
                          >
                            <p className="font-semibold">{tarea.titulo}</p>
                            <p className="text-gray-500">{tarea.descripcion}</p>
                            <p>Entrega: {tarea.fechaEntrega}</p>
                            <p>{tarea.completada ? "✅ Completada" : "⏳ Pendiente"}</p>

                            <button
                              className="text-blue-600 hover:underline mt-2 rounded-sm px-2 py-1 border border-blue-600 hover:bg-blue-50 bg-green-100"
                              onClick={() => manejarToggleCompletada(tarea)}
                            >
                              {tarea.completada ? "Desmarcar" : "Marcar como completada"}
                            </button>

                            <button
                              className="text-yellow-600 hover:underline mt-2 ml-2 px-2 py-1 border border-yellow-600 hover:bg-yellow-50"
                              onClick={() => setTareaEnEdicion(tarea)}
                            >
                              Editar
                            </button>

                            <button
                              className="text-red-600 hover:underline mt-2 ml-2 px-2 py-1 border border-red-600 hover:bg-red-50"
                              onClick={() => {
                                if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
                                  manejarEliminarTarea(tarea.id);
                                }
                              }}
                            >
                              Eliminar
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
          </section>
        ))
      )}
    </div>
  );
};

export default TaskList;
