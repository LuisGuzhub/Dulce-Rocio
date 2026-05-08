import React, { useEffect, useMemo, useState, useRef } from 'react';
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
    CreditCard,
    Building2,
    ExternalLink,
    X,
    MapPin,
    Truck
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import heroImage from '@/assets/imagen_inicial_pidePedido.png';

import tiramisuClasico from '@/assets/tiramisu_clasio/clasico_pedido.jpeg';
import paveLeche from '@/assets/pave_leche/leche_pedido.jpeg';
import paveOreo from '@/assets/pave_oreo/oreo_pedido.jpeg';
import tiramisuNutella from '@/assets/tiramisu_nutella/nuutella_pedido.jpeg';
import brownies from '@/assets/brownies/brownie_pedido.png';
import paveNutella from '@/assets/pave_nutella/pave_nute_pedido.jpeg';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({
    selectedPosition,
    setSelectedPosition,
    setDeliveryAddress
}) {
    useMapEvents({
        async click(event) {
            const lat = event.latlng.lat;
            const lng = event.latlng.lng;

            setSelectedPosition([lat, lng]);

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );

                const data = await response.json();

                if (data?.display_name) {
                    setDeliveryAddress(data.display_name);
                }
            } catch (error) {
                console.error("Error obteniendo dirección:", error);
            }
        },
    });

    return <Marker position={selectedPosition} />;
}

function OrderPage() {
    const scrollRef = useRef(null);

    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [loggedUser, setLoggedUser] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryFee, setDeliveryFee] = useState('');
    const [selectedSector, setSelectedSector] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState([
        -2.170998,
        -79.922359
    ]);

    const payphonePaymentLink = "https://ppls.me/BIKDskIgJy8yEfY3c4Q9IQ";
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const userData = JSON.parse(storedUser);

            setLoggedUser(userData);
            setCustomerName(userData.name || "");
            setCustomerEmail(userData.email || "");
        }
    }, []);
    const deliveryZones = [
        { name: "Centro", fee: 2.00 },
        { name: "Bahía", fee: 2.00 },
        { name: "9 de Octubre", fee: 2.00 },
        { name: "Garay", fee: 2.25 },
        { name: "Suburbio", fee: 2.50 },
        { name: "Febres Cordero", fee: 2.50 },
        { name: "Letamendi", fee: 2.50 },
        { name: "García Moreno", fee: 2.50 },

        { name: "Sur", fee: 2.50 },
        { name: "Guasmo", fee: 3.00 },
        { name: "Floresta", fee: 3.00 },
        { name: "Pradera", fee: 3.00 },
        { name: "Los Esteros", fee: 3.25 },
        { name: "Trinitaria", fee: 3.50 },
        { name: "Fertisa", fee: 3.50 },

        { name: "Urdesa", fee: 3.00 },
        { name: "Kennedy", fee: 3.00 },
        { name: "Garzota", fee: 3.00 },
        { name: "Alborada", fee: 3.00 },
        { name: "Sauces", fee: 3.00 },
        { name: "Samanes", fee: 3.50 },
        { name: "Mucho Lote", fee: 3.75 },
        { name: "Mapasingue", fee: 3.50 },
        { name: "Bastión Popular", fee: 4.00 },
        { name: "Pascuales", fee: 4.50 },

        { name: "Ceibos", fee: 4.00 },
        { name: "Vía a la Costa", fee: 5.00 },
        { name: "Puerto Azul", fee: 5.00 },
        { name: "Samborondón", fee: 5.00 },
        { name: "La Aurora", fee: 5.50 },
        { name: "Daule", fee: 6.00 },
        { name: "Durán", fee: 5.00 }
    ];

    const products = [
        {
            id: 1,
            name: 'Tiramisú clásico',
            description: 'Clásico, cremoso y absolutamente irresistible.',
            price: 2.5,
            image: tiramisuClasico
        },
        {
            id: 2,
            name: 'Pave de leche',
            description: 'Suave, cremoso y con un dulzor que enamora.',
            price: 2.5,
            image: paveLeche
        },
        {
            id: 3,
            name: 'Pave de oreo',
            description: 'Galletas Oreo, crema y muchísimo amor.',
            price: 2.5,
            image: paveOreo
        },
        {
            id: 4,
            name: 'Tiramisú de nutella',
            description: 'Una mezcla intensa, cremosa y llena de antojo.',
            price: 3.5,
            image: tiramisuNutella
        },
        {
            id: 5,
            name: 'Brownies',
            description: 'Chocolate puro en cada mordida. Pequeños, pero peligrosamente adictivos.',
            price: 1.8,
            image: brownies
        },
        {
            id: 6,
            name: 'Pave de nutella',
            description: 'Cremoso, dulce y con ese toque de Nutella que conquista.',
            price: 2.5,
            image: paveNutella
        }
    ];

    const whatsappNumber = '593986887205';

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -320,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 320,
                behavior: 'smooth'
            });
        }
    };

    const generateWhatsAppLink = (message) => {
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    };

    const formatPrice = (value) => {
        return Number(value).toFixed(2);
    };
    const openPaymentModal = () => {
        if (cart.length === 0) {
            alert('Agrega al menos un postre al carrito.');
            return;
        }

        if (!customerName || !customerEmail) {
            alert('Tu nombre y correo son necesarios para continuar con el pago.');
            return;
        }

        setShowPaymentModal(true);
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
    const finalTotal = useMemo(() => {
        const deliveryValue = Number(deliveryFee) || 0;
        return totalPrice + deliveryValue;
    }, [totalPrice, deliveryFee]);

    const whatsappCartMessage = useMemo(() => {
        if (cart.length === 0) {
            return 'Hola, quiero información sobre sus postres 💕';
        }

        let message = 'Hola, quiero hacer este pedido en Dulce Rocío:\n\n';

        cart.forEach((item) => {
            const subtotal = item.price * item.quantity;
            message += `• ${item.name} x${item.quantity} - $${formatPrice(subtotal)}\n`;
        });

        message += `\nNombre: ${customerName || 'No especificado'}`;
        message += `\nCorreo: ${customerEmail || 'No especificado'}`;
        message += `\nTotal de productos: ${totalItems}`;
        message += `\nDirección de entrega: ${deliveryAddress || 'No especificada'}`;
        message += `\nSector: ${selectedSector || 'No especificado'}`;
        message += `\nCosto de delivery: $${formatPrice(deliveryFee || 0)}`;
        message += `\nTotal final a pagar: $${formatPrice(finalTotal)} 💕`;

        return message;
    }, [cart, totalItems, totalPrice, finalTotal, customerName, customerEmail, deliveryAddress, selectedSector, deliveryFee]);

    const guardarPedido = async () => {
        if (cart.length === 0) {
            alert('Agrega al menos un postre al carrito.');
            return;
        }

        if (!customerName || !customerEmail) {
            alert('Escribe tu nombre y correo para guardar el pedido.');
            return;
        }

        try {
            for (const item of cart) {
                const response = await fetch('https://dulce-rocio.onrender.com/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        customer_name: customerName,
                        customer_email: customerEmail,

                        product_name: item.name,
                        quantity: item.quantity,

                        subtotal: totalPrice,
                        delivery_fee: deliveryFee,
                        total: finalTotal,

                        delivery_address: deliveryAddress,
                        sector: selectedSector,

                        latitude: selectedPosition[0],
                        longitude: selectedPosition[1],

                        payment_method: "pendiente"
                    })
                });

                if (!response.ok) {
                    throw new Error('No se pudo guardar uno de los productos.');
                }
            }

            alert('Pedido guardado correctamente. Ya aparece en el panel del administrador.');

            setCart([]);
            setCustomerName('');
            setCustomerEmail('');
        } catch (error) {
            console.error(error);
            alert('Hubo un error al guardar el pedido.');
        }
    };

    return (
        <>
            <Header />

            <main className="bg-[#f8f3ef] text-[#3d2a22]">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <div className="relative overflow-hidden rounded-[28px] min-h-[560px] grid grid-cols-1 lg:grid-cols-2 items-center">
                        <div className="absolute inset-0">
                            <img
                                src={heroImage}
                                alt="Postres Dulce Rocío"
                                className="w-full h-full object-cover object-[65%_center] sm:object-center"
                            />

                            <div className="absolute inset-0 bg-gradient-to-r from-[#f7efe9]/95 via-[#f7efe9]/60 to-transparent sm:from-[#f7efe9]/95 sm:via-[#f7efe9]/75"></div>
                        </div>

                        <div className="relative z-10 px-8 py-14 sm:px-12 lg:px-16 max-w-xl">
                            <h1
                                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none mb-3 text-[#2d1d17]"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                Pide tu postre
                            </h1>

                            <p className="heading-brush text-2xl sm:text-3xl mb-6 text-[#d77f5f]">
                                Hechos con amor
                            </p>

                            <p className="text-lg sm:text-xl leading-relaxed text-[#4a352d] mb-8 max-w-md">
                                Elige tu favorito, personalízalo a tu gusto y lo hacemos especialmente para ti.
                            </p>

                            <div className="flex flex-col items-start gap-4">
                                <a
                                    href={generateWhatsAppLink('Hola, quiero hacer mi pedido en Dulce Rocío 💕')}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-3 bg-[#6F4E47] hover:bg-[#4F3124] text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Hacer mi pedido
                                    <MessageCircle size={22} />
                                </a>

                                <div className="flex flex-col items-start gap-2 text-[#5f4338]">
                                    <div className="w-40 h-[2px] bg-[#6F4E47] rounded-full"></div>

                                    <a href="#opciones" className="text-base hover:text-[#4F3124] transition-colors">
                                        o explora nuestras opciones
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="opciones" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-10">
                        <h2
                            className="text-4xl sm:text-5xl font-bold text-[#2d1d17]"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            ¿Qué antojo tienes hoy?
                        </h2>

                        <div className="flex items-center justify-center gap-3 mt-3">
                            <div className="w-10 h-[2px] bg-[#6F4E47]"></div>
                            <Heart size={16} className="text-[#6F4E47]" />
                            <div className="w-10 h-[2px] bg-[#6F4E47]"></div>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={scrollLeft}
                            className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-[#ead8cc] shadow-md w-12 h-12 rounded-full items-center justify-center text-[#6F4E47]"
                            type="button"
                        >
                            <ChevronLeft size={22} />
                        </button>

                        <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth px-2 pb-4">
                            {products.map((product) => {
                                const cartItem = cart.find((item) => item.id === product.id);
                                const quantityInCart = cartItem ? cartItem.quantity : 0;
                                const subtotal = cartItem ? cartItem.quantity * cartItem.price : 0;

                                return (
                                    <article
                                        key={product.id}
                                        className="min-w-[260px] max-w-[260px] bg-[#fcf8f5] border border-[#eadfd7] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
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

                                            <p className="text-[#6F4E47] font-semibold text-lg mb-3">
                                                ${formatPrice(product.price)}
                                            </p>

                                            <p className="text-sm leading-7 text-[#5d473f] min-h-[96px]">
                                                {product.description}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => addToCart(product)}
                                                className="inline-flex items-center justify-center gap-2 mt-4 bg-[#fff7f2] hover:bg-[#f7e7dc] text-[#6F4E47] font-medium px-5 py-3 rounded-full transition-colors"
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
                                                        className="w-9 h-9 rounded-full border border-[#e5cfc1] flex items-center justify-center text-[#6F4E47] hover:bg-white transition-colors"
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
                                                        className="w-9 h-9 rounded-full border border-[#e5cfc1] flex items-center justify-center text-[#6F4E47] hover:bg-white transition-colors"
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
                            onClick={scrollRight}
                            className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-[#ead8cc] shadow-md w-12 h-12 rounded-full items-center justify-center text-[#6F4E47]"
                            type="button"
                        >
                            <ChevronRight size={22} />
                        </button>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="bg-[#fcf8f5] border border-[#eadfd7] rounded-[28px] p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <ShoppingCart className="text-[#6F4E47]" size={28} />
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
                                                        className="w-10 h-10 rounded-full border border-[#e5cfc1] flex items-center justify-center text-[#6F4E47] hover:bg-[#f8eee8] transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>

                                                    <span className="min-w-[28px] text-center font-bold text-[#2d1d17]">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => increaseQuantity(item.id)}
                                                        className="w-10 h-10 rounded-full border border-[#e5cfc1] flex items-center justify-center text-[#6F4E47] hover:bg-[#f8eee8] transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#f0d8cb] text-[#6F4E47] hover:bg-[#fff3ed] transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                        Quitar
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Tu nombre"
                                        value={customerName}
                                        onChange={(event) => setCustomerName(event.target.value)}
                                        readOnly={!!loggedUser}
                                        className={`w-full p-3 rounded-xl border border-[#eadfd7] outline-none focus:border-[#6F4E47] ${loggedUser ? "bg-[#f7efe9] cursor-not-allowed" : "bg-white"
                                            }`}
                                    />

                                    <input
                                        type="email"
                                        placeholder="Tu correo"
                                        value={customerEmail}
                                        onChange={(event) => setCustomerEmail(event.target.value)}
                                        readOnly={!!loggedUser}
                                        className={`w-full p-3 rounded-xl border border-[#eadfd7] outline-none focus:border-[#6F4E47] ${loggedUser ? "bg-[#f7efe9] cursor-not-allowed" : "bg-white"
                                            }`}
                                    />
                                </div>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <MapPin
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F4E47]"
                                            size={20}
                                        />

                                        <input
                                            type="text"
                                            placeholder="Dirección de entrega"
                                            value={deliveryAddress}
                                            onChange={(event) => setDeliveryAddress(event.target.value)}
                                            className="w-full p-3 pl-11 rounded-xl border border-[#eadfd7] outline-none focus:border-[#6F4E47] bg-white"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Truck
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F4E47]"
                                            size={20}
                                        />

                                        <select
                                            value={selectedSector}
                                            onChange={(event) => {
                                                const sectorName = event.target.value;
                                                const zone = deliveryZones.find((item) => item.name === sectorName);

                                                setSelectedSector(sectorName);
                                                setDeliveryFee(zone ? zone.fee : '');
                                            }}
                                            className="w-full p-3 pl-11 rounded-xl border border-[#eadfd7] outline-none focus:border-[#6F4E47] bg-white text-[#3d2a22]"
                                        >
                                            <option value="">Selecciona tu sector</option>

                                            {deliveryZones.map((zone) => (
                                                <option key={zone.name} value={zone.name}>
                                                    {zone.name} - ${formatPrice(zone.fee)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-5 overflow-hidden rounded-3xl border border-[#eadfd7]">
                                    <MapContainer
                                        center={selectedPosition}
                                        zoom={13}
                                        style={{
                                            height: "320px",
                                            width: "100%"
                                        }}
                                    >
                                        <TileLayer
                                            attribution='&copy; OpenStreetMap contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        <LocationMarker
                                            selectedPosition={selectedPosition}
                                            setSelectedPosition={setSelectedPosition}
                                            setDeliveryAddress={setDeliveryAddress}
                                        />
                                    </MapContainer>
                                </div>

                                <div className="mt-6 pt-6 border-t border-[#eadfd7] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <p className="text-lg text-[#3d2a22] font-medium">
                                            Total de productos: <span className="font-bold">{totalItems}</span>
                                        </p>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-lg text-[#6F4E47]">
                                                Subtotal productos: ${formatPrice(totalPrice)}
                                            </p>

                                            <p className="text-lg text-[#6F4E47]">
                                                Delivery: ${formatPrice(deliveryFee || 0)}
                                            </p>

                                            <p className="text-3xl font-bold text-[#2d1d17]">
                                                Total final: ${formatPrice(finalTotal)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            type="button"
                                            onClick={guardarPedido}
                                            className="inline-flex items-center justify-center gap-3 bg-[#d78963] hover:bg-[#c97752] text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            <ShoppingCart size={22} />
                                            Guardar pedido
                                        </button>

                                        <button
                                            type="button"
                                            onClick={openPaymentModal}
                                            className="inline-flex items-center justify-center gap-3 bg-[#2d1d17] hover:bg-[#4F3124] text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            <CreditCard size={22} />
                                            Pagar
                                        </button>

                                        <a
                                            href={generateWhatsAppLink(whatsappCartMessage)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-3 bg-[#6F4E47] hover:bg-[#4F3124] text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            <MessageCircle size={22} />
                                            Enviar por WhatsApp
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
                            <CakeSlice className="text-[#6F4E47]" size={34} />
                            <p className="text-[#4a352d] leading-7">
                                Hechos al momento <br /> con ingredientes frescos
                            </p>
                        </div>

                        <div className="flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-[#e1cfc3] pb-4 lg:pb-0">
                            <Pencil className="text-[#6F4E47]" size={34} />
                            <p className="text-[#4a352d] leading-7">
                                Personaliza tu postre <br /> como más te guste
                            </p>
                        </div>

                        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-[#e1cfc3] pb-4 md:pb-0">
                            <Gift className="text-[#6F4E47]" size={34} />
                            <p className="text-[#4a352d] leading-7">
                                Ideal para regalos <br /> y ocasiones especiales
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Heart className="text-[#6F4E47]" size={34} />
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
                            href={generateWhatsAppLink('Hola, quiero pedir ahora por WhatsApp 💕')}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-[#6F4E47] hover:bg-[#4F3124] text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300"
                        >
                            <MessageCircle size={22} />
                            Pide ahora por WhatsApp
                        </a>

                        <p
                            className="text-[#6F4E47] text-xl text-center"
                            style={{ fontFamily: 'Great Vibes, cursive' }}
                        >
                            Te respondemos al instante
                        </p>
                    </div>
                </section>
            </main>
            {showPaymentModal && (
                <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4">
                    <div className="relative bg-[#fffaf7] w-full max-w-3xl rounded-[28px] shadow-2xl border border-[#eadfd7] p-6 md:p-8">
                        <button
                            type="button"
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-5 right-5 text-[#6F4E47] hover:text-[#2d1d17]"
                        >
                            <X size={26} />
                        </button>

                        <h2
                            className="text-3xl md:text-4xl font-bold text-[#2d1d17] mb-2"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            Elige tu método de pago
                        </h2>

                        <p className="text-[#6F4E47] mb-6">
                            Total final a pagar: <span className="font-bold">${formatPrice(finalTotal)}</span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-white rounded-3xl border border-[#eadfd7] p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <Building2 className="text-[#6F4E47]" size={28} />
                                    <h3 className="text-xl font-bold text-[#2d1d17]">
                                        Transferencia bancaria
                                    </h3>
                                </div>

                                <div className="space-y-5 text-[#4a352d]">

                                    <div className="bg-[#fcf7f3] border border-[#eadfd7] rounded-2xl p-4">
                                        <p className="text-lg font-bold text-[#2d1d17] mb-3">
                                            Banco Pichincha
                                        </p>

                                        <div className="space-y-2">
                                            <p><strong>Tipo:</strong> Cuenta ahorros</p>
                                            <p><strong>Número:</strong> 2207165064</p>
                                            <p><strong>Titular:</strong> Michelle Campos</p>
                                            <p><strong>CI:</strong> 0925309775</p>
                                            <p><strong>Correo:</strong> michellecamposs@gmail.com</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#fcf7f3] border border-[#eadfd7] rounded-2xl p-4">
                                        <p className="text-lg font-bold text-[#2d1d17] mb-3">
                                            Banco Guayaquil
                                        </p>

                                        <div className="space-y-2">
                                            <p><strong>Tipo:</strong> Cuenta ahorros</p>
                                            <p><strong>Número:</strong> 0030732370</p>
                                            <p><strong>Titular:</strong> Michelle Campos</p>
                                            <p><strong>CI:</strong> 0925309775</p>
                                            <p><strong>Correo:</strong> michellecamposs@gmail.com</p>
                                        </div>
                                    </div>

                                </div>

                                <a
                                    href={generateWhatsAppLink(`${whatsappCartMessage}\n\nYa realicé la transferencia. Adjunto mi comprobante.`)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-5 inline-flex w-full items-center justify-center gap-3 bg-[#6F4E47] hover:bg-[#4F3124] text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300"
                                >
                                    <MessageCircle size={20} />
                                    Enviar comprobante
                                </a>
                            </div>

                            <div className="bg-white rounded-3xl border border-[#eadfd7] p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <CreditCard className="text-[#6F4E47]" size={28} />
                                    <h3 className="text-xl font-bold text-[#2d1d17]">
                                        Tarjeta / PayPhone
                                    </h3>
                                </div>

                                <p className="text-[#4a352d] leading-7 mb-5">
                                    Paga con tarjeta mediante PayPhone. Al abrirse el enlace, ingresa el monto exacto:
                                    <strong> ${formatPrice(finalTotal)}</strong>.
                                </p>

                                <a
                                    href={payphonePaymentLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex w-full items-center justify-center gap-3 bg-[#d78963] hover:bg-[#c97752] text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300"
                                >
                                    <ExternalLink size={20} />
                                    Pagar con PayPhone
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default OrderPage;