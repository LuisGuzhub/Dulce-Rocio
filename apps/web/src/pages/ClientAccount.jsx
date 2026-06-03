import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function ClientAccount() {
    const [user, setUser] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [sendingReview, setSendingReview] = useState(false);
    const [loyalty, setLoyalty] = useState(null);

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

            const loyaltyRes = await fetch("https://dulce-rocio.onrender.com/api/loyalty/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (loyaltyRes.ok) {
                const loyaltyData = await loyaltyRes.json();
                setLoyalty(loyaltyData.loyalty);
            }
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

    const loyaltyProgress = Math.min(Number(loyalty?.purchased_items || 0), 8);
    const freeDesserts = Number(loyalty?.free_items_available || 0);
    const hasReward = freeDesserts > 0;

    return (
        <>
            <Header />
            <style>
                {`
                    @keyframes dulceRewardFloat {
                        0%, 100% { transform: translateY(0) scale(1); opacity: 0.55; }
                        50% { transform: translateY(-10px) scale(1.08); opacity: 1; }
                    }

                    @keyframes dulceRewardGlow {
                        0%, 100% { box-shadow: 0 18px 45px rgba(111, 78, 71, 0.12); }
                        50% { box-shadow: 0 22px 55px rgba(111, 78, 71, 0.28); }
                    }
                `}
            </style>

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
                            <div
                                className={`relative mt-6 rounded-3xl bg-[#fff7f2] border border-[#ead8cc] p-5 text-left overflow-hidden ${hasReward ? "ring-2 ring-[#6F4E47]/30" : ""}`}
                                style={hasReward ? { animation: "dulceRewardGlow 2.4s ease-in-out infinite" } : undefined}
                            >
                                {hasReward && (
                                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                                        {[...Array(10)].map((_, index) => (
                                            <span
                                                key={index}
                                                className="absolute h-2 w-2 rounded-full bg-[#6F4E47]/35"
                                                style={{
                                                    left: `${8 + ((index * 17) % 84)}%`,
                                                    top: `${10 + ((index * 23) % 76)}%`,
                                                    animation: `dulceRewardFloat ${1.8 + (index % 4) * 0.25}s ease-in-out infinite`,
                                                    animationDelay: `${index * 0.12}s`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-[#3b241b] mb-2">
                                    Tarjeta de fidelidad
                                </h3>

                                <p className="text-sm text-[#7a5a4c] mb-4">
                                    Por comprar 8 veces, recibes uno gratis.
                                </p>

                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {Array.from({ length: 8 }).map((_, index) => {
                                        const completed = index < loyaltyProgress;

                                        return (
                                            <div
                                                key={index}
                                                className={`h-10 rounded-xl flex items-center justify-center text-sm font-bold ${completed
                                                        ? "bg-[#6F4E47] text-white"
                                                        : "bg-white border border-[#ead8cc] text-[#7a5a4c]"
                                                    }`}
                                            >
                                                {index + 1}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* TODO backend: contar compras confirmadas, no cantidad de postres. */}
                                <p className="text-sm text-[#3b241b] font-semibold">
                                    Progreso: {loyaltyProgress} / 8 compras
                                </p>

                                <p className="text-sm text-[#7a5a4c] mt-1">
                                    Postres gratis disponibles:{" "}
                                    <span className="font-bold text-[#6F4E47]">
                                        {freeDesserts}
                                    </span>
                                </p>

                                {hasReward && (
                                    <div className="relative mt-4 rounded-2xl bg-[#3b241b] text-white px-4 py-4 overflow-hidden">
                                        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#d8b7a3]/25" />
                                        <div className="absolute -left-6 -bottom-8 h-20 w-20 rounded-full bg-white/10" />
                                        <p className="relative text-xs uppercase tracking-[0.18em] text-[#ead8cc] font-bold">
                                            Recompensa desbloqueada
                                        </p>
                                        <p className="relative mt-1 text-lg font-bold">
                                            Felicidades, tienes un postre gratis.
                                        </p>
                                        <p className="relative mt-1 text-sm text-[#f7efe9]">
                                            Completaste 8 compras y puedes reclamarlo en tu proximo pedido.
                                        </p>
                                    </div>
                                )}
                            </div>
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
