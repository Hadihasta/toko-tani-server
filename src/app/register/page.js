"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { IconLoader, IconUserPlus } from '@tabler/icons-react';
import { Input } from "@/components/ui/input";
import Button from '@/components/Button';
import apiClient from '@/services/api';

// Skema validasi menggunakan Zod
const registerSchema = z.object({
  name: z.string().min(3, { message: 'Nama minimal harus 3 karakter.' }),
  phone: z.string().min(10, { message: 'Nomor telepon tidak valid.' }).regex(/^\d+$/, { message: 'Nomor telepon hanya boleh berisi angka.'}),
  password: z.string().min(6, { message: 'Password minimal harus 6 karakter.' }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading('Membuat akun...');
    try {
      await apiClient.post('/auth/register', data);
      
      toast.success('Registrasi berhasil! Anda akan diarahkan ke halaman login.', {
        id: toastId,
        duration: 4000,
      });

      // Redirect ke halaman login setelah beberapa detik
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Gagal mendaftar. Silakan coba lagi.';
      toast.error(errorMessage, { id: toastId });
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F0EAD6]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-6 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm"
      >
        <div className="text-center">
          <Image
            src="/images/logo_tani.svg"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
          <h1 className="mt-4 text-3xl font-bold text-gray-800">Buat Akun Baru</h1>
          <p className="mt-2 text-gray-600">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-medium text-green-600 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Nama Lengkap"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Input
              type="tel"
              placeholder="Nomor Telepon (e.g. 0812...)"
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password (minimal 6 karakter)"
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-full hover:bg-green-700 transition-colors text-lg disabled:bg-gray-400 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <IconLoader className="animate-spin mr-2" />
                  Mendaftar...
                </>
              ) : (
                <>
                  <IconUserPlus className="mr-2" />
                  Daftar
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 