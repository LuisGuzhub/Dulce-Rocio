import React, { useEffect, useMemo, useState } from 'react';
import {
    MessageCircle,
    CakeSlice,
    Pencil,
    Gift,
    Heart,
    ChevronLeft,
    ChevronRight,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    X
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import heroImage from '@/assets/imagen_inicial_pidePedido.png';
import tiramisuClasico from '@/assets/tiramisu_clasio/clasico_pedido.jpeg';
import paveLeche from '@/assets/pave_leche/leche_pedido.jpeg';
import paveOreo from '@/assets/pave_oreo/oreo_pedido.jpeg';
import tiramisuNutella from '@/assets/tiramisu_nutella/nuutella_pedido.jpeg';
import brownies from '@/assets/brownies/brownie_pedido.png';


function OrderPage() {

    const product1 = tiramisuClasico;
    const product2 = paveLeche;
    const product3 = paveOreo;
    const product4 = tiramisuNutella;
    const product5 = brownies;
    const products = [
        {
            id: 1,
            name: 'Tiramisú clásico',
            description: 'Clásico, cremoso y absolutamente irresistible.',
            price: 2.5,
            image: product1
        },
        {
            id: 2,
            name: 'Pave de leche',
            description: 'Suave, cremoso y con un dulzor que enamora.',
            price: 2.5,
            image: product2
        },
        {
            id: 3,
            name: 'Pave de oreo',
            description: 'Galletas Oreo, crema y muchísimo amor.',
            price: 2.5,
            image: product3
        },
        {
            id: 4,
            name: 'Tiramisú de nutella',
            description: 'Una mezcla intensa, cremosa y llena de antojo.',
            price: 3.5,
            image: product4
        },
        {
            id: 5,
            name: 'Brownies',
            description: 'Chocolate puro en cada mordida. Pequeños, pero peligrosamente adictivos.',
            price: 1.8,
            image: product5
        }
    ];

    const whatsappNumber = '593986887205';
    const [deliveryType, setDeliveryType] = useState("delivery");

    const [pickupBranch, setPickupBranch] = useState("");

    const [sector, setSector] = useState("");

    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [cart, setCart] = useState([]);
    const [savedCarts, setSavedCarts] = useState([]);
    const [showSavedCartPanel, setShowSavedCartPanel] = useState(false);

    const generateWhatsAppLink = (message) => {
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    };

    const formatPrice = (value) => {
        return Number(value).toFixed(2);
    };

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.id === product.id);

            if (existingProduct) {
                return prevCart.map((item) => {
                    if (item.id === product.id) {
                        return {
                            ...item,
                            quantity: item.quantity + 1
                        };
                    }
                    return item;
                });
            }

            return [
                ...prevCart,
                {
                    ...product,
                    quantity: 1
                }
            ];
        });
    };

    const increaseQuantity = (productId) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.id === productId) {
                    return {
                        ...item,
                        quantity: item.quantity + 1
                    };
                }
                return item;
            })
        );
    };

    const decreaseQuantity = (productId) => {
        setCart((prevCart) =>
            prevCart
                .map((item) => {
                    if (item.id === productId) {
                        return {
                            ...item,
                            quantity: item.quantity - 1
                        };
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const totalItems = useMemo(() => {
        return cart.reduce((accumulator, item) => accumulator + item.quantity, 0);
    }, [cart]);

    const totalPrice = useMemo(() => {
        return cart.reduce((accumulator, item) => {
            return accumulator + item.price * item.quantity;
        }, 0);
    }, [cart]);
    const deliveryFee = useMemo(() => {

        if (deliveryType === "pickup") {
            return 0;
        }

        if (!sector) {
            return 0;
        }

        const sectorPrices = {
            "Centro": 2,
            "Alborada": 2.5,
            "Urdesa": 3,
            "Via a la Costa": 4,
            "Sur": 3
        };

        return sectorPrices[sector] || 2.5;

    }, [sector, deliveryType]);

    const finalTotal = totalPrice + deliveryFee;

    const guardarPedido = async () => {
        if (cart.length === 0) {
            alert("Agrega al menos un postre al carrito.");
            return;
        }

        if (deliveryType === "delivery" && !sector) {
            alert("Debes seleccionar un sector antes de guardar el pedido.");
            return;
        }

        if (deliveryType === "pickup" && !pickupBranch) {
            alert("Debes seleccionar un punto de recogida.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Debes iniciar sesión para guardar tu pedido.");
            return;
        }

        try {
            const response = await fetch("https://dulce-rocio.onrender.com/api/cart/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    cart,
                    subtotal: totalPrice,
                    delivery_fee: deliveryFee,
                    total: finalTotal,
                    delivery_type: deliveryType,
                    delivery_address: deliveryAddress,
                    sector,
                    pickup_branch: pickupBranch
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "No se pudo guardar el pedido.");
                return;
            }

            alert("Pedido guardado correctamente. Podrás retomarlo luego desde tu carrito.");
            await cargarCarritosGuardados();
        } catch (error) {
            console.error(error);
            alert("Error al guardar el pedido.");
        }
    };
    const cargarCarritosGuardados = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const response = await fetch("https://dulce-rocio.onrender.com/api/cart/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setSavedCarts(data.carts || []);
            }
        } catch (error) {
            console.error("Error cargando carritos guardados:", error);
        }
    };

    useEffect(() => {
        cargarCarritosGuardados();
    }, []);

    const recuperarCarrito = (savedCart) => {
        const parsedCart = Array.isArray(savedCart.cart_data)
            ? savedCart.cart_data
            : JSON.parse(savedCart.cart_data);

        setCart(parsedCart);
        setDeliveryType(savedCart.delivery_type || "delivery");
        setSector(savedCart.sector || "");
        setDeliveryAddress(savedCart.delivery_address || "");
        setPickupBranch(savedCart.pickup_branch || "");
        setShowSavedCartPanel(false);

        alert("Pedido recuperado correctamente.");
    };

    const eliminarCarritoGuardado = async (cartId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Debes iniciar sesión.");
            return;
        }

        try {
            const response = await fetch(`https://dulce-rocio.onrender.com/api/cart/${cartId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                alert("No se pudo eliminar el carrito.");
                return;
            }

            await cargarCarritosGuardados();

            alert("Carrito eliminado.");
        } catch (error) {
            console.error(error);
            alert("Error eliminando carrito.");
        }
    };
    const whatsappCartMessage = useMemo(() => {
        if (cart.length === 0) {
            return 'Hola, quiero información sobre sus postres 💕';
        }

        let message = 'Hola, quiero hacer este pedido en Dulce Rocío:\n\n';

        cart.forEach((item) => {
            const subtotal = item.price * item.quantity;
            message += `• ${item.name} x${item.quantity} - $${formatPrice(subtotal)}\n`;
        });

        message += `\nTotal de productos: ${totalItems}`;
        message += `\nMétodo de entrega: ${deliveryType === "delivery" ? "Delivery" : "Retiro en local"}`;

        if (deliveryType === "delivery") {
            message += `\nSector: ${sector || "No especificado"}`;
            message += `\nDirección: ${deliveryAddress || "No especificada"}`;
            message += `\nDelivery: $${formatPrice(deliveryFee)}`;
        }

        if (deliveryType === "pickup") {
            message += `\nPunto de recogida: ${pickupBranch || "No especificado"}`;
        }

        message += `\nTotal final a pagar: $${formatPrice(finalTotal)} 💕`;

        return message;
    }, [cart, totalItems, totalPrice, deliveryType, sector, deliveryAddress, pickupBranch, deliveryFee, finalTotal]);

    return (
        <>
            <Header />
            <button
                type="button"
                onClick={() => setShowSavedCartPanel(true)}
                className="fixed bottom-6 right-6 z-[9998] bg-[#3b241b] text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center"
            >
                <ShoppingCart size={28} />

                {savedCarts.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#d78963] text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                        {savedCarts.length}
                    </span>
                )}
            </button>

            <main className="bg-[#f8f3ef] text-[#3d2a22]">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <div className="relative overflow-hidden rounded-[28px] min-h-[560px] grid grid-cols-1 lg:grid-cols-2 items-center">
                        <div className="absolute inset-0">
                            <img
                                src={heroImage}
                                alt="Postres Dulce Rocío"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#f7efe9]/95 via-[#f7efe9]/75 to-transparent"></div>
                        </div>

                        <div className="relative z-10 px-8 py-14 sm:px-12 lg:px-16 max-w-xl">
                            <h1
                                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none mb-3 text-[#2d1d17]"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                Pide tu postre
                            </h1>

                            <p
                                className="text-2xl sm:text-3xl mb-6 text-[#7a4c3a]"
                                style={{ fontFamily: 'Great Vibes, cursive' }}
                            >
                                Hechos con amor, para momentos inolvidables.
                            </p>

                            <p className="text-lg sm:text-xl leading-relaxed text-[#4a352d] mb-8 max-w-md">
                                Elige tu favorito, personalízalo a tu gusto y lo hacemos
                                especialmente para ti.
                            </p>

                            <div className="flex flex-col items-start gap-4">
                                <a
                                    href={generateWhatsAppLink(
                                        'Hola, quiero hacer mi pedido en Dulce Rocío 💕'
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-3 bg-[#e98e69] hover:bg-[#dd7d55] text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Hacer mi pedido
                                    <MessageCircle size={22} />
                                </a>

                                <div className="flex flex-col items-start gap-2 text-[#5f4338]">
                                    <div className="w-40 h-[2px] bg-[#e0b7a3] rounded-full"></div>

                                    <a
                                        href="#opciones"
                                        className="text-base hover:text-[#c56f4c] transition-colors"
                                    >
                                        o explora nuestras opciones
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="opciones"
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
                >
                    <div className="text-center mb-10">
                        <h2
                            className="text-4xl sm:text-5xl font-bold text-[#2d1d17]"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            ¿Qué antojo tienes hoy?
                        </h2>

                        <div className="flex items-center justify-center gap-3 mt-3">
                            <div className="w-10 h-[2px] bg-[#df9b7c]"></div>
                            <Heart size={16} className="text-[#df9b7c]" />
                            <div className="w-10 h-[2px] bg-[#df9b7c]"></div>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-[#ead8cc] shadow-md w-12 h-12 rounded-full items-center justify-center text-[#b97a5c]"
                            type="button"
                        >
                            <ChevronLeft size={22} />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {products.map((product) => {
                                const cartItem = cart.find((item) => item.id === product.id);
                                const quantityInCart = cartItem ? cartItem.quantity : 0;
                                const subtotal = cartItem ? cartItem.quantity * cartItem.price : 0;

                                return (
                                    <article
                                        key={product.id}
                                        className="bg-[#fcf8f5] border border-[#eadfd7] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="h-56 overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        <div className="p-5 text-center">
                                            <h3
                                                className="text-2xl font-bold mb-2 text-[#2d1d17]"
                                                style={{ fontFamily: 'Playfair Display, serif' }}
                                            >
                                                {product.name}
                                            </h3>

                                            <p className="text-[#c56f4c] font-semibold text-lg mb-3">
                                                ${formatPrice(product.price)}
                                            </p>

                                            <p className="text-sm leading-7 text-[#5d473f] min-h-[96px]">
                                                {product.description}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => addToCart(product)}
                                                className="inline-flex items-center justify-center gap-2 mt-4 bg-[#fff7f2] hover:bg-[#f7e7dc] text-[#c56f4c] font-medium px-5 py-3 rounded-full transition-colors"
                                            >
                                                <ShoppingCart size={18} />
                                                Agregar al carrito
                                            </button>

                                            <div className="mt-4 bg-[#f8eee8] border border-[#edd7ca] rounded-[18px] p-3">
                                                <p className="text-sm text-[#6a4c40] mb-2">
                                                    Cantidad en carrito
                                                </p>

                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (quantityInCart > 0) {
                                                                decreaseQuantity(product.id);
                                                            }
                                                        }}
                                                        className="w-9 h-9 rounded-full border border-[#e5cfc1] flex items-center justify-center text-[#b36e50] hover:bg-white transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>

                                                    <span className="min-w-[32px] text-lg font-bold text-[#2d1d17]">
                                                        {quantityInCart}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (quantityInCart === 0) {
                                                                addToCart(product);
                                                            } else {
                                                                increaseQuantity(product.id);
                                                            }
                                                        }}
                                                        className="w-9 h-9 rounded-full border border-[#e5cfc1] flex items-center justify-center text-[#b36e50] hover:bg-white transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                <p className="mt-3 text-sm font-medium text-[#7a4c3a]">
                                                    Subtotal: ${formatPrice(subtotal)}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <button
                            className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-[#ead8cc] shadow-md w-12 h-12 rounded-full items-center justify-center text-[#b97a5c]"
                            type="button"
                        >
                            <ChevronRight size={22} />
                        </button>
                    </div>
                </section>
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

                    <div className="bg-[#fcf8f5] border border-[#eadfd7] rounded-[28px] p-6 shadow-sm">

                        <h3
                            className="text-3xl font-bold text-[#2d1d17] mb-6"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            Método de entrega
                        </h3>

                        <div className="flex flex-wrap gap-4 mb-6">

                            <button
                                type="button"
                                onClick={() => setDeliveryType("delivery")}
                                className={`px-6 py-3 rounded-2xl border transition ${deliveryType === "delivery"
                                    ? "bg-[#d78963] text-white border-[#d78963]"
                                    : "bg-white border-[#eadfd7]"
                                    }`}
                            >
                                Delivery
                            </button>

                            <button
                                type="button"
                                onClick={() => setDeliveryType("pickup")}
                                className={`px-6 py-3 rounded-2xl border transition ${deliveryType === "pickup"
                                    ? "bg-[#d78963] text-white border-[#d78963]"
                                    : "bg-white border-[#eadfd7]"
                                    }`}
                            >
                                Retirar en local
                            </button>

                        </div>

                        {deliveryType === "delivery" && (

                            <div className="grid md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block mb-2 font-semibold">
                                        Sector
                                    </label>

                                    <select
                                        value={sector}
                                        onChange={(e) => setSector(e.target.value)}
                                        className="w-full border border-[#eadfd7] rounded-2xl p-4"
                                    >
                                        <option value="">Selecciona tu sector</option>
                                        <option value="Centro">Centro</option>
                                        <option value="Alborada">Alborada</option>
                                        <option value="Urdesa">Urdesa</option>
                                        <option value="Via a la Costa">Vía a la Costa</option>
                                        <option value="Sur">Sur</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold">
                                        Dirección
                                    </label>

                                    <input
                                        type="text"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        placeholder="Ingresa tu dirección"
                                        className="w-full border border-[#eadfd7] rounded-2xl p-4"
                                    />
                                </div>

                            </div>
                        )}

                        {deliveryType === "pickup" && (

                            <div>

                                <label className="block mb-2 font-semibold">
                                    Punto de recogida
                                </label>

                                <select
                                    value={pickupBranch}
                                    onChange={(e) => setPickupBranch(e.target.value)}
                                    className="w-full border border-[#eadfd7] rounded-2xl p-4"
                                >
                                    <option value="">Selecciona una sucursal</option>
                                    <option value="Urb Plaza Madeira">
                                        Urb Plaza Madeira
                                    </option>
                                    <option value="Alborada CC Plaza Mayor I">
                                        Alborada CC Plaza Mayor I
                                    </option>
                                    <option value="Sur">
                                        Sur
                                    </option>
                                </select>

                            </div>
                        )}

                    </div>

                </section>
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="bg-[#fcf8f5] border border-[#eadfd7] rounded-[28px] p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <ShoppingCart className="text-[#c57a59]" size={28} />
                            <h3
                                className="text-3xl font-bold text-[#2d1d17]"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                Tu carrito
                            </h3>
                        </div>

                        {cart.length === 0 ? (
                            <p className="text-[#5d473f] text-lg">
                                Aún no has agregado postres. El carrito está esperando con hambre.
                            </p>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {cart.map((item) => {
                                        const subtotal = item.price * item.quantity;

                                        return (
                                            <div
                                                key={item.id}
                                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-[#eadfd7] rounded-[20px] p-4 bg-white"
                                            >
                                                <div>
                                                    <h4 className="text-xl font-semibold text-[#2d1d17]">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-[#6b5147]">
                                                        ${formatPrice(item.price)} c/u
                                                    </p>
                                                    <p className="text-[#6b5147]">
                                                        {item.quantity} x ${formatPrice(item.price)} = ${formatPrice(subtotal)}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => decreaseQuantity(item.id)}
                                                        className="w-10 h-10 rounded-full border border-[#e5cfc1] flex items-center justify-center text-[#b36e50] hover:bg-[#f8eee8] transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>

                                                    <span className="min-w-[28px] text-center font-bold text-[#2d1d17]">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => increaseQuantity(item.id)}
                                                        className="w-10 h-10 rounded-full border border-[#e5cfc1] flex items-center justify-center text-[#b36e50] hover:bg-[#f8eee8] transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#f0d8cb] text-[#b85f4b] hover:bg-[#fff3ed] transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                        Quitar
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 pt-6 border-t border-[#eadfd7] flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    <div>

                                        <p className="text-lg text-[#3d2a22] font-medium">
                                            Total de productos:{' '}
                                            <span className="font-bold">{totalItems}</span>
                                        </p>

                                        <p className="text-2xl font-bold text-[#c56f4c] mt-1">
                                            Total productos: ${formatPrice(totalPrice)}
                                        </p>

                                        <p className="text-lg text-[#3d2a22] mt-2">
                                            Delivery: ${formatPrice(deliveryFee)}
                                        </p>

                                        <p className="text-3xl font-bold text-[#c56f4c] mt-2">
                                            Total final: ${formatPrice(finalTotal)}
                                        </p>

                                    </div>

                                    <div className="flex flex-wrap gap-4">

                                        <button
                                            type="button"
                                            onClick={guardarPedido}
                                            className="inline-flex items-center justify-center gap-3 bg-[#d78963] hover:bg-[#c97752] text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            <ShoppingCart size={22} />
                                            Guardar pedido
                                        </button>

                                        <a
                                            href={
                                                !sector && deliveryType === "delivery"
                                                    ? "#"
                                                    : generateWhatsAppLink(whatsappCartMessage)
                                            }
                                            onClick={(e) => {

                                                if (deliveryType === "delivery" && !sector) {

                                                    e.preventDefault();

                                                    alert("Debes seleccionar un sector antes de continuar.");
                                                }

                                                if (deliveryType === "pickup" && !pickupBranch) {

                                                    e.preventDefault();

                                                    alert("Debes seleccionar un punto de recogida.");
                                                }

                                            }}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-3 bg-[#e98e69] hover:bg-[#dd7d55] text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            <MessageCircle size={22} />
                                            Enviar pedido por WhatsApp
                                        </a>

                                    </div>

                                </div>
                            </>
                        )}
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#f3e7df] rounded-[24px] px-6 py-8">
                        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-[#e1cfc3] pb-4 md:pb-0">
                            <CakeSlice className="text-[#c57a59]" size={34} />
                            <p className="text-[#4a352d] leading-7">
                                Hechos al momento <br /> con ingredientes frescos
                            </p>
                        </div>

                        <div className="flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-[#e1cfc3] pb-4 lg:pb-0">
                            <Pencil className="text-[#c57a59]" size={34} />
                            <p className="text-[#4a352d] leading-7">
                                Personaliza tu postre <br /> como más te guste
                            </p>
                        </div>

                        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-[#e1cfc3] pb-4 md:pb-0">
                            <Gift className="text-[#c57a59]" size={34} />
                            <p className="text-[#4a352d] leading-7">
                                Ideal para regalos <br /> y ocasiones especiales
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Heart className="text-[#c57a59]" size={34} />
                            <p className="text-[#4a352d] leading-7">
                                Pedidos fáciles por <br /> WhatsApp y rápido
                            </p>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="bg-[#f3e7df] rounded-[24px] px-6 py-8 md:px-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                        <h2
                            className="text-3xl sm:text-4xl font-bold text-center lg:text-left text-[#2d1d17]"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            ¿Listo para endulzar tu día?
                        </h2>

                        <a
                            href={generateWhatsAppLink(
                                'Hola, quiero pedir ahora por WhatsApp 💕'
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-[#e98e69] hover:bg-[#dd7d55] text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300"
                        >
                            <MessageCircle size={22} />
                            Pide ahora por WhatsApp
                        </a>

                        <p
                            className="text-[#9d6b55] text-xl text-center"
                            style={{ fontFamily: 'Great Vibes, cursive' }}
                        >
                            Te respondemos al instante
                        </p>
                    </div>
                </section>
            </main>

            {showSavedCartPanel && (
                <div className="fixed inset-0 z-[9999] bg-black/40 flex justify-end">
                    <div className="w-full max-w-md bg-[#fffaf7] h-full shadow-2xl p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#3b241b]">
                                Pedidos guardados
                            </h2>

                            <button
                                type="button"
                                onClick={() => setShowSavedCartPanel(false)}
                                className="text-[#3b241b]"
                            >
                                <X size={26} />
                            </button>
                        </div>

                        {savedCarts.length === 0 ? (
                            <p className="text-[#7a5a4c]">
                                No tienes pedidos guardados todavía.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {savedCarts.map((savedCart) => {
                                    const cartData = Array.isArray(savedCart.cart_data)
                                        ? savedCart.cart_data
                                        : JSON.parse(savedCart.cart_data);

                                    return (
                                        <div
                                            key={savedCart.id}
                                            className="bg-white border border-[#ead8cc] rounded-2xl p-4 shadow-sm"
                                        >
                                            <p className="text-sm text-[#9a7463] mb-2">
                                                Guardado el{" "}
                                                {new Date(savedCart.created_at).toLocaleDateString()}
                                            </p>

                                            <div className="space-y-1 mb-3">
                                                {cartData.map((item) => (
                                                    <p
                                                        key={item.id}
                                                        className="text-sm text-[#3b241b]"
                                                    >
                                                        • {item.name} x{item.quantity}
                                                    </p>
                                                ))}
                                            </div>

                                            <p className="font-bold text-[#3b241b] mb-3">
                                                Total: ${formatPrice(savedCart.total)}
                                            </p>

                                            <p className="text-sm text-[#7a5a4c] mb-4">
                                                {savedCart.delivery_type === "pickup"
                                                    ? `Retiro: ${savedCart.pickup_branch || "No definido"}`
                                                    : `Delivery: ${savedCart.sector || "No definido"}`}
                                            </p>

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => recuperarCarrito(savedCart)}
                                                    className="flex-1 bg-[#d78963] hover:bg-[#c97752] text-white px-4 py-3 rounded-xl font-semibold"
                                                >
                                                    Recuperar
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => eliminarCarritoGuardado(savedCart.id)}
                                                    className="flex-1 border border-red-200 text-red-500 px-4 py-3 rounded-xl font-semibold hover:bg-red-50"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default OrderPage;