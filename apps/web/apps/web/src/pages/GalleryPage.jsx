
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import GalleryCard from '@/components/GalleryCard.jsx';

function GalleryPage() {
  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1506815181983-292770fc39f2',
      title: 'Pastel de celebración elegante',
      description: 'Diseño sofisticado con flores comestibles y acabados en oro'
    },
    {
      url: 'https://images.unsplash.com/photo-1695904255931-78b11e1cb049',
      title: 'Pastel temático personalizado',
      description: 'Creación única inspirada en los gustos del cliente'
    },
    {
      url: 'https://images.unsplash.com/photo-1696608330343-15343fd8fd64',
      title: 'Bocaditos gourmet',
      description: 'Selección de aperitivos dulces y salados para eventos'
    },
    {
      url: 'https://images.unsplash.com/photo-1613067532415-90df85362423',
      title: 'Mesa dulce completa',
      description: 'Montaje temático con variedad de postres coordinados'
    },
    {
      url: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f',
      title: 'Celebración especial',
      description: 'Momento capturado de una celebración memorable'
    },
    {
      url: 'https://images.unsplash.com/photo-1608306510002-6e5d56692f70',
      title: 'Detalles artesanales',
      description: 'Decoraciones hechas a mano con técnicas tradicionales'
    },
    {
      url: 'https://images.unsplash.com/photo-1703320050747-6b4ea29b8448',
      title: 'Pastel de boda elegante',
      description: 'Diseño clásico con toques modernos y flores frescas'
    },
    {
      url: 'https://images.unsplash.com/photo-1661560277080-558425cea910',
      title: 'Mesa dulce temática',
      description: 'Presentación coordinada para baby shower'
    },
    {
      url: 'https://images.unsplash.com/photo-1564402145996-7d5ea93e68e5',
      title: 'Cupcakes personalizados',
      description: 'Variedad de sabores con decoraciones únicas'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Galería - Dulce Rocío</title>
        <meta name="description" content="Explora nuestra galería de pasteles temáticos, mesas dulces, bocaditos y postres personalizados. Inspiración para tu próxima celebración." />
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
                <h1 className="heading-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance leading-tight" style={{letterSpacing: '-0.02em'}}>
                  Nuestra galería
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Descubre algunas de nuestras creaciones más especiales. Cada postre cuenta una historia única y celebra un momento inolvidable
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image, index) => (
                  <GalleryCard key={index} image={image} index={index} />
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
                <h2 className="heading-serif text-3xl md:text-4xl font-bold mb-6 text-balance" style={{letterSpacing: '-0.02em'}}>
                  ¿Te inspiraste?
                </h2>
                <p className="text-lg opacity-90 mb-8 leading-relaxed">
                  Estas son solo algunas muestras de lo que podemos crear. Cada proyecto es único y diseñado específicamente para ti
                </p>
                <p className="text-base opacity-80 leading-relaxed">
                  Síguenos en Instagram <a href="https://instagram.com/dulcerocioec" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100 transition-opacity duration-200">@dulcerocioec</a> para ver más de nuestras creaciones diarias
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

export default GalleryPage;
