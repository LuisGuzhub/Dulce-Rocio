import { useState } from "react";

export default function ClientRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registrarCliente = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Cuenta creada correctamente");
      window.location.href = "/login";
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7efe9] flex items-center justify-center px-4">
      <form
        onSubmit={registrarCliente}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Crear cuenta
        </h1>

        <input
          type="text"
          placeholder="Nombre"
          className="w-full mb-4 p-3 border rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-4 p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-[#d78963] text-white py-3 rounded-lg">
          Registrarme
        </button>

        <p className="text-center mt-5 text-sm">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-[#d78963] font-semibold">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}