import { useEffect, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
export default function LoginModal({ onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

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
        <div className="fixed top-0 left-0 w-screen h-screen z-[999999] bg-black/90 flex items-start justify-center pt-32 px-4">
            <div className="relative bg-white rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.7)] w-full max-w-md p-8">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-black"
                >
                    <X size={22} />
                </button>

                <h1 className="text-2xl font-bold text-center mb-6">
                    Iniciar sesión
                </h1>

                <form onSubmit={loginCliente}>
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

                    <p className="text-center mt-3 text-sm text-gray-600">
                        ¿Olvidaste tu contraseña?{" "}
                        <a href="/forgot-password" className="text-[#d78963] font-semibold hover:underline">
                            Recupérala aquí
                        </a>
                    </p>
                </form>

                <button
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
            </div>
        </div>
    );
}