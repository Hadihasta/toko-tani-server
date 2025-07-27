import './globals.css'
import '../styles/custom.scss'
import { Toaster } from '@/components/ui/sonner'



export const metadata = {
  title: 'Sedulur Tani',
  description: 'Best online shop',
  icons: {
    icon: '/images/logo_tani.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div
          className="mx-auto bg-white shadow-sm"
          style={{ maxWidth: '576px', height: '100vh' }}
        >
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  )
}
