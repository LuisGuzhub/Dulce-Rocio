import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
export default function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginCliente = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://dulce-rocio.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Correo o contraseña incorrectos");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user?.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/account";
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7efe9] px-4">
      <form
        onSubmit={loginCliente}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Iniciar sesión
        </h2>

        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-4 p-3 border rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="w-full p-3 pr-12 border rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#d78963] text-white py-3 rounded-xl font-semibold"
        >
          Entrar
        </button>

        <button
          type="button"
          onClick={() => {
            window.location.href = "https://dulce-rocio.onrender.com/api/auth/google";
          }}
          className="w-full mt-4 border py-3 rounded-xl"
        >
          Continuar con Google
        </button>

        <p className="text-center mt-5 text-sm">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-[#d78963] font-semibold">
            Regístrate
          </a>
        </p>
      </form>
    </div>
  );
}