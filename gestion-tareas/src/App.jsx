import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true); // para esperar la verificación de Firebase

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
      setCargando(false);
    });

    return () => unsubscribe(); // limpia el listener
  }, []);

  if (cargando) {
    return <p className="text-center mt-10 ">Cargando...</p>;
  }

  return (
    <div className="min-h-screen">
      {user ? <Dashboard user={user} /> : <Login onLogin={setUser} />}
    </div>
  );
}

export default App;
