'use client'
import { Input } from "@/components/ui/input";
import { Mail, LockKeyhole } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";

type LoginInput={
    email: string,
    password: string,
}

function LoginPage() {

  const [loginInfo,setLoginInfo]=useState<LoginInput>({
    email: "",
    password: "",
  })

  const changeEventHandler=(e : ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target;
    setLoginInfo({...loginInfo, [name]: value});
  }

  const loginSubmitHandler= (e: FormEvent)=>{
    e.preventDefault();
    console.log(loginInfo);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <form onSubmit={loginSubmitHandler} className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to TasteTrail</h1>
          <p className="text-gray-400">Login to continue</p>
        </div>
        <div className="mb-6">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              value={loginInfo.email}
              name="email"
              onChange={changeEventHandler}
              className="pl-12 py-3 text-gray-100 bg-gray-900 border border-gray-700 rounded-md focus-visible:ring-2 focus:ring-blue-500"
            />
            <Mail className="absolute inset-y-0 left-3 my-auto text-gray-500" />
          </div>
        </div>
        <div className="mb-6">
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              value={loginInfo.password}
              name="password"
              onChange={changeEventHandler}
              className="pl-12 py-3 text-gray-100 bg-gray-900 border border-gray-700 rounded-md focus-visible:ring-2 focus:ring-blue-500"
            />
            <LockKeyhole className="absolute inset-y-0 left-3 my-auto text-gray-500" />
          </div>
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mb-4">
          Login
        </Button>
        <Separator className="my-6 border-gray-700" />
        <div className="flex items-center justify-center space-x-2">
          <p className="text-gray-400">Don't have an account?</p>
          <Button variant="link" className="text-blue-500 hover:text-blue-600 p-0">
            Sign up
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
