import httpClient from "@/configs/httpClient";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form"


type RegisterFormType = {
    email: string;
    password: string;
    role: string;
}

function RegisterPage() {
    const { register, handleSubmit } = useForm<RegisterFormType>();
    const router = useRouter();

    const onSubmit = async (data: any) => {
        try {
             await httpClient.post("/auth/register", data);
            router.push("/login")
        } catch (error) {
            console.log(error);
        }
    };
    
    return <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="email" placeholder="Email" className="border p-2 w-full" {...register("email")} />
            <input type="password" placeholder="Password" className="border p-2 w-full" {...register("password")} />
            <select className="border p-2 2-full" {...register("role", { required: true })}>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
            </select>
            <button type="submit" className="bg-green-500 text-white py-2">Register</button>
        </form>
    </div>
};

export default RegisterPage;