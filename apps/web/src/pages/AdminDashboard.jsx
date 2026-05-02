import { useEffect, useState } from "react";
import { Package, Users, ShoppingBag, Star, LogOut, Eye } from "lucide-react";

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [section, setSection] = useState("dashboard");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarAdmin = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                window.location.href = "/";
                return;
            }

            try {
                const resProfile = await fetch("https://dulce-rocio.onrender.com/api/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!resProfile.ok) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/";
                    return;
                }

                const profileData = await resProfile.json();

                if (profileData.user?.role !== "admin") {
                    window.location.href = "/account";
                    return;
                }

                setUser(profileData.user);

                const resOrders = await fetch("https://dulce-rocio.onrender.com/api/admin/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (resOrders.ok) {
                    const ordersData = await resOrders.json();
                    setOrders(ordersData.orders || []);
                }

                const resUsers = await fetch("https://dulce-rocio.onrender.com/api/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (resUsers.ok) {
                    const usersData = await resUsers.json();
                    setUsers(usersData.users || []);
                }
                const resReviews = await fetch("https://dulce-rocio.onrender.com/api/admin/reviews", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (resReviews.ok) {
                    const reviewsData = await resReviews.json();
                    setReviews(reviewsData.reviews || []);
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
            }
        };

        cargarAdmin();
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const menuItem = (name, value) => (
        <button
            onClick={() => setSection(value)}
            className={`block w-full text-left transition ${section === value
                ? "font-semibold text-[#d78963]"
                : "text-gray-600 hover:text-[#d78963]"
                }`}
        >
            {name}
        </button>
    );

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7efe9]">
                <p className="text-[#7a4a35] font-semibold">
                    Verificando administrador...
                </p>
            </div>
        );
    }

    const cards = [
        { title: "Pedidos", value: orders.length, icon: ShoppingBag },
        { title: "Clientes", value: users.length, icon: Users },
        { title: "Productos", value: "0", icon: Package },
        { title: "Reseñas", value: reviews.length, icon: Star },
    ];

    return (
        <div className="min-h-screen bg-[#f7efe9]">
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r p-6 hidden md:block">
                <h1 className="text-2xl font-bold text-[#7a4a35] mb-10">
                    Dulce Rocío
                </h1>

                <nav className="space-y-4">
                    {menuItem("Dashboard", "dashboard")}
                    {menuItem("Pedidos", "orders")}
                    {menuItem("Clientes", "clients")}
                    {menuItem("Productos", "products")}
                    {menuItem("Reseñas", "reviews")}
                </nav>

                <button
                    onClick={cerrarSesion}
                    className="absolute bottom-6 left-6 flex items-center gap-2 text-red-500"
                >
                    <LogOut size={18} />
                    Cerrar sesión
                </button>
            </aside>

            <main className="md:ml-64 p-6 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-sm text-gray-500">Panel administrativo</p>

                        <h2 className="text-3xl font-bold text-[#3b241b]">
                            {section === "dashboard" && "Bienvenido, Admin"}
                            {section === "orders" && "Gestión de pedidos"}
                            {section === "clients" && "Clientes registrados"}
                            {section === "products" && "Gestión de productos"}
                            {section === "reviews" && "Reseñas de clientes"}
                        </h2>
                    </div>

                    <button
                        onClick={() => {
                            window.location.href = "/";
                        }}
                        className="flex items-center justify-center gap-2 bg-[#d78963] hover:bg-[#c97752] text-white px-5 py-3 rounded-xl font-semibold shadow-md transition"
                    >
                        <Eye size={18} />
                        Ver página como cliente
                    </button>
                </div>

                {section === "dashboard" && (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                            {cards.map((card) => {
                                const Icon = card.icon;

                                return (
                                    <div
                                        key={card.title}
                                        className="bg-white rounded-2xl p-6 shadow-sm"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-gray-500">{card.title}</p>
                                            <Icon className="text-[#d78963]" size={24} />
                                        </div>

                                        <h3 className="text-3xl font-bold text-[#3b241b]">
                                            {card.value}
                                        </h3>
                                    </div>
                                );
                            })}
                        </div>

                        <OrdersTable orders={orders.slice(0, 5)} title="Pedidos recientes" />
                    </>
                )}

                {section === "orders" && (
                    <OrdersTable orders={orders} title="Todos los pedidos" />
                )}

                {section === "clients" && (
                    <section className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
                        <h3 className="text-xl font-bold mb-4 text-[#3b241b]">
                            Clientes
                        </h3>

                        <table className="w-full text-left min-w-[700px]">
                            <thead className="bg-[#f7efe9]">
                                <tr>
                                    <th className="p-4">Nombre</th>
                                    <th className="p-4">Correo</th>
                                    <th className="p-4">Rol</th>
                                    <th className="p-4">Proveedor</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td className="p-4 text-gray-500" colSpan="4">
                                            Todavía no hay clientes registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((client) => (
                                        <tr key={client.id} className="border-t">
                                            <td className="p-4">{client.name}</td>
                                            <td className="p-4">{client.email}</td>
                                            <td className="p-4">{client.role}</td>
                                            <td className="p-4">{client.provider}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </section>
                )}

                {section === "products" && (
                    <SectionPlaceholder
                        title="Productos"
                        text="Aquí luego podrás crear, editar y eliminar postres como tiramisú, pavés y brownies."
                    />
                )}

                {section === "reviews" && (
                    <ReviewsTable reviews={reviews} />
                )}
            </main>
        </div>
    );
}

function OrdersTable({ orders, title }) {
    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
            <h3 className="text-xl font-bold mb-4 text-[#3b241b]">{title}</h3>

            <table className="w-full text-left min-w-[700px]">
                <thead className="bg-[#f7efe9]">
                    <tr>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Producto</th>
                        <th className="p-4">Cantidad</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Total</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td className="p-4 text-gray-500" colSpan="5">
                                Todavía no hay pedidos registrados.
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id} className="border-t">
                                <td className="p-4">{order.customer_name}</td>
                                <td className="p-4">{order.product_name}</td>
                                <td className="p-4">{order.quantity}</td>
                                <td className="p-4">{order.status}</td>
                                <td className="p-4 font-semibold">${order.total}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    );
}
function ReviewsTable({ reviews }) {
    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
            <h3 className="text-xl font-bold mb-4 text-[#3b241b]">
                Reseñas de clientes
            </h3>

            <table className="w-full text-left min-w-[800px]">
                <thead className="bg-[#f7efe9]">
                    <tr>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Correo</th>
                        <th className="p-4">Calificación</th>
                        <th className="p-4">Comentario</th>
                        <th className="p-4">Fecha</th>
                    </tr>
                </thead>

                <tbody>
                    {reviews.length === 0 ? (
                        <tr>
                            <td className="p-4 text-gray-500" colSpan="5">
                                Todavía no hay reseñas registradas.
                            </td>
                        </tr>
                    ) : (
                        reviews.map((review) => (
                            <tr key={review.id} className="border-t align-top">
                                <td className="p-4">{review.customer_name}</td>
                                <td className="p-4">{review.customer_email}</td>
                                <td className="p-4 font-semibold">
                                    {"★".repeat(review.rating)}
                                </td>
                                <td className="p-4 max-w-md">{review.comment}</td>
                                <td className="p-4">
                                    {new Date(review.created_at).toLocaleString()}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    );
}
function SectionPlaceholder({ title, text }) {
    return (
        <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-[#3b241b]">{title}</h3>
            <p className="text-gray-600">{text}</p>
        </section>
    );
}