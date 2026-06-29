import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import React from 'react';

const TruckAnimated = () => {
  return (
    <div className="relative w-6 h-6">
      {/* Khói */}
      <motion.div
        className="absolute -top-2 left-0 w-2 h-2 bg-gray-300 rounded-full opacity-50"
        animate={{ y: [-2, -6], opacity: [0.5, 0], scale: [0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
      <motion.div
        className="absolute -top-2 left-1 w-2 h-2 bg-gray-400 rounded-full opacity-50"
        animate={{ y: [-2, -6], opacity: [0.5, 0], scale: [0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
      />

      {/* Xe */}
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }} // rung nhẹ bánh xe ảo
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        <Truck className="w-6 h-6 text-green-600 drop-shadow-md" />
      </motion.div>
    </div>
  );
};

export default TruckAnimated;
