const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./database");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// =========================
// CREAR TABLAS POSTGRESQL
// =========================

async function crearTablas() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT,
                provider TEXT DEFAULT 'local',
                provider_id TEXT,
                role TEXT DEFAULT 'cliente',
                photo_url TEXT,
                reset_token TEXT,
                reset_token_expires TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                customer_name TEXT NOT NULL,
                customer_email TEXT NOT NULL,
                product_name TEXT NOT NULL,
                quantity INTEGER DEFAULT 1,

                subtotal NUMERIC DEFAULT 0,
                delivery_fee NUMERIC DEFAULT 0,
                total NUMERIC DEFAULT 0,

                delivery_address TEXT,
                sector TEXT,

                latitude TEXT,
                longitude TEXT,

                payment_method TEXT DEFAULT 'pendiente',
                payment_url TEXT,

                status TEXT DEFAULT 'pendiente',

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                customer_name TEXT,
                customer_email TEXT,
                rating INTEGER NOT NULL,
                comment TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_requests (
                id SERIAL PRIMARY KEY,
                customer_name TEXT NOT NULL,
                customer_email TEXT NOT NULL,
                phone TEXT NOT NULL,
                product_type TEXT,
                requested_date DATE,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'pendiente',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
    CREATE TABLE IF NOT EXISTS loyalty_points (
        id SERIAL PRIMARY KEY,
        user_email TEXT UNIQUE NOT NULL,
        purchased_items INTEGER DEFAULT 0,
        free_items_available INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);

        await pool.query(`
    CREATE TABLE IF NOT EXISTS saved_carts (
        id SERIAL PRIMARY KEY,
        user_email TEXT NOT NULL,
        cart_data JSONB NOT NULL,
        subtotal NUMERIC DEFAULT 0,
        delivery_fee NUMERIC DEFAULT 0,
        total NUMERIC DEFAULT 0,
        delivery_type TEXT DEFAULT 'delivery',
        delivery_address TEXT,
        sector TEXT,
        pickup_branch TEXT,
        latitude TEXT,
        longitude TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);

        await pool.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS delivery_type TEXT DEFAULT 'delivery',
    ADD COLUMN IF NOT EXISTS pickup_branch TEXT,
    ADD COLUMN IF NOT EXISTS payment_url TEXT;
`);


        console.log("✅ Tablas PostgreSQL listas");
    } catch (error) {
        console.error("❌ Error creando tablas:", error.message);
    }
}

crearTablas();

// =========================
// CONFIGURACIÓN GOOGLE
// =========================

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id;
                const name = profile.displayName;
                const email = profile.emails?.[0]?.value;
                const photo = profile.photos?.[0]?.value;

                if (!email) {
                    return done(null, false);
                }

                const userResult = await pool.query(
                    "SELECT * FROM users WHERE email = $1",
                    [email]
                );

                if (userResult.rows.length > 0) {
                    return done(null, userResult.rows[0]);
                }

                const insertResult = await pool.query(
                    `
                    INSERT INTO users 
                    (name, email, provider, provider_id, role, photo_url)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING *
                    `,
                    [name, email, "google", googleId, "cliente", photo]
                );

                return done(null, insertResult.rows[0]);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// =========================
// ADMIN TEMPORAL
// =========================

const adminUser = {
    email: "admin@dulcerocio.com",
    passwordHash: "",
};

async function init() {
    adminUser.passwordHash = await bcrypt.hash("Admin12345", 10);
}

init();

// =========================
// LOGIN ADMIN
// =========================

app.post("/api/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email !== adminUser.email) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const validPassword = await bcrypt.compare(password, adminUser.passwordHash);

        if (!validPassword) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            { email: adminUser.email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login correcto",
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Error del servidor" });
    }
});

// =========================
// REGISTRO CLIENTE LOCAL
// =========================

app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rows.length > 0) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const insertResult = await pool.query(
            `
            INSERT INTO users 
            (name, email, password_hash, provider, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            `,
            [name, email, passwordHash, "local", "cliente"]
        );

        res.json({
            message: "Usuario registrado correctamente",
            userId: insertResult.rows[0].id,
        });
    } catch (error) {
        console.error("Error registrando usuario:", error.message);
        res.status(500).json({ message: "Error al registrar usuario" });
    }
});

// =========================
// LOGIN CLIENTE LOCAL
// =========================

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // ADMIN TEMPORAL
        if (email === adminUser.email) {
            const validPassword = await bcrypt.compare(password, adminUser.passwordHash);

            if (!validPassword) {
                return res.status(401).json({ message: "Contraseña incorrecta" });
            }

            const adminData = {
                id: 0,
                name: "Administrador",
                email: adminUser.email,
                role: "admin",
                provider: "local",
            };

            const token = jwt.sign(
                adminData,
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            );

            return res.json({
                message: "Login admin correcto",
                token,
                user: adminData,
            });
        }

        // CLIENTE NORMAL
        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = userResult.rows[0];

        if (!user.password_hash) {
            return res.status(401).json({
                message: "Este usuario inició sesión con Google. Usa Google para entrar.",
            });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            provider: user.provider,
            photo_url: user.photo_url,
        };

        const token = jwt.sign(
            userData,
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login cliente correcto",
            token,
            user: userData,
        });
    } catch (error) {
        console.error("Error en login:", error.message);
        res.status(500).json({ message: "Error del servidor" });
    }
});

// =========================
// RECUPERAR CONTRASEÑA
// =========================

app.post("/api/auth/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "El correo es obligatorio" });
        }

        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.json({
                message: "Si el correo existe, enviaremos un enlace de recuperación.",
            });
        }

        const user = userResult.rows[0];

        if (user.provider === "google") {
            return res.status(400).json({
                message: "Esta cuenta usa Google. Inicia sesión con Google.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        await pool.query(
            `
            UPDATE users 
            SET reset_token = $1, reset_token_expires = $2
            WHERE email = $3
            `,
            [resetToken, expires, email]
        );

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: `"Dulce Rocío" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Recupera tu contraseña - Dulce Rocío",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Recuperación de contraseña</h2>
                    <p>Hola ${user.name},</p>
                    <p>Recibimos una solicitud para cambiar tu contraseña.</p>
                    <p>Haz clic en el siguiente botón:</p>
                    <a href="${resetLink}" 
                       style="display:inline-block;background:#d78963;color:white;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:bold;">
                       Cambiar contraseña
                    </a>
                    <p>Este enlace expira en 15 minutos.</p>
                    <p>Si tú no solicitaste esto, puedes ignorar este correo.</p>
                </div>
            `,
        });

        res.json({
            message: "Si el correo existe, enviaremos un enlace de recuperación.",
        });
    } catch (error) {
        console.error("Error en recuperación:", error.message);
        res.status(500).json({ message: "No se pudo enviar el correo" });
    }
});

app.post("/api/auth/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "La contraseña debe tener al menos 6 caracteres",
            });
        }

        const userResult = await pool.query(
            "SELECT * FROM users WHERE reset_token = $1",
            [token]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "Enlace inválido" });
        }

        const user = userResult.rows[0];

        const now = new Date();
        const expires = new Date(user.reset_token_expires);

        if (now > expires) {
            return res.status(400).json({ message: "El enlace expiró" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(
            `
            UPDATE users
            SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL
            WHERE id = $2
            `,
            [passwordHash, user.id]
        );

        res.json({
            message: "Contraseña actualizada correctamente",
        });
    } catch (error) {
        console.error("Error actualizando contraseña:", error.message);
        res.status(500).json({ message: "Error actualizando contraseña" });
    }
});

// =========================
// LOGIN CON GOOGLE
// =========================

app.get(
    "/api/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
    }),
    (req, res) => {
        const token = jwt.sign(
            {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                provider: req.user.provider,
                photo_url: req.user.photo_url,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    }
);

// =========================
// MIDDLEWARE TOKEN
// =========================

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token no enviado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
}

// =========================
// PERFIL CLIENTE
// =========================

app.get("/api/auth/profile", verificarToken, (req, res) => {
    res.json({
        message: "Perfil obtenido correctamente",
        user: req.user,
    });
});

// =========================
// RUTAS PROTEGIDAS ADMIN
// =========================

app.get("/api/admin/profile", verificarToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Acceso denegado" });
    }

    res.json({
        message: "Acceso autorizado",
        user: req.user,
    });
});

app.get("/api/admin/orders", verificarToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        const result = await pool.query(
            "SELECT * FROM orders ORDER BY created_at DESC"
        );

        res.json({
            orders: result.rows,
        });
    } catch (error) {
        console.error("Error obteniendo pedidos:", error.message);
        res.status(500).json({ message: "Error obteniendo pedidos" });
    }
});

app.patch("/api/admin/orders/:id/status", verificarToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        const allowedStatuses = [
            "pendiente",
            "awaiting_payment_confirmation",
            "paid",
            "confirmed",
            "cancelled"
        ];
        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Estado inválido" });
        }

        const result = await pool.query(
            "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
            [status, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.json({
            message: "Estado actualizado",
            order: result.rows[0]
        });
    } catch (error) {
        console.error("Error actualizando estado del pedido:", error.message);
        res.status(500).json({ message: "Error actualizando pedido" });
    }
});

app.get("/api/admin/users", verificarToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        const result = await pool.query(
            "SELECT id, name, email, role, provider, created_at FROM users ORDER BY created_at DESC"
        );

        res.json({
            users: result.rows,
        });
    } catch (error) {
        console.error("Error obteniendo usuarios:", error.message);
        res.status(500).json({ message: "Error obteniendo usuarios" });
    }
});

app.get("/api/admin/contact-requests", verificarToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        const result = await pool.query(
            "SELECT * FROM contact_requests ORDER BY created_at DESC"
        );

        res.json({
            requests: result.rows,
        });
    } catch (error) {
        console.error("Error obteniendo solicitudes:", error.message);
        res.status(500).json({ message: "Error obteniendo solicitudes" });
    }
});

app.patch("/api/admin/contact-requests/:id/read", verificarToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        await pool.query(
            "UPDATE contact_requests SET status = 'leído' WHERE id = $1",
            [req.params.id]
        );

        res.json({ message: "Solicitud marcada como leída" });
    } catch (error) {
        console.error("Error actualizando solicitud:", error.message);
        res.status(500).json({ message: "Error actualizando solicitud" });
    }
});

// =========================
// PEDIDOS
// =========================

app.post("/api/contact-requests", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            productType,
            requestedDate,
            message
        } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                message: "Nombre, correo, teléfono y mensaje son obligatorios"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO contact_requests
            (customer_name, customer_email, phone, product_type, requested_date, message)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            `,
            [
                name,
                email,
                phone,
                productType || null,
                requestedDate || null,
                message
            ]
        );

        res.json({
            message: "Solicitud enviada correctamente",
            requestId: result.rows[0].id
        });
    } catch (error) {
        console.error("Error guardando solicitud:", error.message);
        res.status(500).json({ message: "Error al guardar la solicitud" });
    }
});

app.post("/api/orders/create", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            product,
            date,
            message
        } = req.body;

        if (!name || !email || !phone || !product || !date) {
            return res.status(400).json({
                message: "Faltan datos obligatorios del pedido"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO orders 
            (customer_name, customer_email, product_name, quantity, total, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            `,
            [
                name,
                email,
                `${product} | Tel: ${phone} | Fecha: ${date} | Mensaje: ${message || "Sin mensaje"}`,
                1,
                0,
                "pendiente"
            ]
        );

        res.json({
            message: "Solicitud enviada correctamente",
            orderId: result.rows[0].id
        });
    } catch (error) {
        console.error("Error guardando solicitud:", error.message);

        res.status(500).json({
            message: "Error al guardar la solicitud"
        });
    }
});

app.post("/api/orders", async (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            product_name,
            quantity,

            subtotal,
            delivery_fee,
            total,

            delivery_address,
            sector,

            latitude,
            longitude,

            payment_method,
            delivery_type,
            pickup_branch
        } = req.body;

        if (!customer_name || !customer_email || !product_name || !quantity || !total) {
            return res.status(400).json({ message: "Faltan datos del pedido" });
        }

        const result = await pool.query(
            `
    INSERT INTO orders (
        customer_name,
        customer_email,
        product_name,
        quantity,

        subtotal,
        delivery_fee,
        total,

        delivery_address,
        sector,

        latitude,
        longitude,

        payment_method,
        delivery_type,
        pickup_branch
    )
    VALUES (
        $1, $2, $3, $4,
        $5, $6, $7,
        $8, $9,
        $10, $11,
        $12, $13, $14
    )
    RETURNING id
    `,
            [
                customer_name,
                customer_email,
                product_name,
                quantity,

                subtotal,
                delivery_fee,
                total,

                delivery_address,
                sector,

                latitude,
                longitude,

                payment_method,
                delivery_type || "delivery",
                pickup_branch || null
            ]
        );

        // =========================
        // SISTEMA DE FIDELIDAD
        // =========================

        const totalPurchased = 1;

        // buscar si ya existe registro
        const loyaltyResult = await pool.query(
            `
    SELECT * FROM loyalty_points
    WHERE user_email = $1
    `,
            [customer_email]
        );

        if (loyaltyResult.rows.length === 0) {

            let freeItems = 0;
            let purchasedItems = totalPurchased;

            if (purchasedItems >= 8) {
                freeItems = Math.floor(purchasedItems / 8);
                purchasedItems = purchasedItems % 8;
            }

            await pool.query(
                `
        INSERT INTO loyalty_points
        (
            user_email,
            purchased_items,
            free_items_available
        )
        VALUES ($1, $2, $3)
        `,
                [
                    customer_email,
                    purchasedItems,
                    freeItems
                ]
            );

        } else {

            const loyalty = loyaltyResult.rows[0];

            let purchasedItems =
                Number(loyalty.purchased_items) + totalPurchased;

            let freeItems =
                Number(loyalty.free_items_available);

            if (purchasedItems >= 8) {

                const rewards = Math.floor(purchasedItems / 8);

                freeItems += rewards;

                purchasedItems = purchasedItems % 8;
            }

            await pool.query(
                `
        UPDATE loyalty_points
        SET
            purchased_items = $1,
            free_items_available = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_email = $3
        `,
                [
                    purchasedItems,
                    freeItems,
                    customer_email
                ]
            );
        }

        res.json({
            message: "Pedido guardado correctamente",
            orderId: result.rows[0].id
        });
    } catch (error) {
        console.error("Error guardando pedido:", error.message);
        res.status(500).json({ message: "Error al guardar pedido" });
    }
});

function validateManualPayphoneOrder({
    cart,
    subtotal,
    delivery_fee,
    total,
    delivery_type,
    sector,
    pickup_branch
}) {
    if (!cart || cart.length === 0) {
        return "El carrito está vacío";
    }

    if (!["delivery", "pickup"].includes(delivery_type)) {
        return "Tipo de entrega inválido";
    }

    const subtotalValue = Number(subtotal);
    const cartSubtotal = Number(cart.reduce((sum, item) => {
        const quantity = Number(item.quantity);
        const price = Number(item.price);

        if (!Number.isFinite(quantity) || !Number.isFinite(price) || quantity <= 0 || price < 0) {
            return Number.NaN;
        }

        return sum + (price * quantity);
    }, 0).toFixed(2));
    const deliveryFeeValue = delivery_type === "pickup" ? 0 : Number(delivery_fee || 0);
    const totalValue = Number(total);
    const expectedTotal = Number((subtotalValue + deliveryFeeValue).toFixed(2));

    if (!Number.isFinite(subtotalValue) || !Number.isFinite(totalValue) || !Number.isFinite(cartSubtotal) || totalValue <= 0) {
        return "Total inválido";
    }

    if (Number(subtotalValue.toFixed(2)) !== cartSubtotal) {
        return "El subtotal no coincide con los productos del carrito";
    }

    if (Number(totalValue.toFixed(2)) !== expectedTotal) {
        return "El total no coincide con el subtotal y delivery";
    }

    if (delivery_type === "delivery" && !sector) {
        return "Debes seleccionar un sector";
    }

    if (delivery_type === "pickup" && !pickup_branch) {
        return "Debes seleccionar un punto de recogida";
    }

    return null;
}

function getValidHttpUrl(value) {
    const candidate = String(value || "").trim();

    if (!candidate || candidate.toLowerCase() === "value") {
        return null;
    }

    try {
        const url = new URL(candidate);
        return ["http:", "https:"].includes(url.protocol) ? candidate : null;
    } catch (error) {
        return null;
    }
}

app.post("/api/payphone/manual-payment", verificarToken, async (req, res) => {
    try {
        const {
            cart,
            subtotal,
            delivery_fee,
            total,
            delivery_type,
            delivery_address,
            sector,
            pickup_branch,
            latitude,
            longitude,
            customer_name,
            customer_email
        } = req.body;

        if (!customer_name || !customer_email) {
            return res.status(400).json({
                message: "Faltan datos del cliente"
            });
        }

        const validationError = validateManualPayphoneOrder({
            cart,
            subtotal,
            delivery_fee,
            total,
            delivery_type,
            sector,
            pickup_branch
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const productSummary = cart
            .map((item) => `${item.name} x${item.quantity}`)
            .join(", ");
        const totalQuantity = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
        const deliveryFeeValue = delivery_type === "pickup" ? 0 : Number(delivery_fee || 0);

        const result = await pool.query(
            `
            INSERT INTO orders (
                customer_name,
                customer_email,
                product_name,
                quantity,
                subtotal,
                delivery_fee,
                total,
                delivery_address,
                sector,
                latitude,
                longitude,
                payment_method,
                payment_url,
                delivery_type,
                pickup_branch,
                status
            )
            VALUES (
                $1, $2, $3, $4,
                $5, $6, $7,
                $8, $9,
                $10, $11,
                $12, $13, $14, $15, $16
            )
            RETURNING id
            `,
            [
                customer_name,
                customer_email,
                productSummary,
                totalQuantity,
                Number(subtotal),
                deliveryFeeValue,
                Number(total),
                delivery_type === "delivery" ? delivery_address : "",
                delivery_type === "delivery" ? sector : "",
                latitude || null,
                longitude || null,
                "payphone_manual",
                null,
                delivery_type,
                delivery_type === "pickup" ? pickup_branch : null,
                "awaiting_payment_confirmation"
            ]
        );

        res.json({
            message: "Pedido registrado. Pago pendiente de confirmación manual.",
            orderId: result.rows[0].id,
            status: "awaiting_payment_confirmation",
            paymentMethod: "payphone_manual",
            expectedTotal: Number(total)
        });
    } catch (error) {
        console.error("Error registrando pago manual PayPhone:", error.message);
        res.status(500).json({ message: "Error registrando pedido PayPhone" });
    }
});

app.post("/api/payphone/link", verificarToken, async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ message: "orderId requerido" });
    }

    try {
        const orderResult = await pool.query(
            `
            SELECT *
            FROM orders
            WHERE id = $1
              AND (customer_email = $2 OR $3 = 'admin')
            `,
            [orderId, req.user.email, req.user.role]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        const order = orderResult.rows[0];
        const manualPaymentUrl = getValidHttpUrl(process.env.PAYPHONE_PAYMENT_URL);
        const totalInCents = Math.round(Number(order.total) * 100);

        if (!Number.isFinite(totalInCents) || totalInCents <= 0) {
            return res.status(400).json({ message: "Total del pedido inválido" });
        }

        const payload = {
            amount: totalInCents,
            amountWithoutTax: totalInCents,
            currency: "USD",
            reference: `Dulce Rocio ${order.id}`,
            clientTransactionId: String(order.id),
            isAmountEditable: true
        };

        const payphoneOmitStoreIdValue = process.env.PAYPHONE_OMIT_STORE_ID || "";
        const shouldOmitStoreId = payphoneOmitStoreIdValue === "true";
        const sentStoreId = Boolean(process.env.PAYPHONE_STORE_ID && !shouldOmitStoreId);

        if (sentStoreId) {
            payload.storeId = process.env.PAYPHONE_STORE_ID;
        }

        console.info("PayPhone manual link request:", {
            endpoint: "https://pay.payphonetodoesposible.com/api/Links",
            hasToken: Boolean(process.env.PAYPHONE_TOKEN),
            hasStoreId: Boolean(process.env.PAYPHONE_STORE_ID),
            sentStoreId,
            payphoneOmitStoreIdValue,
            interpretedOmitStoreId: shouldOmitStoreId,
            payload
        });

        let paymentUrl = null;
        let mode = "manual";

        if (process.env.PAYPHONE_TOKEN) {
            try {
                const response = await fetch("https://pay.payphonetodoesposible.com/api/Links", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.PAYPHONE_TOKEN}`,
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const contentType = response.headers.get("content-type") || "";
                const data = contentType.includes("application/json")
                    ? await response.json()
                    : await response.text();

                console.info("PayPhone manual link response:", {
                    status: response.status,
                    contentType,
                    responseKind: contentType.includes("application/json") ? "json" : "text"
                });

                if (response.ok) {
                    const candidateUrl = typeof data === "string" ? data : data.url || data.link || data.paymentUrl;
                    paymentUrl = getValidHttpUrl(candidateUrl);
                    mode = "api_editable";

                    if (!paymentUrl) {
                        console.error("PayPhone no devolvió un link HTTP válido:", {
                            status: response.status,
                            contentType,
                            sentStoreId,
                            payphoneOmitStoreIdValue,
                            interpretedOmitStoreId: shouldOmitStoreId,
                            payload,
                            responsePreview: typeof data === "string"
                                ? data.slice(0, 300)
                                : JSON.stringify(data).slice(0, 300)
                        });
                    }
                } else {
                    console.error("PayPhone manual link fallback:", {
                        status: response.status,
                        contentType,
                        sentStoreId,
                        payphoneOmitStoreIdValue,
                        interpretedOmitStoreId: shouldOmitStoreId,
                        payload,
                        responsePreview: typeof data === "string"
                            ? data.slice(0, 300)
                            : JSON.stringify(data).slice(0, 300)
                    });
                }
            } catch (error) {
                console.error("PayPhone manual link request failed:", {
                    message: error.message
                });
            }
        }

        if (!paymentUrl) {
            paymentUrl = manualPaymentUrl;
            mode = "manual";
        }

        if (!paymentUrl) {
            return res.status(500).json({
                message: "No pudimos generar el link de PayPhone. Intenta nuevamente o comunícate con nosotros."
            });
        }

        await pool.query(
            "UPDATE orders SET payment_url = $1 WHERE id = $2",
            [paymentUrl, order.id]
        );

        res.json({
            mode,
            orderId: order.id,
            expectedTotal: Number(order.total),
            paymentUrl
        });
    } catch (error) {
        console.error("Error preparando link PayPhone manual:", error.message);
        res.status(500).json({ message: "Error preparando link PayPhone" });
    }
});

// =========================
// STOCK DE PRODUCTOS
// =========================
// =========================
// CARRITO GUARDADO
// =========================

app.post("/api/cart/save", verificarToken, async (req, res) => {
    try {
        const {
            cart,
            subtotal,
            delivery_fee,
            total,
            delivery_type,
            delivery_address,
            sector,
            pickup_branch,
            latitude,
            longitude
        } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({
                message: "El carrito está vacío"
            });
        }

        if (delivery_type === "delivery" && !sector) {
            return res.status(400).json({
                message: "Debes seleccionar un sector"
            });
        }

        if (delivery_type === "pickup" && !pickup_branch) {
            return res.status(400).json({
                message: "Debes seleccionar un punto de recogida"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO saved_carts (
                user_email,
                cart_data,
                subtotal,
                delivery_fee,
                total,
                delivery_type,
                delivery_address,
                sector,
                pickup_branch,
                latitude,
                longitude
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING id
            `,
            [
                req.user.email,
                JSON.stringify(cart),
                subtotal,
                delivery_fee,
                total,
                delivery_type,
                delivery_address || null,
                sector || null,
                pickup_branch || null,
                latitude || null,
                longitude || null
            ]
        );

        res.json({
            message: "Carrito guardado correctamente",
            cartId: result.rows[0].id
        });
    } catch (error) {
        console.error("Error guardando carrito:", error.message);
        res.status(500).json({
            message: "Error guardando carrito"
        });
    }
});

app.get("/api/cart/me", verificarToken, async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT *
            FROM saved_carts
            WHERE user_email = $1
            ORDER BY created_at DESC
            `,
            [req.user.email]
        );

        res.json({
            carts: result.rows
        });
    } catch (error) {
        console.error("Error obteniendo carritos:", error.message);
        res.status(500).json({
            message: "Error obteniendo carritos"
        });
    }
});

app.delete("/api/cart/:id", verificarToken, async (req, res) => {
    try {
        await pool.query(
            `
            DELETE FROM saved_carts
            WHERE id = $1 AND user_email = $2
            `,
            [req.params.id, req.user.email]
        );

        res.json({
            message: "Carrito eliminado correctamente"
        });
    } catch (error) {
        console.error("Error eliminando carrito:", error.message);
        res.status(500).json({
            message: "Error eliminando carrito"
        });
    }
});
// OBTENER STOCK
app.get("/api/products-stock", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM product_stock
            ORDER BY branch_name ASC, product_id ASC
        `);

        res.json({
            stock: result.rows
        });

    } catch (error) {
        console.error("Error obteniendo stock:", error.message);

        res.status(500).json({
            message: "Error obteniendo stock"
        });
    }
});

// ACTUALIZAR STOCK ADMIN
app.post("/api/admin/update-stock", verificarToken, async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Acceso denegado"
            });
        }

        const {
            branch_name,
            product_id,
            stock_quantity
        } = req.body;

        const quantity = Number(stock_quantity);

        const in_stock = quantity > 0;

        await pool.query(
            `
            UPDATE product_stock
SET in_stock = $1,
    stock_quantity = $2
WHERE branch_name = $3
AND product_id = $4
            `,
            [
                in_stock,
                quantity,
                branch_name,
                product_id
            ]
        );

        res.json({
            message: "Stock actualizado correctamente"
        });

    } catch (error) {

        console.error("Error actualizando stock:", error.message);

        res.status(500).json({
            message: "Error actualizando stock"
        });
    }
});
// =========================
// FIDELIDAD
// =========================

app.get("/api/loyalty/me", verificarToken, async (req, res) => {
    try {
        const email = req.user.email;

        let result = await pool.query(
            `
            SELECT *
            FROM loyalty_points
            WHERE user_email = $1
            `,
            [email]
        );

        if (result.rows.length === 0) {
            await pool.query(
                `
                INSERT INTO loyalty_points
                (user_email, purchased_items, free_items_available)
                VALUES ($1, $2, $3)
                `,
                [email, 0, 0]
            );

            result = await pool.query(
                `
                SELECT *
                FROM loyalty_points
                WHERE user_email = $1
                `,
                [email]
            );
        }

        res.json({
            loyalty: result.rows[0]
        });
    } catch (error) {
        console.error("Error obteniendo fidelidad:", error.message);
        res.status(500).json({ message: "Error obteniendo fidelidad" });
    }
});

app.get("/api/admin/loyalty", verificarToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        const result = await pool.query(
            `
            SELECT 
                users.name,
                users.email,
                users.role,
                COALESCE(loyalty_points.purchased_items, 0) AS purchased_items,
                COALESCE(loyalty_points.free_items_available, 0) AS free_items_available,
                loyalty_points.updated_at
            FROM users
            LEFT JOIN loyalty_points
            ON users.email = loyalty_points.user_email
            WHERE users.role = 'cliente'
            ORDER BY users.created_at DESC
            `
        );

        res.json({
            loyalty: result.rows
        });
    } catch (error) {
        console.error("Error obteniendo fidelidad admin:", error.message);
        res.status(500).json({ message: "Error obteniendo fidelidad admin" });
    }
});
// =========================
// RESEÑAS
// =========================

app.post("/api/reviews", verificarToken, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({
                message: "La calificación y el comentario son obligatorios",
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "La calificación debe estar entre 1 y 5",
            });
        }

        const result = await pool.query(
            `
            INSERT INTO reviews 
            (user_id, customer_name, customer_email, rating, comment)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            `,
            [
                req.user.id,
                req.user.name,
                req.user.email,
                rating,
                comment,
            ]
        );

        res.json({
            message: "Reseña enviada correctamente",
            reviewId: result.rows[0].id,
        });
    } catch (error) {
        console.error("Error guardando reseña:", error.message);

        res.status(500).json({
            message: "Error al guardar la reseña",
        });
    }
});

app.get("/api/admin/reviews", verificarToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        const result = await pool.query(
            "SELECT * FROM reviews ORDER BY created_at DESC"
        );

        res.json({
            reviews: result.rows,
        });
    } catch (error) {
        console.error("Error obteniendo reseñas:", error.message);

        res.status(500).json({
            message: "Error obteniendo reseñas",
        });
    }
});

// =========================
// SERVIDOR
// =========================

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Servidor Dulce Rocío funcionando 🍰");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
