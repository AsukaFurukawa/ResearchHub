import React from 'react';
import { motion } from 'framer-motion';

export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gh-subtle p-6 rounded shadow-lg max-w-md w-full border border-gh"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gh-text-muted hover:text-gh-text focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </motion.div>
    </motion.div>
  );
}
