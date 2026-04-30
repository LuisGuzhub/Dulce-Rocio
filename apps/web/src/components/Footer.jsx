
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone } from 'lucide-react';
import logo from '@/assets/icono/logo.jpg';

function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="Dulce Rocío"
                className="w-10 h-10 object-contain rounded-full bg-white p-1 shadow-sm"
              />
              <span className="heading-serif text-2xl font-bold" style={{ letterSpacing: '-0.02em' }}>
                Dulce Rocío
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              Postres personalizados hechos con amor para tus momentos especiales
            </p>
          </div>

          <div>
            <span className="text-sm font-semibold tracking-wide uppercase block mb-4">
              Enlaces rápidos
            </span>
            <nav className="space-y-2">
              <Link to="/" className="block text-sm opacity-90 hover:opacity-100 transition-opacity duration-200">
                Inicio
              </Link>
              <Link to="/order" className="block text-sm opacity-90 hover:opacity-100 transition-opacity duration-200">
                Pide tu postre
              </Link>
              <Link to="/about" className="block text-sm opacity-90 hover:opacity-100 transition-opacity duration-200">
                Nosotros
              </Link>
              <Link to="/gallery" className="block text-sm opacity-90 hover:opacity-100 transition-opacity duration-200">
                Galería
              </Link>
              <Link to="/contact" className="block text-sm opacity-90 hover:opacity-100 transition-opacity duration-200">
                Contacto
              </Link>
            </nav>
          </div>

          <div>
            <span className="text-sm font-semibold tracking-wide uppercase block mb-4">
              Contacto
            </span>
            <div className="space-y-3">
              <a href="mailto:michellercampos@gmail.com" className="flex items-center gap-2 text-sm opacity-90 hover:opacity-100 transition-opacity duration-200">
                <Mail className="h-4 w-4" />
                <span>michellercampos@gmail.com</span>
              </a>
              <a href="tel:+593986887205" className="flex items-center gap-2 text-sm opacity-90 hover:opacity-100 transition-opacity duration-200">
                <Phone className="h-4 w-4" />
                <span>+593 98 688 7205</span>
              </a>
              <a
                href="https://www.instagram.com/dulcerocioec_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm opacity-90 hover:opacity-100 transition-opacity duration-200"
              >
                <Instagram className="h-4 w-4" />
                <span>@dulcerocioec</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-80">
              © 2026 Dulce Rocío. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-200">
                Política de Privacidad
              </Link>
              <Link to="/terms" className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-200">
                Términos de Servicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
