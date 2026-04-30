import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Camera,
  Play,
  Instagram,
  CalendarCheck,
  Gift,
  Heart,
  ChefHat,
  Mail
} from 'lucide-react';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

import michu_sentada from '@/assets/galeria/michelle_sentada.jpg';
import michu_cuerda from '@/assets/galeria/michu_cuerda.jpg';
import michu_postre_manos from '@/assets/galeria/michu_postre_manos.jpg';
import michu_sticker from '@/assets/galeria/michu_sticker.jpg';

import fotoInsta1 from '@/assets/galeria/foto_insta_1.jpg';
import fotoInsta2 from '@/assets/galeria/foto_insta_2.jpg';
import fotoInsta3 from '@/assets/galeria/foto_insta_3.jpg';
import fotoInsta4 from '@/assets/galeria/foto_insta_4.jpg';

import video1 from '@/assets/galeria/video_insta_1.mp4';
import video2 from '@/assets/galeria/video_insta_2.mp4';
import video3 from '@/assets/galeria/video_insta_3.mp4';
import video4 from '@/assets/galeria/video_insta_4.mp4';

function GalleryPage() {
  const [activeTab, setActiveTab] = useState('fotos');

  const mainImage = {
    url: michu_sentada
  };

  const sideImages = [
    {
      url: michu_sticker
    },
    {
      url: michu_cuerda
    },
    {
      url: michu_postre_manos
    }
  ];

  const videos = [
    {
      url: video1,
      title: 'Preparación artesanal'
    },
    {
      url: video2,
      title: 'Empaque del pedido'
    },
    {
      url: video3,
      title: 'Postres personalizados'
    },
    {
      url: video4,
      title: 'Detrás de cámaras'
    }
  ];

  const featuredImages = [
    {
      url: michu_sticker,
      title: 'Stickers personalizados'
    },
    {
      url: michu_cuerda,
      title: 'Empaque artesanal'
    },
    {
      url: michu_postre_manos,
      title: 'Postres listos para entregar'
    }
  ];

  const instagramImages = [
    fotoInsta1,
    fotoInsta2,
    fotoInsta3,
    fotoInsta4
  ];

  return (
    <>
      <Helmet>
        <title>Galería - Dulce Rocío</title>
        <meta
          name="description"
          content="Galería multimedia de Dulce Rocío: fotos, videos, reels y momentos especiales de nuestros postres personalizados."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-[#fbf4ee]">
        <Header />

        <main className="flex-1">
          <section className="py-16 md:py-20 bg-gradient-to-b from-[#f5e8df] via-[#fbf4ee] to-[#fffaf6]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h1
                  className="heading-serif text-4xl md:text-6xl font-bold text-[#3b241b] mb-5 leading-tight"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  Nuestra galería
                </h1>

                <p className="text-base md:text-lg text-[#7c655b] max-w-2xl mx-auto leading-relaxed">
                  Más que fotos, momentos que muestran amor, dedicación y la belleza de nuestros postres.
                </p>
              </motion.div>

              <div className="grid grid-cols-3 gap-4 md:gap-8 border-b border-[#e2cfc2] mb-8 pb-4 text-[#5b3a2f]">
                <button
                  onClick={() => setActiveTab('fotos')}
                  className={`flex items-center justify-center gap-2 font-semibold pb-4 relative transition-all duration-300 ${activeTab === 'fotos'
                      ? 'text-[#3b241b]'
                      : 'text-[#7c655b] hover:text-[#3b241b]'
                    }`}
                >
                  <Camera size={20} />
                  <span>Fotos</span>

                  {activeTab === 'fotos' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5b3a2f]" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('videos')}
                  className={`flex items-center justify-center gap-2 font-semibold pb-4 relative transition-all duration-300 ${activeTab === 'videos'
                      ? 'text-[#3b241b]'
                      : 'text-[#7c655b] hover:text-[#3b241b]'
                    }`}
                >
                  <Play size={20} />
                  <span>Videos</span>

                  {activeTab === 'videos' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5b3a2f]" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('reels')}
                  className={`flex items-center justify-center gap-2 font-semibold pb-4 relative transition-all duration-300 ${activeTab === 'reels'
                      ? 'text-[#3b241b]'
                      : 'text-[#7c655b] hover:text-[#3b241b]'
                    }`}
                >
                  <Instagram size={20} />
                  <span>Reels</span>

                  {activeTab === 'reels' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5b3a2f]" />
                  )}
                </button>
              </div>

              {activeTab === 'fotos' && (
                <div className="grid lg:grid-cols-[1.35fr_0.95fr] gap-8 items-start">
                  <div className="grid md:grid-cols-[1fr_170px] gap-4">
                    <div className="relative rounded-2xl overflow-hidden shadow-sm h-[260px] md:h-[430px] group">
                      <img
                        src={mainImage.url}
                        alt="Imagen principal de Dulce Rocío"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
                      {sideImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative rounded-xl overflow-hidden h-24 md:h-[132px] group"
                        >
                          <img
                            src={image.url}
                            alt={`Mini imagen ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2
                      className="heading-serif text-2xl md:text-3xl font-bold text-[#3b241b] mb-6"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      Imágenes destacadas
                    </h2>

                    <div className="grid sm:grid-cols-3 lg:grid-cols-2 gap-5">
                      {featuredImages.map((image, index) => (
                        <div key={index}>
                          <div className="relative rounded-xl overflow-hidden h-32 md:h-36 group">
                            <img
                              src={image.url}
                              alt={image.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          <p className="mt-3 text-sm font-semibold text-[#5b3a2f]">
                            {image.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'videos' && (
                <section className="mt-10 mb-12">
                  <h2
                    className="heading-serif text-2xl md:text-3xl font-bold text-[#3b241b] mb-8 text-center"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    Videos destacados
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videos.map((video, index) => (
                      <article
                        key={index}
                        className="bg-[#f3e3d8]/70 rounded-2xl overflow-hidden shadow-sm"
                      >
                        <video
                          src={video.url}
                          controls
                          className="w-full h-[420px] object-cover bg-black"
                        />

                        <div className="p-4 text-center">
                          <h3 className="font-bold text-[#3b241b] text-sm">
                            {video.title}
                          </h3>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'reels' && (
                <section className="mt-10 mb-12 text-center py-20 bg-[#f3e3d8]/60 rounded-2xl">
                  <Instagram size={42} className="mx-auto mb-4 text-[#c7657b]" />
                  <h2
                    className="heading-serif text-2xl md:text-3xl font-bold text-[#3b241b] mb-3"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    Próximamente reels
                  </h2>
                  <p className="text-[#7c655b]">
                    Aquí mostraremos contenido corto tipo Instagram.
                  </p>
                </section>
              )}

              <section className="mt-12 bg-[#f3e3d8]/70 rounded-2xl p-5 md:p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <Instagram size={34} className="text-[#c7657b]" />
                  <div>
                    <h3 className="heading-serif text-xl font-bold text-[#3b241b]">
                      Síguenos en Instagram
                    </h3>
                    <p className="text-sm text-[#7c655b]">@dulcerocioec_</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {instagramImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Publicación de Instagram ${index + 1}`}
                      className="w-full h-28 md:h-36 object-cover rounded-xl"
                    />
                  ))}
                </div>
              </section>

              <section className="mt-10 grid md:grid-cols-3 gap-4 bg-[#f3e3d8]/60 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <ChefHat size={34} className="text-[#8a604d]" />
                  <div>
                    <h4 className="font-bold text-[#3b241b]">Ingredientes de calidad</h4>
                    <p className="text-sm text-[#7c655b]">Seleccionamos lo mejor para cada creación.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Heart size={34} className="text-[#8a604d]" />
                  <div>
                    <h4 className="font-bold text-[#3b241b]">Hecho con amor</h4>
                    <p className="text-sm text-[#7c655b]">Cada detalle está pensado para ti.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Gift size={34} className="text-[#8a604d]" />
                  <div>
                    <h4 className="font-bold text-[#3b241b]">Pedidos personalizados</h4>
                    <p className="text-sm text-[#7c655b]">Creamos tu postre ideal para cada ocasión.</p>
                  </div>
                </div>
              </section>

              <section className="mt-10 grid md:grid-cols-2 gap-6">
                <div className="bg-[#f3e3d8]/60 rounded-2xl p-8 flex items-center gap-6">
                  <div className="hidden sm:flex w-20 h-20 rounded-full bg-[#e8d5c8] items-center justify-center text-[#765141]">
                    <CalendarCheck size={36} />
                  </div>

                  <div>
                    <h3 className="heading-serif text-2xl font-bold text-[#3b241b] mb-2">
                      ¿Tienes un evento especial?
                    </h3>
                    <p className="text-sm text-[#7c655b] mb-5">
                      Cotiza tu pedido personalizado con nosotros.
                    </p>

                    <a
                      href="/order"
                      className="inline-flex bg-[#5b3a2f] text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[#3b241b] transition-colors"
                    >
                      Pide tu postre
                    </a>
                  </div>
                </div>

                <div className="bg-[#f3e3d8]/60 rounded-2xl p-8 flex items-center gap-6">
                  <div className="hidden sm:flex w-20 h-20 rounded-full bg-[#e8d5c8] items-center justify-center text-[#765141]">
                    <Mail size={36} />
                  </div>

                  <div>
                    <h3 className="heading-serif text-2xl font-bold text-[#3b241b] mb-2">
                      ¿Te gustaría ver más?
                    </h3>
                    <p className="text-sm text-[#7c655b] mb-5">
                      Síguenos en nuestras redes para no perderte nada.
                    </p>

                    <a
                      href="https://instagram.com/dulcerocioec_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex bg-[#5b3a2f] text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[#3b241b] transition-colors"
                    >
                      Ir a Instagram
                    </a>
                  </div>
                </div>
              </section>

            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default GalleryPage;