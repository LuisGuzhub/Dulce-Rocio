
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import imagenFondo from '../assets/imagen_inicial.jpg';
import tiramisuInicio from '@/assets/inicio/tiramisu_inicio.png';
import paveInicio from '@/assets/inicio/paves_inicio.png';
import brownieInicio from '@/assets/brownies/brownie_pedido.png';


function HomePage() {

  const featuredProducts = [
    {
      name: 'Tiramisús',
      description: 'Capas suaves, cremosas y con ese sabor clásico que enamora.',
      price: 'Desde $2.50',
      image: tiramisuInicio
    },
    {
      name: 'Pavés',
      description: 'Texturas delicadas y sabores irresistibles en cada cucharada.',
      price: 'Desde $2.50',
      image: paveInicio
    },
    {
      name: 'Brownies',
      description: 'Intensos, húmedos y perfectos para compartir o regalar.',
      price: 'Desde $1.80',
      image: brownieInicio
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dulce Rocío - Postres personalizados hechos con amor</title>
        <meta name="description" content="Creamos postres artesanales personalizados para tus momentos especiales. Pasteles temáticos, mesas dulces y bocaditos para eventos en Ecuador." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={imagenFondo}
                alt="Hermosos postres artesanales de Dulce Rocío"
                className="w-full h-full object-cover object-center lg:rounded-xl"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `
          radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.35) 0%,
            rgba(255, 200, 180, 0.25) 40%,
            rgba(255, 200, 180, 0.0) 80%
          )
        `
                }}
              />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1
                  className="heading-chunky 
  text-[2.6rem] 
  sm:text-5xl 
  md:text-6xl 
  lg:text-8xl 
  text-white 
  leading-[0.95] 
  sm:leading-[1.05] 
  mb-5"
                  style={{
                    textShadow: `
      1.5px 1.5px 0px rgba(79,49,36,0.35),
      3px 3px 0px rgba(79,49,36,0.18)
    `
                  }}
                >
                  Postres personalizados
                  <br />
                  hechos con amor
                </h1>

                <p
                  className="heading-serif text-xl sm:text-2xl lg:text-3xl font-normal text-white mb-8 max-w-2xl mx-auto leading-[1.35] text-balance drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  Transformamos tus momentos especiales en experiencias dulces inolvidables con diseños únicos y sabores excepcionales
                </p>
                <Link to="/contact">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-[#6F4E47] hover:bg-[#4F3124] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-[0.98]">
                    Solicitar pedido personalizado
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>

          <section className="py-24 bg-gradient-to-b from-[#fff8f3] via-[#fffdfb] to-[#fff6f1] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl mx-auto mb-10"
              >
                <span className="heading-brush inline-block text-2xl md:text-3xl text-[#cb7f5d] mb-4">
                  Dulce Rocío
                </span>

                <h2
                  className="heading-serif text-4xl md:text-5xl xl:text-6xl font-bold text-[#341f17] leading-[0.95] mb-6"
                  style={{ letterSpacing: '-0.04em' }}
                >
                  Postres que entran por los ojos y conquistan al primer bocado
                </h2>

                <p className="text-lg md:text-xl text-[#755d53] leading-relaxed max-w-3xl mx-auto mb-8">
                  Descubre creaciones pensadas para provocar antojo desde el primer vistazo.
                  Diseños delicados, sabores memorables y una presentación que convierte cada celebración
                  en algo mucho más especial.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                  <Link to="/Order">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto rounded-full bg-[#3a241b] hover:bg-[#533126] text-white px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Ver catálogo
                    </Button>
                  </Link>

                  <Link to="/Order">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto rounded-full border-[#d4a18c] text-[#bf7756] hover:bg-[#fff0e8] px-8 py-6 text-base transition-all duration-300"
                    >
                      Pide con Nosotros
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="rounded-3xl bg-white border border-[#f1ddd2] p-4 text-center shadow-sm">
                    <p className="text-2xl md:text-3xl font-bold text-[#341f17]">100%</p>
                    <p className="text-sm text-[#7b675f] mt-1">Personalizados</p>
                  </div>

                  <div className="rounded-3xl bg-white border border-[#f1ddd2] p-4 text-center shadow-sm">
                    <p className="text-2xl md:text-3xl font-bold text-[#341f17]">Premium</p>
                    <p className="text-sm text-[#7b675f] mt-1">Ingredientes</p>
                  </div>

                  <div className="rounded-3xl bg-white border border-[#f1ddd2] p-4 text-center shadow-sm">
                    <p className="text-2xl md:text-3xl font-bold text-[#341f17]">Top</p>
                    <p className="text-sm text-[#7b675f] mt-1">Presentación</p>
                  </div>
                </div>
              </motion.div>

              <div className="mt-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12"
                >
                  <h2
                    className="heading-serif text-4xl md:text-5xl font-bold text-[#341f17] mb-4"
                    style={{ letterSpacing: '-0.03em' }}
                  >
                    Nuestros postres favoritos
                  </h2>

                  <p className="text-lg md:text-xl text-[#755d53] max-w-3xl mx-auto leading-relaxed">
                    Tiramisús, pavés y brownies hechos para antojar, compartir y repetir.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {featuredProducts.map((product, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.12 }}
                      className="group overflow-hidden rounded-[2rem] bg-white border border-[#f1e1d8] shadow-[0_12px_35px_rgba(160,110,80,0.10)] hover:shadow-[0_20px_45px_rgba(160,110,80,0.16)] transition-all duration-300"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-[250px] md:h-[270px] object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center rounded-full bg-[#f6dfd1] px-5 py-2 text-sm font-semibold text-[#9f6447] shadow-sm">
                            {product.price}
                          </span>
                        </div>
                      </div>

                      <div className="p-7">
                        <h3 className="heading-serif text-3xl font-semibold text-[#341f17] mb-4">
                          {product.name}
                        </h3>

                        <p className="text-[#755d53] leading-relaxed text-base md:text-lg mb-6">
                          {product.description}
                        </p>

                        <Link to="/contact">
                          <Button
                            className="rounded-full bg-[#6F4E47] hover:bg-[#4F3124] text-white px-6 py-6 text-base shadow-md hover:shadow-lg transition-all duration-300">
                            Quiero este
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                  <div className="rounded-[1.8rem] bg-white/90 border border-[#f1e1d8] px-7 py-8 shadow-[0_10px_30px_rgba(160,110,80,0.08)]">
                    <h3 className="heading-serif text-2xl font-semibold text-[#341f17] mb-3">
                      Ingredientes premium
                    </h3>
                    <p className="text-[#755d53] leading-relaxed text-base">
                      Sabores y texturas que sí se sienten especiales.
                    </p>
                  </div>

                  <div className="rounded-[1.8rem] bg-white/90 border border-[#f1e1d8] px-7 py-8 shadow-[0_10px_30px_rgba(160,110,80,0.08)]">
                    <h3 className="heading-serif text-2xl font-semibold text-[#341f17] mb-3">
                      Presentación cuidada
                    </h3>
                    <p className="text-[#755d53] leading-relaxed text-base">
                      Cada postre está pensado para ser un deleite visual.
                    </p>
                  </div>

                  <div className="rounded-[1.8rem] bg-white/90 border border-[#f1e1d8] px-7 py-8 shadow-[0_10px_30px_rgba(160,110,80,0.08)]">
                    <h3 className="heading-serif text-2xl font-semibold text-[#341f17] mb-3">
                      Pedidos personalizados
                    </h3>
                    <p className="text-[#755d53] leading-relaxed text-base">
                      Adaptamos tu pedido según lo que necesites.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>




          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className="heading-serif text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  ¿Ya sabes cuál vas a pedir?
                </h2>

                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Escríbenos y prepara tu pedido de tiramisús, pavés o brownies con el estilo dulce de Dulce Rocío.
                </p>

                <Link to="/contact">
                  <Button
                    size="lg"
                    className="rounded-full bg-[#6F4E47] hover:bg-[#4F3124] text-white px-6 py-6 text-base shadow-md hover:shadow-lg transition-all duration-300">
                    Hacer mi pedido
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div >
    </>
  );
}

export default HomePage;
