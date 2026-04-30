
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ServiceCard from '@/components/ServiceCard.jsx';

function ServicesPage() {
  const services = [
    {
      title: 'Pasteles temáticos',
      description: 'Diseños personalizados que dan vida a tus ideas más creativas. Desde personajes favoritos hasta conceptos elegantes y sofisticados.',
      image: 'https://images.unsplash.com/photo-1703320050747-6b4ea29b8448',
      benefits: [
        'Diseño 100% personalizado según tu visión',
        'Variedad de sabores y rellenos premium',
        'Decoraciones comestibles de alta calidad',
        'Tamaños desde 12 hasta 100+ porciones'
      ]
    },
    {
      title: 'Postres personalizados',
      description: 'Cupcakes, macarons, cake pops y más, diseñados para complementar perfectamente tu evento y deleitar a tus invitados.',
      image: 'https://images.unsplash.com/photo-1564402145996-7d5ea93e68e5',
      benefits: [
        'Amplia variedad de opciones dulces',
        'Presentación elegante y coordinada',
        'Sabores únicos y combinaciones creativas',
        'Perfectos para obsequios y recuerdos'
      ]
    },
    {
      title: 'Bocaditos para eventos',
      description: 'Selección gourmet de bocaditos dulces y salados que elevan cualquier celebración con sabor y presentación impecable.',
      image: 'https://images.unsplash.com/photo-1592989243296-bee228daf5db',
      benefits: [
        'Menús personalizados según preferencias',
        'Opciones vegetarianas y especiales disponibles',
        'Presentación profesional y atractiva',
        'Servicio de montaje incluido'
      ]
    },
    {
      title: 'Mesas dulces',
      description: 'Montajes completos que combinan postres, decoración y diseño para crear un punto focal espectacular en tu evento.',
      image: 'https://images.unsplash.com/photo-1661560277080-558425cea910',
      benefits: [
        'Diseño temático coordinado',
        'Variedad de postres y dulces',
        'Decoración y ambientación incluida',
        'Montaje y desmontaje profesional'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Servicios - Dulce Rocío</title>
        <meta name="description" content="Descubre nuestros servicios de repostería personalizada: pasteles temáticos, postres personalizados, bocaditos para eventos y mesas dulces completas." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="py-20 bg-gradient-to-b from-muted to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <h1 className="heading-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  Nuestros servicios
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Cada servicio está diseñado para hacer de tu celebración un momento inolvidable, combinando creatividad artesanal con sabores excepcionales
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-primary text-primary-foreground">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="heading-serif text-3xl md:text-4xl font-bold mb-6 text-balance" style={{ letterSpacing: '-0.02em' }}>
                  El antojo empieza aquí
                </h2>

                <p className="text-lg opacity-90 mb-8 leading-relaxed">
                  Pide tu tiramisú, pavé o brownies y disfruta un postre hecho para enamorar desde el primer bocado.
                </p>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default ServicesPage;
