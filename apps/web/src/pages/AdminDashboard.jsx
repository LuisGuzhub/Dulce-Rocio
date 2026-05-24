import { useEffect, useState } from "react";
import { Package, Users, ShoppingBag, Star, LogOut, Eye, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [contactRequests, setContactRequests] = useState([]);
    const [loyalty, setLoyalty] = useState([]);
    const [stock, setStock] = useState([]);
    const [selectedStockBranch, setSelectedStockBranch] = useState("Urb Plaza Madeira");
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

                const resContactRequests = await fetch("https://dulce-rocio.onrender.com/api/admin/contact-requests", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (resContactRequests.ok) {
                    const requestsData = await resContactRequests.json();
                    setContactRequests(requestsData.requests || []);
                }

                const resStock = await fetch("https://dulce-rocio.onrender.com/api/products-stock");

                if (resStock.ok) {
                    const stockData = await resStock.json();
                    setStock(stockData.stock || []);
                }

                const resLoyalty = await fetch("https://dulce-rocio.onrender.com/api/admin/loyalty", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (resLoyalty.ok) {
                    const loyaltyData = await resLoyalty.json();
                    setLoyalty(loyaltyData.loyalty || []);
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

    const adminSections = [
        { name: "Dashboard", value: "dashboard" },
        { name: "Pedidos", value: "orders" },
        { name: "Clientes", value: "clients" },
        { name: "Fidelidad", value: "loyalty" },
        { name: "Productos", value: "products" },
        { name: "Mensajes / Solicitudes", value: "requests" },
        { name: "Reseñas", value: "reviews" },
    ];

    const menuItem = (name, value) => (
        <button
            type="button"
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
        { title: "Pedidos", value: orders.length, icon: ShoppingBag, section: "orders" },
        { title: "Clientes", value: users.length, icon: Users, section: "clients" },
        { title: "Productos", value: "0", icon: Package, section: "products" },
        { title: "Solicitudes", value: contactRequests.length, icon: MessageSquare, section: "requests" },
        { title: "Reseñas", value: reviews.length, icon: Star, section: "reviews" },
    ];

    return (
        <div className="min-h-screen bg-[#f7efe9]">
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r p-6 hidden md:block">
                <h1 className="text-2xl font-bold text-[#7a4a35] mb-10">
                    Dulce Rocío
                </h1>

                <nav className="space-y-4">
                    {adminSections.map((item) => (
                        <div key={item.value}>
                            {menuItem(item.name, item.value)}
                        </div>
                    ))}
                </nav>

                <button
                    onClick={cerrarSesion}
                    className="absolute bottom-6 left-6 flex items-center gap-2 text-red-500"
                >
                    <LogOut size={18} />
                    Cerrar sesión
                </button>
            </aside>

            <main className="md:ml-64 p-6 pb-28 md:p-10">
                <div className="md:hidden sticky top-0 z-30 -mx-6 mb-6 border-b border-[#eadfd7] bg-[#f7efe9]/95 px-4 py-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-[#d78963] font-bold">
                                Menú admin
                            </p>
                            <p className="text-lg font-bold text-[#3b241b]">
                                Dulce Rocío
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={cerrarSesion}
                            className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-semibold text-red-500 shadow-sm"
                        >
                            <LogOut size={16} />
                            Salir
                        </button>
                    </div>

                    <nav
                        aria-label="Navegación móvil del panel administrativo"
                        className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {adminSections.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setSection(item.value)}
                                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${section === item.value
                                    ? "bg-[#6F4E47] text-white border-[#6F4E47] shadow-md"
                                    : "bg-white text-[#6F4E47] border-[#eadfd7]"
                                    }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-sm text-gray-500">Panel administrativo</p>

                        <h2 className="text-3xl font-bold text-[#3b241b]">
                            {section === "dashboard" && "Bienvenido, Admin"}
                            {section === "orders" && "Gestión de pedidos"}
                            {section === "clients" && "Clientes registrados"}
                            {section === "loyalty" && "Fidelidad de clientes"}
                            {section === "requests" && "Mensajes / Solicitudes"}
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
                        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
                            {cards.map((card) => {
                                const Icon = card.icon;

                                return (
                                    <button
                                        key={card.title}
                                        type="button"
                                        onClick={() => setSection(card.section)}
                                        className="bg-white rounded-2xl p-6 shadow-sm text-left transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#d78963]/40"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-gray-500">{card.title}</p>
                                            <Icon className="text-[#d78963]" size={24} />
                                        </div>

                                        <h3 className="text-3xl font-bold text-[#3b241b]">
                                            {card.value}
                                        </h3>
                                    </button>
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
                {section === "loyalty" && (
                    <LoyaltyTable loyalty={loyalty} />
                )}

                {section === "products" && (
                    <ProductsInventory
                        stock={stock}
                        setStock={setStock}
                        selectedStockBranch={selectedStockBranch}
                        setSelectedStockBranch={setSelectedStockBranch}
                    />
                )}

                {section === "requests" && (
                    <ContactRequestsTable
                        requests={contactRequests}
                        setRequests={setContactRequests}
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
                        <th className="p-4">Dirección</th>
                        <th className="p-4">Sector</th>
                        <th className="p-4">Pago</th>
                        <th className="p-4">Subtotal</th>
                        <th className="p-4">Delivery</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Mapa</th>
                        <th className="p-4">Estado</th>
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
                            <tr key={order.id} className="border-t align-top">
                                <td className="p-4">
                                    <div className="font-semibold">
                                        {order.customer_name}
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {order.customer_email}
                                    </div>
                                </td>

                                <td className="p-4">
                                    <div>{order.product_name}</div>

                                    <div className="text-sm text-gray-500">
                                        Cantidad: {order.quantity}
                                    </div>
                                </td>

                                <td className="p-4 max-w-xs">
                                    {order.delivery_address || "No registrada"}
                                </td>

                                <td className="p-4">
                                    {order.sector || "No definido"}
                                </td>

                                <td className="p-4">
                                    <span className="bg-[#f7efe9] px-3 py-1 rounded-full text-sm">
                                        {order.payment_method || "pendiente"}
                                    </span>
                                </td>

                                <td className="p-4 font-semibold">
                                    ${order.subtotal || 0}
                                </td>

                                <td className="p-4 font-semibold text-[#d78963]">
                                    ${order.delivery_fee || 0}
                                </td>

                                <td className="p-4 font-bold text-[#3b241b]">
                                    ${order.total}
                                </td>

                                <td className="p-4">
                                    {
                                        order.latitude && order.longitude ? (
                                            <a
                                                href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                Ver mapa
                                            </a>
                                        ) : (
                                            "Sin ubicación"
                                        )
                                    }
                                </td>

                                <td className="p-4">
                                    {order.status}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    );
}

function ProductsInventory({
    stock,
    setStock,
    selectedStockBranch,
    setSelectedStockBranch
}) {
    const [localStock, setLocalStock] = useState([]);

    const branches = [
        "Urb Plaza Madeira",
        "Alborada CC Plaza Mayor I",
        "Sur"
    ];

    useEffect(() => {
        setLocalStock(stock);
    }, [stock]);

    const branchStock = localStock.filter((item) => {
        return item.branch_name === selectedStockBranch;
    });

    const updateLocalQuantity = (item, newQuantity) => {
        const quantity = Math.max(0, Number(newQuantity));

        setLocalStock((currentStock) =>
            currentStock.map((stockItem) => {
                if (
                    stockItem.branch_name === item.branch_name &&
                    stockItem.product_id === item.product_id
                ) {
                    return {
                        ...stockItem,
                        stock_quantity: quantity,
                        in_stock: quantity > 0
                    };
                }

                return stockItem;
            })
        );
    };

    const saveBranchInventory = async () => {
        const token = localStorage.getItem("token");

        try {
            for (const item of branchStock) {
                const response = await fetch("https://dulce-rocio.onrender.com/api/admin/update-stock", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        branch_name: item.branch_name,
                        product_id: item.product_id,
                        stock_quantity: Number(item.stock_quantity)
                    }),
                });

                if (!response.ok) {
                    throw new Error("No se pudo actualizar un producto.");
                }
            }

            setStock(localStock);

            alert(`Inventario actualizado para ${selectedStockBranch}`);
        } catch (error) {
            console.error(error);
            alert("Hubo un error actualizando el inventario.");
        }
    };

    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-2 text-[#3b241b]">
                Inventario por sucursal
            </h3>

            <p className="text-gray-600 mb-6">
                Controla cuántos postres hay disponibles en cada sucursal.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
                {branches.map((branch) => (
                    <button
                        key={branch}
                        type="button"
                        onClick={() => setSelectedStockBranch(branch)}
                        className={`px-5 py-3 rounded-xl font-semibold border transition ${selectedStockBranch === branch
                            ? "bg-[#6F4E47] text-white border-[#6F4E47]"
                            : "bg-white text-[#6F4E47] border-[#eadfd7]"
                            }`}
                    >
                        {branch}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-[#f7efe9]">
                        <tr>
                            <th className="p-4">Producto</th>
                            <th className="p-4">Cantidad disponible</th>
                            <th className="p-4">Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        {branchStock.map((item) => (
                            <tr key={`${item.branch_name}-${item.product_id}`} className="border-t">
                                <td className="p-4 font-semibold">
                                    {item.product_name}
                                </td>

                                <td className="p-4">
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.stock_quantity ?? 0}
                                        onChange={(event) => updateLocalQuantity(item, event.target.value)}
                                        className="w-28 border border-[#eadfd7] rounded-xl px-3 py-2 outline-none focus:border-[#6F4E47]"
                                    />
                                </td>

                                <td className="p-4">
                                    {Number(item.stock_quantity) > 0 ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                            En stock
                                        </span>
                                    ) : (
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                                            Agotado
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                type="button"
                onClick={saveBranchInventory}
                className="mt-6 bg-[#d78963] hover:bg-[#c97752] text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
            >
                Actualizar inventario para {selectedStockBranch}
            </button>
        </section>
    );
}

function LoyaltyTable({ loyalty }) {
    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
            <h3 className="text-xl font-bold mb-4 text-[#3b241b]">
                Fidelidad de clientes
            </h3>

            <table className="w-full text-left min-w-[700px]">
                <thead className="bg-[#f7efe9]">
                    <tr>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Correo</th>
                        <th className="p-4">Progreso</th>
                        <th className="p-4">Postres gratis</th>
                    </tr>
                </thead>

                <tbody>
                    {loyalty.length === 0 ? (
                        <tr>
                            <td className="p-4 text-gray-500" colSpan="4">
                                Todavía no hay datos de fidelidad.
                            </td>
                        </tr>
                    ) : (
                        loyalty.map((item) => (
                            <tr key={item.email} className="border-t">
                                <td className="p-4">{item.name}</td>
                                <td className="p-4">{item.email}</td>
                                <td className="p-4 font-semibold">
                                    {item.purchased_items} / 8
                                </td>
                                <td className="p-4 font-bold text-[#d78963]">
                                    {item.free_items_available}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    );
}

function ContactRequestsTable({ requests, setRequests }) {
    const markAsRead = async (requestId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`https://dulce-rocio.onrender.com/api/admin/contact-requests/${requestId}/read`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("No se pudo actualizar la solicitud.");
            }

            setRequests((currentRequests) =>
                currentRequests.map((request) =>
                    request.id === requestId
                        ? { ...request, status: "leído" }
                        : request
                )
            );
        } catch (error) {
            console.error(error);
            alert("No se pudo marcar la solicitud como leída.");
        }
    };

    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
            <h3 className="text-xl font-bold mb-4 text-[#3b241b]">
                Mensajes y solicitudes de contacto
            </h3>

            <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-[#f7efe9]">
                    <tr>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Correo</th>
                        <th className="p-4">Celular</th>
                        <th className="p-4">Tipo</th>
                        <th className="p-4">Mensaje</th>
                        <th className="p-4">Fecha</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Acción</th>
                    </tr>
                </thead>

                <tbody>
                    {requests.length === 0 ? (
                        <tr>
                            <td className="p-4 text-gray-500" colSpan="8">
                                Todavía no hay mensajes o solicitudes registradas.
                            </td>
                        </tr>
                    ) : (
                        requests.map((request) => (
                            <tr key={request.id} className="border-t align-top">
                                <td className="p-4 font-semibold">{request.customer_name}</td>
                                <td className="p-4">{request.customer_email}</td>
                                <td className="p-4">{request.phone}</td>
                                <td className="p-4">{request.product_type || "Consulta"}</td>
                                <td className="p-4 max-w-md whitespace-pre-wrap">{request.message}</td>
                                <td className="p-4">
                                    {new Date(request.created_at).toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${request.status === "leído"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-[#f7efe9] text-[#7a4a35]"
                                        }`}
                                    >
                                        {request.status || "pendiente"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {request.status === "leído" ? (
                                        <span className="text-sm text-gray-500">Atendido</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => markAsRead(request.id)}
                                            className="bg-[#d78963] hover:bg-[#c97752] text-white px-4 py-2 rounded-xl font-semibold transition"
                                        >
                                            Marcar leído
                                        </button>
                                    )}
                                </td>
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
