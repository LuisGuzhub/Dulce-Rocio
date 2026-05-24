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
function MapUpdater({ selectedPosition }) {
    const map = useMapEvents({});

    useEffect(() => {
        if (selectedPosition) {
            map.setView(selectedPosition, 17);
        }
    }, [selectedPosition, map]);

    return null;
}

function OrderPage() {
    const scrollRef = useRef(null);

    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [loggedUser, setLoggedUser] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryFee, setDeliveryFee] = useState('');
    const [deliveryType, setDeliveryType] = useState('delivery');
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedBranch, setSelectedBranch] = useState("Sur");
    const [selectedPickupBranch, setSelectedPickupBranch] = useState('');
    const [stock, setStock] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isCreatingPayphoneLink, setIsCreatingPayphoneLink] = useState(false);
    const [manualPaymentFallback, setManualPaymentFallback] = useState(null);
    const [savedCarts, setSavedCarts] = useState([]);
    const [showSavedCartPanel, setShowSavedCartPanel] = useState(false);
    const autoRestoredCart = useRef(false);
    const [selectedPosition, setSelectedPosition] = useState([
        -2.170998,
        -79.922359
    ]);

    const apiBaseUrl = "https://dulce-rocio.onrender.com";
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const userData = JSON.parse(storedUser);

            setLoggedUser(userData);
            setCustomerName(userData.name || "");
            setCustomerEmail(userData.email || "");
        }
    }, []);

    useEffect(() => {
        const loadStock = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/api/products-stock`);

                if (response.ok) {
                    const data = await response.json();
                    setStock(data.stock || []);
                }
            } catch (error) {
                console.error("Error cargando stock:", error);
            }
        };

        loadStock();
    }, []);

    useEffect(() => {
        if (loggedUser?.email) {
            loadSavedCarts(loggedUser.email);
        }
    }, [loggedUser]);
    const deliveryZonesByBranch = {
        "Urb Plaza Madeira": [
            { name: "Plaza Madeira", fee: 2.00 },
            { name: "La Joya", fee: 2.50 },
            { name: "Villa Club", fee: 2.75 },
            { name: "Villa del Rey", fee: 3.00 },
            { name: "La Aurora", fee: 3.00 },
            { name: "Samborondón", fee: 4.00 },
            { name: "Ciudad Celeste", fee: 4.50 },
            { name: "Entre Ríos", fee: 5.00 },
            { name: "Daule", fee: 5.50 }
        ],

        "Alborada CC Plaza Mayor I": [
            { name: "Alborada", fee: 2.00 },
            { name: "Garzota", fee: 2.25 },
            { name: "Sauces", fee: 2.50 },
            { name: "Samanes", fee: 2.75 },
            { name: "Guayacanes", fee: 2.75 },
            { name: "Mucho Lote", fee: 3.00 },
            { name: "Orquídeas", fee: 3.00 },
            { name: "Vergeles", fee: 3.25 },
            { name: "Bastión Popular", fee: 3.50 },
            { name: "Pascuales", fee: 4.00 },
            { name: "Kennedy", fee: 3.00 },
            { name: "Urdesa", fee: 3.25 },
            { name: "Mapasingue", fee: 3.50 },
            { name: "Prosperina", fee: 3.75 }
        ],

        "Sur": [
            { name: "Centro", fee: 2.00 },
            { name: "Bahía", fee: 2.00 },
            { name: "9 de Octubre", fee: 2.25 },
            { name: "Garay", fee: 2.25 },
            { name: "Suburbio", fee: 2.50 },
            { name: "Febres Cordero", fee: 2.50 },
            { name: "Letamendi", fee: 2.50 },
            { name: "García Moreno", fee: 2.50 },
            { name: "Puerto Lisa", fee: 2.75 },
            { name: "Batallón del Suburbio", fee: 2.75 },
            { name: "Sur", fee: 2.50 },
            { name: "Guasmo", fee: 3.00 },
            { name: "Floresta", fee: 3.00 },
            { name: "Pradera", fee: 3.00 },
            { name: "Los Esteros", fee: 3.25 },
            { name: "Trinitaria", fee: 3.50 },
            { name: "Fertisa", fee: 3.50 },
            { name: "Isla Trinitaria", fee: 3.75 }
        ]
    };
    const deliveryZones = deliveryZonesByBranch[selectedBranch] || [];

    const branches = [
        {
            name: "Urb Plaza Madeira",
            description: "Sucursal norte / vía a Samborondón",
            availableProducts: [1, 2, 5]
        },
        {
            name: "Alborada CC Plaza Mayor I",
            description: "Sucursal norte de Guayaquil",
            availableProducts: [1, 2, 3, 4]
        },
        {
            name: "Sur",
            description: "17 & Francisco de Marcos",
            availableProducts: [1, 3, 5, 6]
        }
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

    const selectedBranchData = branches.find((branch) => branch.name === selectedBranch);

    const availableProducts = products.filter((product) => {
        return selectedBranchData?.availableProducts.includes(product.id);
    });

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

    function getSavedCartStorageKey(email) {
        return `dulce-rocio:saved-carts:${String(email || 'guest').toLowerCase()}`;
    }

    function readLocalSavedCarts(email) {
        try {
            const storedCarts = localStorage.getItem(getSavedCartStorageKey(email));
            return storedCarts ? JSON.parse(storedCarts) : [];
        } catch (error) {
            console.error("Error leyendo pedidos guardados:", error);
            return [];
        }
    }

    function writeLocalSavedCarts(email, carts) {
        localStorage.setItem(getSavedCartStorageKey(email), JSON.stringify(carts));
    }

    function normalizeCartItems(items = []) {
        return items.map((item) => {
            const product = products.find((productItem) => productItem.id === Number(item.id));

            return {
                ...(product || {}),
                ...item,
                id: Number(item.id),
                price: Number(item.price || product?.price || 0),
                quantity: Math.max(1, Number(item.quantity || 1))
            };
        });
    }

    function normalizeSavedCart(rawCart, source = "api") {
        const cartData = rawCart.cart_data || rawCart.cart || [];
        let parsedCart = [];

        try {
            parsedCart = typeof cartData === "string" ? JSON.parse(cartData) : cartData;
        } catch (error) {
            console.error("Error leyendo carrito guardado:", error);
        }

        const deliveryMode = rawCart.delivery_type || rawCart.deliveryType || "delivery";

        return {
            id: rawCart.id || rawCart.cartId || `local-${Date.now()}`,
            source,
            cart: normalizeCartItems(parsedCart),
            subtotal: Number(rawCart.subtotal || 0),
            deliveryFee: Number(rawCart.delivery_fee ?? rawCart.deliveryFee ?? 0),
            total: Number(rawCart.total || 0),
            deliveryType: deliveryMode,
            deliveryAddress: rawCart.delivery_address || rawCart.deliveryAddress || "",
            sector: rawCart.sector || "",
            pickupBranch: rawCart.pickup_branch || rawCart.pickupBranch || "",
            branch: rawCart.branch || rawCart.pickup_branch || selectedBranch,
            latitude: rawCart.latitude || null,
            longitude: rawCart.longitude || null,
            savedAt: rawCart.updated_at || rawCart.created_at || rawCart.savedAt || new Date().toISOString()
        };
    }

    function createDraftCart() {
        const effectiveDeliveryFee = deliveryType === "delivery" ? Number(deliveryFee) || 0 : 0;

        return {
            id: `local-${Date.now()}`,
            source: "local",
            cart: normalizeCartItems(cart),
            subtotal: totalPrice,
            deliveryFee: effectiveDeliveryFee,
            total: totalPrice + effectiveDeliveryFee,
            deliveryType,
            deliveryAddress: deliveryType === "delivery" ? deliveryAddress : "",
            sector: deliveryType === "delivery" ? selectedSector : "",
            pickupBranch: deliveryType === "pickup" ? selectedPickupBranch : "",
            branch: selectedBranch,
            latitude: selectedPosition?.[0] || null,
            longitude: selectedPosition?.[1] || null,
            savedAt: new Date().toISOString()
        };
    }

    async function loadSavedCarts(email) {
        const token = localStorage.getItem("token");
        const localCarts = readLocalSavedCarts(email);
        let apiCarts = [];

        if (token) {
            try {
                const response = await fetch(`${apiBaseUrl}/api/cart/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    apiCarts = (data.carts || []).map((savedCart) => normalizeSavedCart(savedCart, "api"));
                }
            } catch (error) {
                console.error("Error cargando pedidos guardados:", error);
            }
        }

        const mergedCarts = [...apiCarts, ...localCarts.map((savedCart) => normalizeSavedCart(savedCart, "local"))]
            .sort((firstCart, secondCart) => new Date(secondCart.savedAt) - new Date(firstCart.savedAt));

        setSavedCarts(mergedCarts);

        if (!autoRestoredCart.current && cart.length === 0 && mergedCarts.length > 0) {
            restoreSavedCart(mergedCarts[0], true);
            autoRestoredCart.current = true;
        }
    }

    function restoreSavedCart(savedCart, silent = false) {
        const restoredCart = normalizeSavedCart(savedCart, savedCart.source || "local");

        setCart(restoredCart.cart);
        setDeliveryType(restoredCart.deliveryType);
        setSelectedBranch(restoredCart.branch || restoredCart.pickupBranch || selectedBranch);
        setSelectedSector(restoredCart.deliveryType === "delivery" ? restoredCart.sector : "");
        setDeliveryFee(restoredCart.deliveryType === "delivery" ? restoredCart.deliveryFee : 0);
        setDeliveryAddress(restoredCart.deliveryType === "delivery" ? restoredCart.deliveryAddress : "");
        setSelectedPickupBranch(restoredCart.deliveryType === "pickup" ? restoredCart.pickupBranch : "");

        if (restoredCart.latitude && restoredCart.longitude) {
            setSelectedPosition([Number(restoredCart.latitude), Number(restoredCart.longitude)]);
        }

        setShowSavedCartPanel(false);

        if (!silent) {
            alert("Pedido guardado recuperado.");
        }
    }

    function validateOrderReadyForPayment() {
        if (cart.length === 0) {
            alert('Agrega al menos un postre al carrito.');
            return false;
        }

        if (!customerName || !customerEmail) {
            alert('Tu nombre y correo son necesarios para continuar con el pago.');
            return false;
        }

        if (deliveryType === "delivery" && !selectedSector) {
            alert("Selecciona tu sector antes de continuar con el pago.");
            return false;
        }

        if (deliveryType === "pickup" && !selectedPickupBranch) {
            alert("Selecciona un punto de recogida antes de continuar con el pago.");
            return false;
        }

        return true;
    }

    const searchAddress = async () => {
        if (!deliveryAddress.trim()) {
            alert("Escribe una dirección para buscarla en el mapa.");
            return;
        }

        const cleanAddress = deliveryAddress.trim();

        const searchOptions = [
            `${cleanAddress}, Guayaquil, Ecuador`,
            `${cleanAddress.replace(" y ", " & ")}, Guayaquil, Ecuador`,
            `${cleanAddress.replace(" y ", " esquina ")}, Guayaquil, Ecuador`,
            `Avenida ${cleanAddress}, Guayaquil, Ecuador`,
            `${cleanAddress}, 090306, Guayaquil, Ecuador`
        ];

        try {
            for (const query of searchOptions) {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ec&limit=1`
                );

                const data = await response.json();

                if (data.length > 0) {
                    const lat = Number(data[0].lat);
                    const lng = Number(data[0].lon);

                    setSelectedPosition([lat, lng]);

                    if (data[0].display_name) {
                        setDeliveryAddress(data[0].display_name);
                    }

                    return;
                }
            }

            alert("No se encontró la dirección exacta. Marca el punto manualmente en el mapa.");
        } catch (error) {
            console.error("Error buscando dirección:", error);
            alert("No se pudo buscar la dirección.");
        }
    };
    const openPaymentModal = () => {
        if (!validateOrderReadyForPayment()) {
            return;
        }

        setManualPaymentFallback(null);
        setShowPaymentModal(true);
    };

    const openPayphonePayment = async () => {
        if (!validateOrderReadyForPayment()) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Inicia sesion para generar el link de pago seguro.");
            return;
        }

        setIsCreatingPayphoneLink(true);

        try {
            const response = await fetch(`${apiBaseUrl}/api/payphone/link`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    cart: cart.map((item) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    })),
                    subtotal: totalPrice,
                    delivery_fee: deliveryType === "pickup" ? 0 : Number(deliveryFee || 0),
                    total: finalTotal,
                    delivery_type: deliveryType,
                    sector: selectedSector,
                    pickup_branch: selectedPickupBranch
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "No se pudo generar el link de PayPhone.");
            }

            if (data.mode === "manual") {
                setManualPaymentFallback(data);
                return;
            }

            window.open(data.paymentUrl, "_blank", "noopener,noreferrer");
        } catch (error) {
            console.error("Error generando pago PayPhone:", error);
            alert(error.message || "No se pudo generar el link de PayPhone.");
        } finally {
            setIsCreatingPayphoneLink(false);
        }
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
        const deliveryValue = deliveryType === "delivery" ? Number(deliveryFee) || 0 : 0;
        return totalPrice + deliveryValue;
    }, [totalPrice, deliveryFee, deliveryType]);

    const whatsappCartMessage = useMemo(() => {
        if (cart.length === 0) {
            return 'Hola, quiero informacion sobre sus postres';
        }

        let message = 'Hola, quiero hacer este pedido en Dulce Rocio:\n\n';

        cart.forEach((item) => {
            const subtotal = item.price * item.quantity;
            message += `- ${item.name} x${item.quantity} - $${formatPrice(subtotal)}\n`;
        });

        message += `\nNombre: ${customerName || 'No especificado'}`;
        message += `\nCorreo: ${customerEmail || 'No especificado'}`;
        message += `\nSucursal elegida: ${selectedBranch}`;
        message += `\nTotal de productos: ${totalItems}`;
        message += `\nSubtotal: $${formatPrice(totalPrice)}`;
        message += `\nTipo de entrega: ${deliveryType === "pickup" ? "Recoger en establecimiento" : "Delivery"}`;

        if (deliveryType === "pickup") {
            message += `\nPunto de recogida: ${selectedPickupBranch || 'No especificado'}`;
            message += `\nCosto de delivery: $0.00`;
        } else {
            message += `\nDireccion de entrega: ${deliveryAddress || 'No especificada'}`;
            message += `\nSector: ${selectedSector || 'No especificado'}`;
            message += `\nCosto de delivery: $${formatPrice(deliveryFee || 0)}`;
        }

        message += `\nTotal final a pagar: $${formatPrice(finalTotal)}`;
        message += `\n\nMetodos de pago disponibles: transferencia bancaria y confirmacion por WhatsApp.`;

        return message;
    }, [cart, totalItems, totalPrice, finalTotal, customerName, customerEmail, selectedBranch, deliveryType, selectedPickupBranch, deliveryAddress, selectedSector, deliveryFee]);

    const guardarPedido = async () => {
        if (cart.length === 0) {
            alert('Agrega al menos un postre al carrito.');
            return;
        }

        if (!customerName || !customerEmail) {
            alert('Escribe tu nombre y correo para guardar el pedido.');
            return;
        }

        const draftCart = createDraftCart();
        const token = localStorage.getItem("token");

        try {
            if (token) {
                const response = await fetch(`${apiBaseUrl}/api/cart/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        cart: draftCart.cart,
                        subtotal: totalPrice,
                        delivery_fee: draftCart.deliveryFee,
                        total: finalTotal,
                        delivery_type: deliveryType,
                        delivery_address: draftCart.deliveryAddress,
                        sector: draftCart.sector,
                        pickup_branch: draftCart.pickupBranch,
                        latitude: draftCart.latitude,
                        longitude: draftCart.longitude,
                    })
                });

                if (!response.ok) {
                    throw new Error('No se pudo guardar en el servidor.');
                }

                await loadSavedCarts(customerEmail);
                alert('Pedido guardado correctamente. Puedes retomarlo desde el carrito.');
                return;
            }
        } catch (error) {
            console.error(error);
        }

        const localCarts = readLocalSavedCarts(customerEmail);
        const updatedCarts = [draftCart, ...localCarts].slice(0, 5);

        writeLocalSavedCarts(customerEmail, updatedCarts);
        setSavedCarts(updatedCarts.map((savedCart) => normalizeSavedCart(savedCart, "local")));
        alert('Pedido guardado localmente. Puedes retomarlo desde este navegador.');
    };

    return (
        <>
            <Header />
            <button
                type="button"
                onClick={() => setShowSavedCartPanel(true)}
                className="fixed bottom-6 right-6 z-[9998] bg-[#3b241b] text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center"
            >
                <ShoppingCart size={28} />

                {(totalItems > 0 || savedCarts.length > 0) && (
                    <span className="absolute -top-2 -right-2 bg-[#d78963] text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                        {totalItems || savedCarts.length}
                    </span>
                )}
            </button>

            {showSavedCartPanel && (
                <div className="fixed inset-0 z-[9999] bg-black/50 flex justify-end">
                    <div className="h-full w-full max-w-xl bg-[#fffaf7] shadow-2xl overflow-y-auto p-6 border-l border-[#eadfd7]">
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                                <p className="text-sm uppercase tracking-[0.2em] text-[#d78963] font-semibold">
                                    Carrito
                                </p>
                                <h2 className="text-3xl font-bold text-[#2d1d17]" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    Pedido actual
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowSavedCartPanel(false)}
                                className="text-[#6F4E47] hover:text-[#2d1d17]"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <p className="text-[#6b5147] bg-white border border-[#eadfd7] rounded-2xl p-4">
                                Tu carrito actual esta vacio. Puedes recuperar un pedido guardado abajo.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="bg-white border border-[#eadfd7] rounded-2xl p-4">
                                        <div className="flex justify-between gap-4">
                                            <div>
                                                <h3 className="font-bold text-[#2d1d17]">{item.name}</h3>
                                                <p className="text-sm text-[#6b5147]">
                                                    {item.quantity} x ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    className="w-8 h-8 rounded-full border border-[#eadfd7] flex items-center justify-center text-[#6F4E47]"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-bold min-w-[24px] text-center">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => increaseQuantity(item.id)}
                                                    className="w-8 h-8 rounded-full border border-[#eadfd7] flex items-center justify-center text-[#6F4E47]"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="bg-[#f7efe9] border border-[#eadfd7] rounded-2xl p-4 space-y-2">
                                    <p>Subtotal: <strong>${formatPrice(totalPrice)}</strong></p>
                                    {deliveryType === "delivery" ? (
                                        <>
                                            <p>Sector: <strong>{selectedSector || "No seleccionado"}</strong></p>
                                            <p>Delivery: <strong>${formatPrice(deliveryFee || 0)}</strong></p>
                                        </>
                                    ) : (
                                        <p>Punto de recogida: <strong>{selectedPickupBranch || "No seleccionado"}</strong></p>
                                    )}
                                    <p className="text-xl text-[#2d1d17]">Total: <strong>${formatPrice(finalTotal)}</strong></p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowSavedCartPanel(false)}
                                        className="bg-white border border-[#eadfd7] text-[#6F4E47] font-semibold px-5 py-3 rounded-2xl"
                                    >
                                        Seguir editando
                                    </button>

                                    <button
                                        type="button"
                                        onClick={openPaymentModal}
                                        className="bg-[#2d1d17] text-white font-semibold px-5 py-3 rounded-2xl"
                                    >
                                        Pagar
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-[#2d1d17] mb-4">
                                Pedidos guardados
                            </h3>

                            {savedCarts.length === 0 ? (
                                <p className="text-[#6b5147] bg-white border border-[#eadfd7] rounded-2xl p-4">
                                    Aun no tienes pedidos guardados.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {savedCarts.map((savedCart) => (
                                        <button
                                            key={`${savedCart.source}-${savedCart.id}`}
                                            type="button"
                                            onClick={() => restoreSavedCart(savedCart)}
                                            className="w-full text-left bg-white border border-[#eadfd7] hover:bg-[#fff3ed] rounded-2xl p-4 transition"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-bold text-[#2d1d17]">
                                                        {savedCart.cart.length} producto(s)
                                                    </p>
                                                    <p className="text-sm text-[#6b5147]">
                                                        {savedCart.deliveryType === "pickup"
                                                            ? `Recoger en ${savedCart.pickupBranch || "punto pendiente"}`
                                                            : `Delivery - ${savedCart.sector || "sector pendiente"}`}
                                                    </p>
                                                </div>
                                                <p className="font-bold text-[#d78963]">
                                                    ${formatPrice(savedCart.total || savedCart.subtotal || 0)}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                    <div className="mb-10 text-center">
                        <p className="text-[#d78963] font-semibold mb-3">
                            Elige la sucursal más cercana
                        </p>

                        <div className="flex flex-wrap justify-center gap-3">
                            {branches.map((branch) => (
                                <button
                                    key={branch.name}
                                    type="button"
                                    onClick={() => {
                                        setSelectedBranch(branch.name);
                                        setSelectedSector("");
                                        setDeliveryFee("");
                                        setSelectedPickupBranch("");
                                        setCart([]);
                                    }}
                                    className={`px-5 py-3 rounded-2xl border font-semibold transition-all ${selectedBranch === branch.name
                                        ? "bg-[#6F4E47] text-white border-[#6F4E47] shadow-md"
                                        : "bg-white text-[#6F4E47] border-[#eadfd7] hover:bg-[#f7e7dc]"
                                        }`}
                                >
                                    <span className="block">{branch.name}</span>
                                    <span className="block text-xs font-normal opacity-80">
                                        {branch.description}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
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
                                const subtotal = cartItem ? cartItem.quantity * product.price : 0;

                                const stockItem = stock.find((item) => {
                                    return item.branch_name === selectedBranch && item.product_id === product.id;
                                });

                                const availableQuantity = Number(stockItem?.stock_quantity || 0);
                                const isOutOfStock = availableQuantity <= 0;

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
                                            <p className={`text-sm font-bold mb-3 ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
                                                {isOutOfStock ? "Agotado" : `En stock: ${availableQuantity}`}
                                            </p>

                                            <p className="text-sm leading-7 text-[#5d473f] min-h-[96px]">
                                                {product.description}
                                            </p>

                                            <button
                                                type="button"
                                                disabled={isOutOfStock}
                                                onClick={() => {
                                                    if (quantityInCart >= availableQuantity) {
                                                        alert(`Solo hay ${availableQuantity} disponibles en ${selectedBranch}.`);
                                                        return;
                                                    }

                                                    addToCart(product);
                                                }}
                                                className={`inline-flex items-center justify-center gap-2 mt-4 font-medium px-5 py-3 rounded-full transition-colors ${isOutOfStock
                                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                    : "bg-[#fff7f2] hover:bg-[#f7e7dc] text-[#6F4E47]"
                                                    }`}
                                            >
                                                <ShoppingCart size={18} />
                                                {isOutOfStock ? "Agotado" : "Agregar al carrito"}
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
                                                            if (quantityInCart >= availableQuantity) {
                                                                alert(`Solo hay ${availableQuantity} disponibles en ${selectedBranch}.`);
                                                                return;
                                                            }

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

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDeliveryType("delivery");
                                            setSelectedPickupBranch("");
                                        }}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-2xl border font-semibold transition ${deliveryType === "delivery"
                                            ? "bg-[#6F4E47] text-white border-[#6F4E47]"
                                            : "bg-white text-[#6F4E47] border-[#eadfd7]"
                                            }`}
                                    >
                                        <Truck size={20} />
                                        Delivery
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDeliveryType("pickup");
                                            setSelectedSector("");
                                            setDeliveryFee(0);
                                            setDeliveryAddress("");
                                        }}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-2xl border font-semibold transition ${deliveryType === "pickup"
                                            ? "bg-[#6F4E47] text-white border-[#6F4E47]"
                                            : "bg-white text-[#6F4E47] border-[#eadfd7]"
                                            }`}
                                    >
                                        <Building2 size={20} />
                                        Recoger en establecimiento
                                    </button>
                                </div>

                                {deliveryType === "delivery" ? (
                                    <>
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <MapPin
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F4E47]"
                                                    size={20}
                                                />

                                                <input
                                                    type="text"
                                                    placeholder="Marca tu ubicacion en el mapa"
                                                    value={deliveryAddress}
                                                    readOnly
                                                    className="w-full p-3 pl-11 rounded-xl border border-[#eadfd7] outline-none bg-[#f7efe9] cursor-not-allowed text-[#4a352d]"
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
                                                            {zone.name}
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
                                                <MapUpdater selectedPosition={selectedPosition} />

                                                <LocationMarker
                                                    selectedPosition={selectedPosition}
                                                    setSelectedPosition={setSelectedPosition}
                                                    setDeliveryAddress={setDeliveryAddress}
                                                />
                                            </MapContainer>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mt-4 relative">
                                        <Building2
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F4E47]"
                                            size={20}
                                        />

                                        <select
                                            value={selectedPickupBranch}
                                            onChange={(event) => setSelectedPickupBranch(event.target.value)}
                                            className="w-full p-3 pl-11 rounded-xl border border-[#eadfd7] outline-none focus:border-[#6F4E47] bg-white text-[#3d2a22]"
                                        >
                                            <option value="">Selecciona punto de recogida</option>

                                            {branches.map((branch) => (
                                                <option key={branch.name} value={branch.name}>
                                                    {branch.name} - {branch.description}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="mt-6 pt-6 border-t border-[#eadfd7] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <p className="text-lg text-[#3d2a22] font-medium">
                                            Total de productos: <span className="font-bold">{totalItems}</span>
                                        </p>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-lg text-[#6F4E47]">
                                                Subtotal productos: ${formatPrice(totalPrice)}
                                            </p>

                                            {deliveryType === "delivery" ? (
                                                <p className="text-lg text-[#6F4E47]">
                                                    Delivery: ${formatPrice(deliveryFee || 0)}
                                                </p>
                                            ) : (
                                                <p className="text-lg text-[#6F4E47]">
                                                    Recogida: {selectedPickupBranch || "Sin punto seleccionado"}
                                                </p>
                                            )}

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
                    <div className="relative bg-[#fffaf7] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[28px] shadow-2xl border border-[#eadfd7] p-6 md:p-8">
                        <button
                            type="button"
                            onClick={() => {
                                setShowPaymentModal(false);
                                setManualPaymentFallback(null);
                            }}
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                                    Paga con tarjeta mediante PayPhone. Generaremos un link seguro por
                                    <strong> ${formatPrice(finalTotal)}</strong> y el monto no podra editarse.
                                </p>

                                <button
                                    type="button"
                                    onClick={openPayphonePayment}
                                    disabled={isCreatingPayphoneLink}
                                    className="inline-flex w-full items-center justify-center gap-3 bg-[#d78963] hover:bg-[#c97752] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300"
                                >
                                    <ExternalLink size={20} />
                                    {isCreatingPayphoneLink ? "Generando link..." : "Pagar monto exacto"}
                                </button>

                                {manualPaymentFallback && (
                                    <div className="mt-5 rounded-2xl border border-[#eadfd7] bg-[#fcf7f3] p-4 text-[#4a352d]">
                                        <p className="font-bold text-[#2d1d17] mb-2">
                                            Pago automático próximamente disponible.
                                        </p>
                                        <p className="text-sm leading-6 mb-4">
                                            Mientras habilitamos PayPhone, puedes confirmar tu pedido por WhatsApp con el total exacto calculado desde el carrito.
                                        </p>

                                        <div className="space-y-2 text-sm">
                                            <p>Subtotal: <strong>${formatPrice(totalPrice)}</strong></p>
                                            {deliveryType === "pickup" ? (
                                                <p>Recogida: <strong>{selectedPickupBranch}</strong></p>
                                            ) : (
                                                <p>Delivery: <strong>${formatPrice(deliveryFee || 0)} - {selectedSector}</strong></p>
                                            )}
                                            <p>Total exacto: <strong>${formatPrice(finalTotal)}</strong></p>
                                            <p>Métodos disponibles: <strong>transferencia bancaria y confirmación por WhatsApp.</strong></p>
                                        </div>

                                        <a
                                            href={generateWhatsAppLink(`${whatsappCartMessage}\n\nPago automático próximamente disponible. Quiero confirmar este pedido con el total exacto indicado.`)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-4 inline-flex w-full items-center justify-center gap-3 bg-[#6F4E47] hover:bg-[#4F3124] text-white font-semibold px-5 py-3 rounded-2xl transition-all duration-300"
                                        >
                                            <MessageCircle size={20} />
                                            Enviar pedido por WhatsApp
                                        </a>
                                    </div>
                                )}
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
