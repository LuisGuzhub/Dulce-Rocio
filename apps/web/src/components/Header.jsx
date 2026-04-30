import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/icono/logo.jpg';
import LoginModal from "@/components/LoginModal";
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logueado, setLogueado] = useState(false);
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    const token = localStorage.getItem('token');
    setLogueado(!!token);
  }, [location.pathname]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLogueado(false);
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/order', label: 'Pide tu postre' },
    { path: '/about', label: 'Nosotros' },
    { path: '/gallery', label: 'Galería' },
    { path: '/contact', label: 'Contacto' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo Dulce Rocío"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <span
              className="heading-serif text-2xl md:text-3xl font-bold text-primary"
              style={{ letterSpacing: '-0.02em' }}
            >
              Dulce Rocío
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition-all duration-200 relative ${isActive(link.path)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-[1.35rem] left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {!logueado ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all"
              >
                Iniciar sesión
              </button>
            ) : (
              <>
                {user?.role === "admin" && (
                  <button
                    onClick={() => {
                      window.location.href = "/admin/dashboard";
                    }}
                    className="rounded-full bg-[#3b241b] text-white px-5 py-2 font-semibold hover:bg-[#5a3628] transition"
                  >
                    Panel administrador
                  </button>
                )}

                {user?.role !== "admin" && (
                  <Link
                    to="/cuenta"
                    className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <User className="h-4 w-4" />
                    Mi cuenta
                  </Link>
                )}

                <button
                  onClick={cerrarSesion}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-medium transition-all duration-200 ${isActive(link.path)
                  ? 'text-primary'
                  : 'text-muted-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-border space-y-3">
              {!logueado ? (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-primary font-semibold"
                >
                  <User className="h-4 w-4" />
                  Iniciar sesión
                </Link>
              ) : (
                <>
                  <Link
                    to="/cuenta"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-primary font-semibold"
                  >
                    <User className="h-4 w-4" />
                    Mi cuenta
                  </Link>

                  <button
                    onClick={cerrarSesion}
                    className="flex items-center gap-2 text-red-500 font-semibold"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  );
}

export default Header;