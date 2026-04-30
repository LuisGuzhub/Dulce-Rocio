import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const iniciarSesionGoogle = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      localStorage.setItem("token", token);

      try {
        const res = await fetch("http://localhost:4000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/account");
        }
      } catch (error) {
        console.error(error);
        localStorage.clear();
        navigate("/login");
      }
    };

    iniciarSesionGoogle();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7efe9]">
      <p className="text-lg font-semibold text-[#3b241b]">
        Iniciando sesión...
      </p>
    </div>
  );
}