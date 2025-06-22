import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useStore } from 'zustand';

export const Navigation = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { token, reset, user } = useStore(useAuthStore, (state) => state);

    useEffect(() => {
        setIsLoggedIn(!!token);
    }, [token]);

    const handleLogout = () => {
        reset()
        router.push('/login');
    };

    return (
        <nav className="bg-gray-800 text-white px-4 py-2 flex gap-4 items-center">
            <Link href="/rooms" className="hover:underline">Rooms</Link>
            <Link href="/bookings" className="hover:underline">Bookings</Link>
            {!isLoggedIn ? (
                <>
                    <Link href="/login" className="hover:underline">Login</Link>
                    <Link href="/register" className="hover:underline">Register</Link>
                </>
            ) : (
                <button onClick={handleLogout} className="hover:underline">Logout</button>
            )}

            <h2 className='text-green-500 ml-7'>Role - {user.role}</h2>
            <h2 className='text-green-500'>Email - {user.email}</h2>
        </nav>
    );
}
