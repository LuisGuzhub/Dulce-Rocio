import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Credenciales incorrectas");
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7efe9] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-[#3b241b]">
          Panel Admin
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Acceso administrativo de Dulce Rocío
        </p>

        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-4 p-3 border rounded-xl outline-none focus:border-[#d78963]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 p-3 border rounded-xl outline-none focus:border-[#d78963]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#d78963] text-white py-3 rounded-xl font-semibold hover:bg-[#c97752] transition"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}