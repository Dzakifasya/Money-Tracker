// src/app/login/page.tsx
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { user, signUp, signIn, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleAuthAction = (action: "signIn" | "signUp") => {
    startTransition(async () => {
      const values = form.getValues();
      try {
        if (action === "signIn") {
          await signIn(values.email, values.password);
        } else {
          await signUp(values.email, values.password);
        }
        toast({
          title: "Success",
          description: action === 'signIn' ? "Signed in successfully." : "Account created successfully.",
        });
        router.push("/");
      } catch (error: any) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if(user) return null;


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login / Sign Up</CardTitle>
          <CardDescription>
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <Button 
                  onClick={() => handleAuthAction("signIn")}
                  className="w-full" 
                  disabled={isPending}
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
                <Button
                  onClick={() => handleAuthAction("signUp")}
                  variant="outline"
                  className="w-full"
                  disabled={isPending}
                >
                   {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
