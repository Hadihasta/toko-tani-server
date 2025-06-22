"use client";
import "./globals.css";
import "../styles/custom.scss";
import { Toaster } from 'react-hot-toast';

// Komponen CartProvider bisa sangat sederhana jika logic utama ada di hook.
// Tujuannya adalah menyediakan konteks jika dibutuhkan di masa depan.
const CartProvider = ({ children }) => {
  return <>{children}</>;
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <CartProvider>
          <Toaster 
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
