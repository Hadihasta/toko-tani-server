"use client";
import { motion } from "framer-motion";

export default function Button({ 
  text, 
  onClick, 
  loading = false, 
  disabled = false,
  type = "button",
  className = ""
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 12,
        delay: 0.3,
      }}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`py-2 px-4 rounded-4 bg-softPrimary text-greenPrimary fw-700 ${className} ${
          (disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <div className="d-flex align-items-center justify-content-center">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading...
          </div>
        ) : (
          text
        )}
      </button>
    </motion.div>
  );
} 