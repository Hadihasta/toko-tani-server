import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Definisikan rute yang ingin dilindungi
  const protectedAdminRoutes = ['/admin'];
  const protectedUserRoutes = ['/user', '/profile', '/checkout'];
  const protectedDashboardRoutes = ['/dashboard'];

  const isProtectedRoute = 
    protectedAdminRoutes.some(path => pathname.startsWith(path)) ||
    protectedUserRoutes.some(path => pathname.startsWith(path)) ||
    protectedDashboardRoutes.some(path => pathname.startsWith(path));
  
  // Jika bukan rute yang dilindungi, lanjutkan
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Cek token dari Authorization header (untuk API routes) atau cookie (untuk pages)
  let token = null;
  
  if (pathname.startsWith('/api/')) {
    // Untuk API routes, ambil dari Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  } else {
    // Untuk pages, ambil dari cookie
    token = request.cookies.get('token')?.value;
  }

  // Jika tidak ada token, redirect ke login
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: "Token tidak ditemukan" },
        { status: 401 }
      );
    } else {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  try {
    // Verifikasi token
    const decoded = verifyToken(token);
    if (!decoded) {
      throw new Error('Token tidak valid');
    }

    // Cek role untuk rute admin
    if (protectedAdminRoutes.some(path => pathname.startsWith(path))) {
      if (decoded.role !== 'admin') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: "Akses ditolak" },
            { status: 403 }
          );
        } else {
          const url = new URL('/unauthorized', request.url);
          return NextResponse.redirect(url);
        }
      }
    }

    // Cek role untuk rute user
    if (protectedUserRoutes.some(path => pathname.startsWith(path))) {
      if (decoded.role !== 'user') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: "Akses ditolak" },
            { status: 403 }
          );
        } else {
          const url = new URL('/unauthorized', request.url);
          return NextResponse.redirect(url);
        }
      }
    }
    
    // Jika semua validasi lolos, lanjutkan ke rute yang diminta
    const response = NextResponse.next();
    
    // Menyematkan data user ke header request agar bisa diakses di API route jika perlu
    response.headers.set('x-user-id', decoded.id.toString());
    response.headers.set('x-user-role', decoded.role);
    
    return response;

  } catch (err) {
    console.error('Middleware error:', err);
    
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: "Token tidak valid" },
        { status: 401 }
      );
    } else {
      // Jika token tidak valid, hapus cookie dan redirect ke login
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(url);
      response.cookies.delete('token');
      return response;
    }
  }
}

// Konfigurasi matcher untuk middleware
export const config = {
  matcher: [
    '/admin/:path*', 
    '/user/:path*', 
    '/dashboard/:path*',
    '/profile/:path*', 
    '/checkout/:path*',
    '/api/admin/:path*',
    '/api/user/:path*'
  ],
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
