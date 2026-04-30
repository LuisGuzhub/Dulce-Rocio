
import React from 'react';
import { motion } from 'framer-motion';

function GalleryCard({ image, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
    >
      <img 
        src={image.url} 
        alt={image.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
          <h3 className="heading-serif text-xl font-semibold mb-1 text-balance">{image.title}</h3>
          <p className="text-sm opacity-90 leading-relaxed">{image.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default GalleryCard;
