"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ButtonLink({ href, text }) {
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 12,
          delay: 0.3,
        }}
      >
        <Link href={href} >
          <button className="py-2 px-4 border rounded-4 bg-softPrimary text-greenPrimary fw-700">
            {text}
          </button>
        </Link>
      </motion.div>
    </>
  );
}
