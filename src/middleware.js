import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const protectedRoutes = ["/api/protected"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Definisikan rute yang ingin dilindungi
  const protectedAdminRoutes = ['/admin'];
  const protectedUserRoutes = ['/profile', '/checkout'];

  const isProtectedRoute = 
    protectedAdminRoutes.some(path => pathname.startsWith(path)) ||
    protectedUserRoutes.some(path => pathname.startsWith(path));
  
  // Jika bukan rute yang dilindungi, lanjutkan
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Jika tidak ada token, redirect ke login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Verifikasi token
    const decoded = await verifyToken(request);
    if (!decoded.success) {
      throw new Error('Token tidak valid');
    }

    // Cek role untuk rute admin
    if (protectedAdminRoutes.some(path => pathname.startsWith(path))) {
      if (decoded.user.role !== 'admin') {
        const url = new URL('/unauthorized', request.url); // Buat halaman unauthorized
        return NextResponse.redirect(url);
      }
    }
    
    // Jika semua validasi lolos, lanjutkan ke rute yang diminta
    const response = NextResponse.next();
    // Menyematkan data user ke header request agar bisa diakses di API route jika perlu
    response.headers.set('x-user-id', decoded.user.id);
    response.headers.set('x-user-role', decoded.user.role);
    
    return response;

  } catch (err) {
    console.error('Middleware error:', err);
    // Jika token tidak valid, hapus cookie dan redirect ke login
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(url);
    response.cookies.delete('token');
    return response;
  }
}

// Hanya untuk route API tertentu
export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/checkout'],
};

// contoh endpoint api/protected/route.js
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const userId = req.headers.get("x-user-id");
//   return NextResponse.json({ message: "POST method success", userId });
// }

// export async function GET() {
//   return NextResponse.json({ message: "GET is public" });
// }

// simpan di front end local storage lalu kirim

// fetch("/api/protected", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   });
