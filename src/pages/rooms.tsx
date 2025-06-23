import httpClient from "@/configs/httpClient";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import {  useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useStore } from "zustand";

type RoomType = {
    id: string;
    name: string;
    location: string;
    capacity: number;
}

type AddRoomType = {
    name: string;
    location: string;
    capacity: number;
}

function RoomsPage() {
    const { register, handleSubmit, reset } = useForm<AddRoomType>({
        defaultValues: {
            name: "",
            location: "",
            capacity: 1
        }
    });
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [formType, setFormType] = useState<"add" | "edit">("add")
    const [canAddOrEditRoom, setCanAddOrEditRoom] = useState<boolean>(false);
    const [selectedRoom, setSelectedRoom] = useState<RoomType>({
        name: "",
        capacity: 1,
        location: "",
        id: ""
    });
    const [start, setStart] = useState<string>("");
    const [end, setEnd] = useState<string>("");
    const { token } = useStore(useAuthStore, (state) => state);

    const handleGetRooms = async () => {
        try {
            const res = await httpClient.get("/room");
            setRooms(res.data);
        } catch (error) {
            console.log(error);

        }
    };

    const handleBooking = async () => {
        try {
            await httpClient.post("/booking", {
                roomId: selectedRoom.id,
                start,
                end,
            });
            alert("Booking succesful!")
        } catch (error) {
            //@ts-ignore
            alert(error?.response?.data?.message || 'Booking failed');
        }
    };

    const handleDeleteRoom = async () => {
        try {
            await httpClient.delete(`/room/${selectedRoom.id}`);
            setSelectedRoom({
                name: "",
                capacity: 1,
                location: "",
                id: ""
            });
            await handleGetRooms();
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddRoom = async () => {
        setFormType("add");
        setCanAddOrEditRoom(prev => !prev)
    }

    const handleEditRoom = async () => {
        setFormType("edit");
        setCanAddOrEditRoom(prev => !prev);
        reset({
            capacity: selectedRoom.capacity,
            location: selectedRoom.location,
            name: selectedRoom.name
        })
    }

    const onSubmit = async (data: AddRoomType) => {
        try {
            if (formType === "add") {
                await httpClient.post(`/room`, {
                    ...data,
                    capacity: +data.capacity
                });
            } else {
                await httpClient.patch(`/room/${selectedRoom.id}`, {
                    ...data,
                    capacity: +data.capacity
                });
            }

            setCanAddOrEditRoom(false)
            await handleGetRooms();
            reset()
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (token) {
            handleGetRooms();
        }

    }, [token]);

    return <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Meeting Rooms</h1>
        <ul className="space-y-2 mb-6">
            <button
                onClick={handleAddRoom}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50">
                Add
            </button>


            {canAddOrEditRoom && <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Name" className="border p-2 w-full" {...register("name", { required: true })} />
                <input type="number" placeholder="Capacity" className="border p-2 w-full" {...register("capacity", { required: true })} />
                <input type="text" placeholder="Location" className="border p-2 w-full" {...register("location", { required: true })} />

                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 mt-2 rounded disabled:opacity-50">
                    Submit
                </button>
            </form>}
            {
                rooms.map((room) => {

                    return <li
                        key={room.id}
                        className={`${selectedRoom.id === room.id && "bg-green-500"} border p-4 rounded flex justify-between cursor-pointer`}
                        onClick={() => setSelectedRoom(room)}>
                        <div>
                            <h2 className="text-lg font-semibold">{room.name}</h2>
                            <p>Location: {room.location}</p>
                            <p>Capacity: {room.capacity}</p>
                        </div>

                        {
                            selectedRoom.id === room.id && <div className="flex gap-3">

                                <button
                                    onClick={handleEditRoom}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDeleteRoom}
                                    className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        }
                    </li>
                })
            }
        </ul>

        <Link href="/bookings" className="text-blue-500 underline mb-4 inline-block">View My Bookings</Link>

        <div className="space-y-4 mb-6">
            <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="border p-2 w-full"
                placeholder="Start time"
            />
            <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="border p-2 w-full"
                placeholder="End time"
            />
            <button
                onClick={handleBooking}
                className="bg-indigo-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={!selectedRoom.id || !start || !end}
            >
                Book Room
            </button>
        </div>
    </div>
};

export default RoomsPage;