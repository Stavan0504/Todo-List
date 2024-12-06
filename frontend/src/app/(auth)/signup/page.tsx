/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import SignUpUser from "@/lib/signUpUser";

type Inputs = {
    Username: string;
    Email: string;
    Password: string;
};

type SignUp = {
    name: string;
    email: string;
    password: string;
}
export default function Signup() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    // This will ensure we only render client-side after the initial SSR
    useEffect(() => {
        setIsMounted(true);
    }, []);


    const { mutate: signUp } = useMutation({
        mutationFn: async ({ name, email, password }: SignUp) => {
          try {
            const result = await SignUpUser(name, email, password);
            if(result.errors[0].message=="User already exists"){
             throw new Error(result.errors[0].message)
                // console.log(result.errors)
            }
          } catch (error: any) {
            // Throw the error so `onError` catches it
            throw error;
          }
        },
        onSuccess: () => {
          alert("User has been registered successfully");
          router.push("/signin");
        },
        onError: (error: any) => {
            alert(error.message)
        },
      });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        signUp({ name: data.Username, email: data.Email, password: data.Password });
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    if (!isMounted) return null; // Prevent rendering the form until mounted on the client

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex min-h-screen items-center justify-center">
                <Tabs defaultValue="signup" className="w-[400px]">
                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sign Up</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="Enter Username"
                                        {...register("Username", {
                                            required: "Username is required",
                                            maxLength: {
                                                value: 20,
                                                message: "Username must be less than 20 characters",
                                            },
                                        })}
                                    />
                                    <p className="text-red-500 text-sm">
                                        {errors.Username?.message}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="Enter Email"
                                        {...register("Email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                                                message: "Invalid Email Address",
                                            },
                                        })}
                                    />
                                    <p className="text-red-500 text-sm">
                                        {errors.Email?.message}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        placeholder="Enter Password"
                                        {...register("Password", {
                                            required: "Password is required",
                                            pattern: {
                                                value:
                                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                message:
                                                    "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.",
                                            },
                                        })}
                                    />
                                    <p className="text-red-500 text-sm">
                                        {errors.Password?.message}
                                    </p>
                                </div>

                                <Button type="submit">Sign Up</Button>
                            </CardContent>
                            <CardFooter>
                                <p>
                                    Already have an account?{" "}
                                    <Link href="/signin">Sign In</Link>
                                </p>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </form>
    );
}
