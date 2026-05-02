import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const cambiarPassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://dulce-rocio.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "No se pudo cambiar la contraseña.");
        return;
      }

      alert("Contraseña actualizada correctamente.");
      window.location.href = "/login";
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
          onSubmit={cambiarPassword}
          className="bg-white rounded-3xl shadow-md border border-[#ead8cc] p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-center text-[#3b241b] mb-3">
            Nueva contraseña
          </h1>

          <p className="text-center text-[#7a5a4c] mb-6">
            Crea una nueva contraseña para volver a entrar a tu cuenta.
          </p>

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-12 rounded-xl border border-[#eadfd7] outline-none focus:border-[#d78963]"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#eadfd7] outline-none focus:border-[#d78963] mb-4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d78963] hover:bg-[#c97752] text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {loading ? "Actualizando..." : "Cambiar contraseña"}
          </button>

          <p className="text-center mt-5 text-sm">
            Volver a{" "}
            <Link to="/login" className="text-[#d78963] font-semibold">
              iniciar sesión
            </Link>
          </p>
        </form>
      </main>

      <Footer />
    </>
  );
}