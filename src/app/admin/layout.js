"use client";
import { useAuth } from "@/hooks/useAuth";
import { IconLayoutDashboard, IconShoppingCart, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    { name: 'Pesanan', href: '/admin/orders', icon: IconShoppingCart },
    // { name: 'Produk', href: '/admin/products', icon: IconLayoutDashboard },
    // { name: 'Pengguna', href: '/admin/users', icon: IconUsers },
];

export default function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="flex-shrink-0 w-64 bg-white border-r">
                <div className="flex flex-col h-full">
                    {/* Sidebar header */}
                    <div className="flex items-center justify-center h-20 border-b">
                        <h1 className="text-2xl font-bold text-green-600">Admin Panel</h1>
                    </div>
                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2">
                        {navigation.map((item) => (
                            <Link key={item.name} href={item.href}>
                                <a className={`flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-200 ${
                                    pathname.startsWith(item.href) ? 'bg-green-100 text-green-700' : ''
                                }`}>
                                    <item.icon className="w-6 h-6 mr-3" />
                                    {item.name}
                                </a>
                            </Link>
                        ))}
                    </nav>
                    {/* User info and logout */}
                    <div className="px-4 py-4 border-t">
                        <p className="font-semibold">{user?.name}</p>
                        <button onClick={logout} className="w-full mt-2 text-left text-sm text-red-600 hover:font-bold">
                            Keluar
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
} 