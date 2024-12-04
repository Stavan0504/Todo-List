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
import { SIGN_UP } from "@/app/graphQl/mutations/userMutations";
import client from "@/lib/apolloClient";

type Inputs = {
    Username: string;
    Email: string;
    Password: string;
};

export default function Signup() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    // This will ensure we only render client-side after the initial SSR
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {

        try {
            const { data: any } = await client.mutate({
                mutation: SIGN_UP,
                variables: {
                    name: data.Username,
                    email: data.Email,
                    password: data.Password,
                },
            });

            alert("User has been registered successfully");
            router.push("/signin");
        }
        catch (error: any) {
            if (error.networkError) {
                console.error("Network Error:", error.networkError);
                alert("Network error occurred. Please try again later.");
            }
            else if (error.graphQLErrors) {
                console.error("GraphQL Errors:", error.graphQLErrors);
                alert(error.graphQLErrors[0]?.message || "Signup failed");
            } 
            else {
                console.error("Unexpected Error:", error);
                alert("An unexpected error occurred. Please try again.");
            }
        }
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
