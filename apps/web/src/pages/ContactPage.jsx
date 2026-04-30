
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, Instagram, MapPin } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ContactForm from '@/components/ContactForm.jsx';

function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Correo electrónico',
      value: 'michellercampos@gmail.com',
      href: 'mailto:michellercamposs@gmail.com'
    },
    {
      icon: Phone,
      label: 'Teléfono',
      value: '+593 98 688 7205',
      href: 'tel:+593986887205'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@dulcerocioec',
      href: 'https://www.instagram.com/dulcerocioec_'
    },
    {
      icon: MapPin,
      label: 'Ubicación',
      value: 'Guayaquil, Ecuador',
      href: null
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contacto - Dulce Rocío</title>
        <meta
          name="description"
          content="Contáctanos para pedir tiramisús, pavés y brownies. Completa el formulario y te ayudaremos a elegir el postre perfecto para tu pedido."
        />
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
                <h1
                  className="heading-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance leading-tight"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Hablemos de tu pedido
                </h1>

                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Completa el formulario y cuéntanos qué postre deseas.
                  En Dulce Rocío preparamos tiramisús, pavés y brownies con una presentación deliciosa y cuidada.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="bg-card rounded-2xl p-8 shadow-lg">
                    <h2 className="heading-serif text-2xl font-semibold mb-6 text-balance">
                      Solicitud de pedido
                    </h2>
                    <ContactForm />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-8"
                >
                  <div className="bg-card rounded-2xl p-8 shadow-lg">
                    <h2 className="heading-serif text-2xl font-semibold mb-6 text-balance">
                      Información de contacto
                    </h2>

                    <div className="space-y-6">
                      {contactInfo.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                              <Icon className="h-6 w-6 text-secondary" />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">
                                {item.label}
                              </p>

                              {item.href ? (
                                <a
                                  href={item.href}
                                  target={item.href.startsWith('http') ? '_blank' : undefined}
                                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                  className="text-base font-medium text-foreground hover:text-primary transition-colors duration-200"
                                >
                                  {item.value}
                                </a>
                              ) : (
                                <p className="text-base font-medium text-foreground">{item.value}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-secondary/10 rounded-2xl p-8">
                    <h3 className="heading-serif text-xl font-semibold mb-4 text-balance">
                      Horario de atención
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lunes - Viernes</span>
                        <span className="font-medium">9:00 AM - 6:00 PM</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sábado</span>
                        <span className="font-medium">10:00 AM - 4:00 PM</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Domingo</span>
                        <span className="font-medium">Cerrado</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                      Te recomendamos realizar tu pedido con anticipación para asegurar disponibilidad.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default ContactPage;