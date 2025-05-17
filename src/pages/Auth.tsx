
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Plane, Loader2, Check, X } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState<{login: boolean, signup: boolean, google: boolean, linkedin: boolean}>({
    login: false,
    signup: false,
    google: false,
    linkedin: false
  });
  const [error, setError] = useState("");
  const { signIn, signUp, signInWithGoogle, signInWithLinkedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(prev => ({ ...prev, login: true }));
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, login: false }));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name) {
      setError("Please enter your name");
      return;
    }
    
    setIsLoading(prev => ({ ...prev, signup: true }));
    
    try {
      await signUp(email, password, name);
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, signup: false }));
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(prev => ({ ...prev, google: true }));
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleLinkedInLogin = async () => {
    setIsLoading(prev => ({ ...prev, linkedin: true }));
    try {
      await signInWithLinkedIn();
    } catch (error) {
      console.error("LinkedIn login error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, linkedin: false }));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="bg-airblue inline-block p-3 rounded-full mb-4">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Welcome to SkyPredict</h1>
            <p className="text-muted-foreground mt-2">Sign in to access India's best flight deals</p>
          </div>
          
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-center">Authentication</CardTitle>
              <CardDescription className="text-center">
                Login or create an account to continue
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading.google}
                  >
                    {isLoading.google ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <g fill="none" fillRule="evenodd">
                          <path d="M20.66 12.7c0-.61-.05-1.19-.15-1.74H12.5v3.28h4.58a3.91 3.91 0 0 1-1.7 2.57v2.13h2.74a8.27 8.27 0 0 0 2.54-6.24z" fill="#4285F4" />
                          <path d="M12.5 21a8.1 8.1 0 0 0 5.63-2.06l-2.75-2.13a5.1 5.1 0 0 1-2.88.8 5.06 5.06 0 0 1-4.76-3.5H4.9v2.2A8.5 8.5 0 0 0 12.5 21z" fill="#34A853" />
                          <path d="M7.74 14.12a5.11 5.11 0 0 1 0-3.23v-2.2H4.9A8.5 8.5 0 0 0 4 12.5c0 1.37.33 2.67.9 3.82l2.84-2.2z" fill="#FBBC05" />
                          <path d="M12.5 7.38a4.6 4.6 0 0 1 3.25 1.27l2.44-2.44A8.17 8.17 0 0 0 12.5 4a8.5 8.5 0 0 0-7.6 4.68l2.84 2.2a5.06 5.06 0 0 1 4.76-3.5z" fill="#EA4335" />
                        </g>
                      </svg>
                    )}
                    Google
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleLinkedInLogin}
                    disabled={isLoading.linkedin}
                  >
                    {isLoading.linkedin ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    )}
                    LinkedIn
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-login">Email</Label>
                        <Input
                          id="email-login"
                          type="email"
                          placeholder="Your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password-login">Password</Label>
                        <Input
                          id="password-login"
                          type="password"
                          placeholder="Your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm flex items-center">
                          <X className="h-4 w-4 mr-2 flex-shrink-0" />
                          {error}
                        </div>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-airblue hover:bg-airblue-dark"
                        disabled={isLoading.login}
                      >
                        {isLoading.login && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Sign In
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name-signup">Full Name</Label>
                        <Input
                          id="name-signup"
                          type="text"
                          placeholder="Your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email-signup">Email</Label>
                        <Input
                          id="email-signup"
                          type="email"
                          placeholder="Your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password-signup">Password</Label>
                        <Input
                          id="password-signup"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                      
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm flex items-center">
                          <X className="h-4 w-4 mr-2 flex-shrink-0" />
                          {error}
                        </div>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-airblue hover:bg-airblue-dark"
                        disabled={isLoading.signup}
                      >
                        {isLoading.signup && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Create Account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2 text-center">
              <p className="text-sm text-muted-foreground">
                By continuing, you agree to SkyPredict's Terms of Service and Privacy Policy
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
