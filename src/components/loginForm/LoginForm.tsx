/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import {
//   useGoogleLoginMutation,
//   useSignInMutation,
// } from "@/redux/api/auth/authApi";
// import { setUser } from "@/redux/features/user/userSlice";
// import CustomInput from "@/ui/CustomeInput";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Cookies from "js-cookie";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import { toast } from "sonner";

// import * as z from "zod";
// import { EqualApproximatelyIcon, ParenthesesIcon } from "lucide-react";

// // Define Zod schema for validation
// const formSchema = z.object({
//   email: z
//     .string()
//     .email({ message: "Please enter a valid email address" })
//     .min(1, { message: "Email is required" }),
//   password: z
//     .string()
//     .min(6, { message: "Password should be at least 6 characters long" })
//     .min(1, { message: "Password is required" }),
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function SignInPage() {
//   // Use React Hook Form with Zod resolver
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const [signIn, { isLoading }] = useSignInMutation();
//   const [googleSignIn] = useGoogleLoginMutation();

//   const router = useRouter();
//   const dispatch = useDispatch();

//   console.log(process.env.NEXT_PUBLIC_DOMAIN_URL_TWO);
//   console.log(process.env.NEXT_PUBLIC_DOMAIN_URL_ONE);

//   const domain = window.location.origin;
//   const onSubmit = async (data: FormValues) => {
//     console.log("Form Data:", data);
//     try {
//       const response = await signIn(data).unwrap();
//       console.log(response);
//       if (response?.success) {
//         Cookies.set("token", response.data.accessToken);
//         dispatch(
//           setUser({
//             token: response.data.accessToken,
//           }),
//         );
//         toast.success("Login successful");
//       }
//     } catch (error: any) {
//       console.log("Error during sign-in:", error);
//       return toast.error(error?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="max-w-[540px] lg:w-[540px] h-auto mx-auto bg-[#FFF] p-6 rounded-2xl border border-[#6E51E01A] shadow-[0_0_20px_0_rgba(110,81,224,0.10)]">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
//         {/* Email Input */}
//         <CustomInput
//           id="email"
//           type="email"
//           label="Email"
//           placeholder="Enter your email"
//           leftIcon={<EqualApproximatelyIcon />}
//           {...register("email")}
//           error={errors.email?.message}
//         />

//         {/* Password Input */}
//         <CustomInput
//           id="password"
//           type="password"
//           label="Password"
//           placeholder="Enter your password"
//           showPasswordToggle={true}
//           error={errors.password?.message}
//           leftIcon={<ParenthesesIcon />}
//           {...register("password")}
//         />

//         {/* Remember Me and Forgot Password */}
//         <div className="text-right">
//           <Link
//             href="/forget-password"
//             className="text-sm text-[#000000] font-semibold text-[16px] hover:underline"
//           >
//             Reset Password
//           </Link>
//         </div>
//         {/* Login Button */}

//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`w-full py-3 rounded-xl text-white font-semibold
//   flex items-center justify-center gap-2
//   transition duration-300 shadow-md
//   ${
//     isLoading
//       ? "bg-blue-400 cursor-not-allowed"
//       : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg"
//   }`}
//         >
//           {isLoading && (
//             <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//           )}

//           {isLoading ? "Signing in..." : "Sign In"}
//         </button>
//       </form>
//       <div className="text-center mb-3 mt-3 text-[16px] text-gray-600">
//         Don’t have an account?{" "}
//         <Link
//           href="/signUp"
//           className="text-primaryColor text-[16px] font-semibold hover:underline"
//         >
//           Sign up
//         </Link>
//         <div className="flex items-center gap-4 w-[80%] mx-auto my-3">
//           <div className="flex-1 h-[1px] bg-[#D1D6DB]" />
//           <span className="text-[16px] text-primaryColor">or</span>
//           <div className="flex-1 h-[1px] bg-[#D1D6DB]" />
//         </div>
//         {/* <button className="w-full flex items-center justify-center gap-3 border border-[#D1D6DB] rounded-md py-2.5 transition">
//           <img
//             src="/authImage/googleIcon.png"
//             alt="google icon"
//             className="w-5 h-5"
//           />
//           <span className="text-[#2D2D2D] font-medium text-[16px]">
//             Sign in with Google
//           </span>
//         </button> */}
//       </div>
//     </div>
//   );
// }

"use client";

import { useSignInMutation } from "@/redux/api/auth/authApi";
import { setUser } from "@/redux/features/user/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import * as z from "zod";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// ================== ZOD SCHEMA ==================
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

// ================== INPUT COMPONENT ==================
type InputProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  showToggle?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputField = ({
  id,
  label,
  type = "text",
  placeholder,
  error,
  icon,
  showToggle,
  ...rest
}: InputProps) => {
  const [show, setShow] = useState(false);

  const inputType =
    showToggle && type === "password" ? (show ? "text" : "password") : type;

  return (
    <div className="w-full space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2 rounded-lg border outline-none
          ${error ? "border-red-500" : "border-gray-300"}
          focus:ring-2 focus:ring-blue-500`}
          {...rest}
        />

        {/* Password Toggle */}
        {showToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

// ================== MAIN COMPONENT ==================
export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [signIn, { isLoading }] = useSignInMutation();

  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await signIn(data).unwrap();
      console.log(response);

      Cookies.set("token", response.token);
      router.push("/");
      //   toast.success("Login successful");
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-[500px] bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            icon={<Mail size={18} />}
            {...register("email")}
            error={errors.email?.message}
          />

          {/* Password */}
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={<Lock size={18} />}
            showToggle
            {...register("password")}
            error={errors.password?.message}
          />

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forget-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Reset Password
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-white font-semibold 
            flex items-center justify-center gap-2
            transition duration-300 shadow-md
            ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            }`}
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}

            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/signUp"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
