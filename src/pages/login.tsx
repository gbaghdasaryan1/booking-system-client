import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useStore } from "zustand";

type LoginFormType = {
    email: string;
    password: string;
}


function LoginPage() {
    const { register, handleSubmit } = useForm<LoginFormType>();
    const { setToken, setUser, token } = useStore(useAuthStore, (state) => state);
    const router = useRouter();
    const [error, setError] = useState<string>("");

    const onSubmit = async (data: LoginFormType) => {
        try {
            const response = await axios.post("http://localhost:4000/auth/login", data);
            const user = await axios.get(`http://localhost:4000/user/${data.email}`);
            setUser(user.data);
            setToken(response.data)
        } catch (error) {
            setError("Invalid credentials")
        }
    };

    useEffect(() => {
        if (token.length) {
            router.push("/rooms");
        }
    }, [token])


    return <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="email" placeholder="Email" className="border p-2 w-full" {...register("email")} />
            <input type="password" placeholder="Password" className="border p-2 w-full" {...register("password")} />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">Login</button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    </div>
};

export default LoginPage;