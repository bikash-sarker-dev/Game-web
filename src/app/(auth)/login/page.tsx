import { Metadata } from "next";
import SignInForm from "@/components/loginForm/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
};

const page = () => {
  return (
    <div>
      <SignInForm />
    </div>
  );
};

export default page;
