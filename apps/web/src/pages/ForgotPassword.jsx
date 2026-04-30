import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarRecuperacion = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      alert(data.message || "Revisa tu correo para recuperar tu contraseña.");
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7efe9] flex items-center justify-center px-4 py-16">
        <form
          onSubmit={enviarRecuperacion}
          className="bg-white rounded-3xl shadow-md border border-[#ead8cc] p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-center text-[#3b241b] mb-3">
            Recuperar contraseña
          </h1>

          <p className="text-center text-[#7a5a4c] mb-6">
            Escribe tu correo y te enviaremos un enlace seguro para cambiar tu contraseña.
          </p>

          <input
            type="email"
            placeholder="Tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#eadfd7] outline-none focus:border-[#d78963] mb-4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d78963] hover:bg-[#c97752] text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>

          <p className="text-center mt-5 text-sm">
            ¿Ya recordaste tu contraseña?{" "}
            <Link to="/login" className="text-[#d78963] font-semibold">
              Inicia sesión
            </Link>
          </p>
        </form>
      </main>

      <Footer />
    </>
  );
}