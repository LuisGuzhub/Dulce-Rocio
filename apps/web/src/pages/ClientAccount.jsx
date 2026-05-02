import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function ClientAccount() {
    const [user, setUser] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [sendingReview, setSendingReview] = useState(false);

    useEffect(() => {
        const cargarPerfil = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                window.location.href = "/login";
                return;
            }

            const res = await fetch("https://dulce-rocio.onrender.com/api/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }

            const data = await res.json();
            setUser(data.user);
        };

        cargarPerfil();
    }, []);
    const enviarResena = async (e) => {
        e.preventDefault();

        if (!comment.trim()) {
            alert("Escribe un comentario para enviar tu reseña.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        setSendingReview(true);

        try {
            const res = await fetch("https://dulce-rocio.onrender.com/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    rating: Number(rating),
                    comment,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "No se pudo enviar la reseña.");
                return;
            }

            alert("Reseña enviada correctamente.");
            setRating(5);
            setComment("");
        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor.");
        } finally {
            setSendingReview(false);
        }
    };

    if (!user) {
        return <p className="p-10 text-center">Cargando cuenta...</p>;
    }

    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#f7efe9] px-4 py-16">
                <section className="max-w-5xl mx-auto">
                    <div className="mb-10 text-center">
                        <p className="text-sm font-semibold text-[#d78963] uppercase tracking-[0.25em]">
                            Área de cliente
                        </p>

                        <h1 className="heading-serif text-4xl md:text-5xl font-bold text-[#3b241b] mt-3">
                            Mi cuenta
                        </h1>

                        <p className="text-[#7a5a4c] mt-4 max-w-2xl mx-auto">
                            Aquí puedes revisar la información de tu cuenta y, más adelante,
                            tus pedidos realizados en Dulce Rocío.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 items-start">
                        <div className="bg-white rounded-3xl shadow-md p-8 text-center border border-[#ead8cc]">
                            {user.photo_url ? (
                                <img
                                    src={user.photo_url}
                                    alt={user.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-5 object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full mx-auto mb-5 bg-[#f3d8c8] flex items-center justify-center text-3xl font-bold text-[#7a4a35]">
                                    {user.name?.charAt(0)?.toUpperCase() || "C"}
                                </div>
                            )}

                            <h2 className="text-2xl font-bold text-[#3b241b]">
                                Hola, {user.name}
                            </h2>

                            <p className="text-[#7a5a4c] mt-2">
                                Cliente Dulce Rocío
                            </p>

                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("user");
                                    window.location.href = "/";
                                }}
                                className="mt-6 bg-[#d78963] hover:bg-[#c97752] text-white px-6 py-3 rounded-xl font-semibold transition"
                            >
                                Cerrar sesión
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl shadow-md p-8 border border-[#ead8cc]">
                            <h3 className="text-xl font-bold text-[#3b241b] mb-6">
                                Información personal
                            </h3>

                            <div className="space-y-5">
                                <div>
                                    <p className="text-sm text-[#9a7463] mb-1">Nombre</p>
                                    <p className="font-semibold text-[#3b241b]">{user.name}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-[#9a7463] mb-1">Correo</p>
                                    <p className="font-semibold text-[#3b241b]">{user.email}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-[#9a7463] mb-1">Rol</p>
                                    <p className="font-semibold text-[#3b241b] capitalize">{user.role}</p>
                                </div>
                            </div>

                            <div className="mt-8 rounded-2xl bg-[#f7efe9] p-5">
                                <h4 className="font-bold text-[#3b241b] mb-2">
                                    Próximamente
                                </h4>
                                <p className="text-[#7a5a4c] text-sm">
                                    Aquí podrás ver tu historial de pedidos, productos favoritos
                                    y estado de tus compras.
                                </p>
                            </div>

                            <form
                                onSubmit={enviarResena}
                                className="mt-6 rounded-2xl bg-[#fff7f2] border border-[#ead8cc] p-5"
                            >
                                <h4 className="font-bold text-[#3b241b] mb-2">
                                    Deja tu reseña
                                </h4>

                                <p className="text-[#7a5a4c] text-sm mb-4">
                                    Cuéntanos cómo fue tu experiencia con Dulce Rocío.
                                </p>

                                <label className="block text-sm font-semibold text-[#3b241b] mb-2">
                                    Calificación
                                </label>

                                <select
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    className="w-full mb-4 p-3 rounded-xl border border-[#ead8cc] bg-white"
                                >
                                    <option value="5">5 estrellas</option>
                                    <option value="4">4 estrellas</option>
                                    <option value="3">3 estrellas</option>
                                    <option value="2">2 estrellas</option>
                                    <option value="1">1 estrella</option>
                                </select>

                                <label className="block text-sm font-semibold text-[#3b241b] mb-2">
                                    Comentario
                                </label>

                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="4"
                                    placeholder="Escribe tu opinión..."
                                    className="w-full p-3 rounded-xl border border-[#ead8cc] bg-white resize-none"
                                />

                                <button
                                    type="submit"
                                    disabled={sendingReview}
                                    className="mt-4 w-full bg-[#d78963] hover:bg-[#c97752] text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-60"
                                >
                                    {sendingReview ? "Enviando..." : "Enviar reseña"}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}