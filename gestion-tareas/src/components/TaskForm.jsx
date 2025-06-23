import { useEffect, useState } from "react";
import { guardarTarea, editarTarea } from "../utils/tareasService";
import { auth } from "../firebase";

const TaskForm = ({ onAdd, tareaEnEdicion, setTareaEnEdicion, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (tareaEnEdicion) {
      setTitle(tareaEnEdicion.titulo);
      setDescription(tareaEnEdicion.descripcion);
      setDueDate(tareaEnEdicion.fechaEntrega);
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
    }
  }, [tareaEnEdicion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) return alert("Título y fecha son obligatorios");
    if (!auth.currentUser) return alert("Debes iniciar sesión");

    const tarea = {
      titulo: title,
      descripcion: description,
      fechaEntrega: dueDate,
    };

    try {
      if (tareaEnEdicion) {
        await editarTarea(tareaEnEdicion.id, tarea);
        onUpdate(); // recargar lista en TaskList
        setTareaEnEdicion(null);
      } else {
        await guardarTarea(auth.currentUser.uid, tarea);
        onAdd(tarea);
      }

      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (error) {
      console.error("Error guardando la tarea", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-300 p-4 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {tareaEnEdicion ? "Editar Tarea" : "Nueva Tarea"}
      </h2>

      <input
        required
        type="text"
        placeholder="Título"
        className="w-full p-2 mb-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Descripción"
        className="w-full p-2 mb-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        required
        type="date"
        className="w-full p-2 mb-4 border rounded"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {tareaEnEdicion ? "Guardar Cambios" : "Agregar Tarea"}
      </button>
    </form>
  );
};

export default TaskForm;
