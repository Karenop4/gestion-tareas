import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";

const Login = ({ onLogin }) => {
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Inicia sesión</h2>
        <button
          onClick={handleLogin}
          className="bg-blue-600  px-6 py-2 rounded hover:bg-blue-700 font-semibold text-white transition-all duration-300 flex items-center justify-center"
        >
          Iniciar sesión con Google
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
