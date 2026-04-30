import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Gift, CakeSlice } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import videoPostres from '@/assets/videos/postres.mp4';
import imagenRocio from '@/assets/imagen_inicial_pidePedido.png';
import hechoAmor from '@/assets/hecho_amor.jpeg';
import ingredientesPremium from '@/assets/ingredientes_premiun.mp4';
import momentosUnicos from '@/assets/momentos_unicos.jpeg';
import disenosPersonalizados from '@/assets/Diseño_personalizados.mp4';

function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Hecho con amor',
      description: 'Cada receta lleva dedicación, paciencia y mucho amor.',
      type: 'image',
      media: hechoAmor,
      position: 'object-[50%_35%]'
    },
    {
      icon: Sparkles,
      title: 'Ingredientes premium',
      description: 'Seleccionamos ingredientes de la más alta calidad.',
      type: 'video',
      media: ingredientesPremium,
      position: 'object-contain'
    },
    {
      icon: CakeSlice,
      title: 'Momentos únicos',
      description: 'Convertimos tus celebraciones en recuerdos inolvidables.',
      type: 'image',
      media: momentosUnicos,
      position: 'object-[50%_45%]'
    },
    {
      icon: Gift,
      title: 'Diseños personalizados',
      description: 'Creamos postres únicos, como tú y tu ocasión.',
      type: 'video',
      media: disenosPersonalizados,
      position: 'object-[50%_45%]'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Nosotros - Dulce Rocío</title>
        <meta
          name="description"
          content="Conoce la historia de Dulce Rocío, nuestra esencia, nuestros valores y la dedicación detrás de cada postre."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-[#f8f3ef]">
        <Header />

        <main className="flex-1">
          <section className="py-20 md:py-24 bg-[#f8f3ef]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-[1.1fr_0.8fr_0.9fr] gap-8 lg:gap-10 items-center"
              >
                <div className="lg:pr-4">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#cb7f5d] mb-4">
                    Nuestra historia
                  </p>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-[2px] bg-[#dba78f]" />
                    <Heart className="h-4 w-4 text-[#d28b6b]" />
                  </div>

                  <h1
                    className="heading-serif text-4xl md:text-5xl xl:text-6xl font-bold text-[#341f17] leading-[0.95] mb-6"
                    style={{ letterSpacing: '-0.04em' }}
                  >
                    De un sueño
                    <br />
                    a momentos dulces
                    <br />
                    que se recuerdan.
                  </h1>

                  <p className="text-lg md:text-xl text-[#755d53] leading-relaxed max-w-xl mb-8">
                    Dulce Rocío nació del amor por los detalles y del deseo de
                    hacer feliz a las personas con postres que enamoran.
                  </p>

                  <button
                    onClick={() => {
                      const section = document.getElementById('nuestros-valores');
                      section?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-3 rounded-full bg-[#d78963] hover:bg-[#c97752] text-white px-7 py-4 text-base shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Conoce más de nosotros
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex justify-center">
                  <div className="w-full max-w-[330px] rounded-[2rem] overflow-hidden bg-white shadow-[0_20px_40px_rgba(160,110,80,0.16)] border border-[#f1e1d8]">
                    <video
                      className="w-full aspect-[9/16] object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={videoPostres} type="video/mp4" />
                    </video>
                  </div>
                </div>

                <div className="space-y-0 rounded-[2rem] bg-transparent">
                  {[
                    {
                      icon: Heart,
                      title: 'Hecho con amor',
                      text: 'Cada receta lleva dedicación, paciencia y mucho amor.'
                    },
                    {
                      icon: Sparkles,
                      title: 'Ingredientes premium',
                      text: 'Seleccionamos ingredientes de la más alta calidad.'
                    },
                    {
                      icon: CakeSlice,
                      title: 'Momentos únicos',
                      text: 'Convertimos tus celebraciones en recuerdos inolvidables.'
                    },
                    {
                      icon: Gift,
                      title: 'Diseños personalizados',
                      text: 'Creamos postres únicos, como tú y tu ocasión.'
                    }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-5 py-6 border-b border-[#ead8cf] last:border-b-0"
                      >
                        <div className="shrink-0 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f6dfd1]">
                          <Icon className="h-7 w-7 text-[#bf7756]" />
                        </div>

                        <div>
                          <h3 className="heading-serif text-2xl font-semibold text-[#341f17] mb-2">
                            {item.title}
                          </h3>
                          <p className="text-[#755d53] leading-relaxed text-base">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </section>

          <section id="nuestros-valores" className="scroll-mt-24 pb-20 md:pb-24 bg-[#f8f3ef]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2
                  className="heading-serif text-3xl md:text-4xl font-bold text-[#341f17] mb-4"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  Nuestros valores
                </h2>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-[2px] bg-[#dba78f]" />
                  <Heart className="h-4 w-4 text-[#d28b6b]" />
                  <div className="w-10 h-[2px] bg-[#dba78f]" />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="overflow-hidden rounded-[1.8rem] bg-white border border-[#f1e1d8] shadow-[0_10px_30px_rgba(160,110,80,0.10)]"
                    >
                      <div className="relative h-72 overflow-hidden bg-[#f4e8df]">
                        {value.type === 'video' ? (
                          <video
                            className={`w-full h-full object-cover ${value.position}`}
                            autoPlay
                            muted
                            loop
                            playsInline
                          >
                            <source src={value.media} type="video/mp4" />
                          </video>
                        ) : (
                          <img
                            src={value.media}
                            alt={value.title}
                            loading="lazy"
                            decoding="async"
                            className={`w-full h-full object-cover ${value.position}`}
                          />
                        )}
                      </div>

                      <div className="p-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#fff8f3] shadow-md -mt-12 relative z-10 mb-4">
                          <Icon className="h-6 w-6 text-[#bf7756]" />
                        </div>

                        <h3 className="heading-serif text-2xl font-semibold text-[#341f17] mb-3">
                          {value.title}
                        </h3>

                        <p className="text-[#755d53] leading-relaxed text-base">
                          {value.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="pb-24 bg-[#f8f3ef]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-2 overflow-hidden rounded-[2.2rem] bg-[#f7e7df] shadow-[0_15px_40px_rgba(160,110,80,0.10)]"
              >

                {/* IMAGEN */}
                <div className="h-full">
                  <img
                    src={imagenRocio}
                    alt="Dulce Rocío"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* TEXTO */}
                <div className="relative px-8 py-10 md:px-12 md:py-14 flex flex-col justify-center">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#cb7f5d] mb-4">
                    Detrás de Dulce Rocío
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-[2px] bg-[#dba78f]" />
                    <span className="text-[#d28b6b] text-lg">♡</span>
                  </div>

                  <h2 className="heading-serif text-4xl md:text-5xl font-bold text-[#341f17] leading-[1.02] mb-6">
                    “Cada receta lleva
                    <br />
                    un pedacito de mí.”
                  </h2>

                  <p className="text-lg text-[#755d53] leading-relaxed max-w-xl mb-4">
                    Gracias por confiar en mi trabajo y permitirme ser parte de tus momentos más especiales.
                  </p>

                  <p className="text-2xl text-[#7a4c3a] italic">
                    Rocío ♥
                  </p>
                  <div className="absolute bottom-6 right-6 opacity-30 hidden md:block">
                    <svg
                      width="120"
                      height="120"
                      viewBox="0 0 140 140"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M95 118C103 102 108 88 108 73C108 59 103 49 95 42"
                        stroke="#d28b6b"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M82 96C94 92 102 84 108 72"
                        stroke="#d28b6b"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M108 72C112 65 115 58 115 50"
                        stroke="#d28b6b"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default AboutPage;