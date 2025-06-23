import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

export async function guardarTarea(usuarioId, tarea) {
  try {
    await addDoc(collection(db, "tareas"), {
      userId: usuarioId,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaEntrega: tarea.fechaEntrega,
      creadaEn: serverTimestamp(),
      completada: false,
    });
    console.log("Tarea guardada");
  } catch (error) {
    console.error("Error guardando tarea:", error);
  }
}

export async function obtenerTareasDeUsuario(userId) {
  const tareasRef = collection(db, "tareas");
  const q = query(tareasRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const tareas = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return tareas;
}

export async function cambiarEstadoTarea(tareaId, nuevoEstado) {
  const tareaRef = doc(db, "tareas", tareaId);
  await updateDoc(tareaRef, {
    completada: nuevoEstado,
  });
}

export const editarTarea = async (id, nuevosDatos) => {
  const tareaRef = doc(db, "tareas", id);
  await updateDoc(tareaRef, nuevosDatos);
};

export const eliminarTarea = async (id) => {
  const tareaRef = doc(db, "tareas", id);
  await deleteDoc(tareaRef);
};