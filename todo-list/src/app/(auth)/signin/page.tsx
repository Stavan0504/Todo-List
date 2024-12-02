"use client"
import { signIn } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
} from "@/components/ui/tabs"
import Link from "next/link"
import { useRouter } from "next/navigation"


export default function signin() {
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isMounted, setIsMounted] = useState(false); // Flag to indicate client-side render

    useEffect(() => {
        setIsMounted(true);
    }, []);


    
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        // Call the NextAuth `signIn` method
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false, // Ensures client-side result handling
        })
        
        if (result?.ok) {
            router.push("/"); // Redirect to a secure page after success
        } else {
            console.error("Sign-in failed:", result?.error || "Unknown error");
            alert("Invalid email or password");
        }
    }
    
    if (!isMounted) return null; // Prevent rendering the form until mounted on the client

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Tabs defaultValue="signIn" className="w-[400px]">
                <TabsContent value="signIn">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sign In</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" 
                                        name="email" 
                                        placeholder="Enter Email"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" 
                                        name="password" 
                                        placeholder="Enter Password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                         />
                            </div>
                            <Button onClick={handleSubmit}>Sign In</Button>
                            
                        </CardContent>
                        <CardFooter>
                            <p>Don&apos;t have an account? <Link href="/signup">sign up </Link></p>         
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}