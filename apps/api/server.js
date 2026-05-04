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
                total NUMERIC DEFAULT 0,
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

// =========================
// PEDIDOS
// =========================

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
            total
        } = req.body;

        if (!customer_name || !customer_email || !product_name || !quantity || !total) {
            return res.status(400).json({ message: "Faltan datos del pedido" });
        }

        const result = await pool.query(
            `
            INSERT INTO orders 
            (customer_name, customer_email, product_name, quantity, total)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            `,
            [customer_name, customer_email, product_name, quantity, total]
        );

        res.json({
            message: "Pedido guardado correctamente",
            orderId: result.rows[0].id,
        });
    } catch (error) {
        console.error("Error guardando pedido:", error.message);
        res.status(500).json({ message: "Error al guardar pedido" });
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