import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useAuthStore } from '@/store/useAuthStore';
import httpClient from '@/configs/httpClient';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
    const {token, user} = useStore(useAuthStore, (state) => state);

  const handleGetBookings = async () => {
      if (!token) return;

      const role = user.role;
      setIsAdmin(role === 'ADMIN');

      const url = role === 'ADMIN' ? '/booking' : '/booking/my';

      const res = await httpClient.get(url);
      setBookings(res.data);
    };

    const handleCancel = async (id: string) => {
        await httpClient.delete(`/booking/${id}`);

        setBookings(bookings.filter((i) => i.id !== id));
    }

  useEffect(() => {
    if(token){
      handleGetBookings();
    }
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{isAdmin ? 'All Bookings' : 'My Bookings'}</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              {isAdmin && <th className="p-2 border">User</th>}
              <th className="p-2 border text-gray-500">Room</th>
              <th className="p-2 border text-gray-500">Start</th>
              <th className="p-2 border text-gray-500">End</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                {isAdmin && <td className="p-2 border">{b.user?.email}</td>}
                <td className="p-2 border">{b.room?.name}</td>
                <td className="p-2 border">{new Date(b.start).toLocaleString()}</td>
                <td className="p-2 border">{new Date(b.end).toLocaleString()}</td>
                <td className="p-2 border text-center">
                                    <button
                                        onClick={() => handleCancel(b.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Cancel
                                    </button>
                                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
