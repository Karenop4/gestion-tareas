import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const Dashboard = () => {
  const [tareaEnEdicion, setTareaEnEdicion] = useState(null);
  const [recargar, setRecargar] = useState(false);

  const actualizarLista = () => setRecargar(!recargar);

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Si usas React Router, podrías redirigir a login
      // navigate("/login");
      console.log("Sesión cerrada");
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 sm:gap-0">
        <h1 className="text-2xl font-bold text-center sm:text-left">
          Gestión de Tareas
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-800 px-4 py-2 rounded hover:bg-red-900 transition text-white font-semibold text-sm sm:text-base"
        >
          Cerrar sesión
        </button>
      </div>

      <TaskForm
        tareaEnEdicion={tareaEnEdicion}
        setTareaEnEdicion={setTareaEnEdicion}
        onAdd={actualizarLista}
        onUpdate={actualizarLista}
      />
      <TaskList
        setTareaEnEdicion={setTareaEnEdicion}
        key={recargar}
      />
    </div>

  );
};

export default Dashboard;
