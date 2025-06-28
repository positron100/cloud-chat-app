import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { Loader } from 'lucide-react';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, signIn, signUp } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let error;
      
      if (isSignUp) {
        const result = await signUp(email, password);
        error = result.error;
        
        if (!error) {
          toast.success("Account created! Please check your email to confirm your account.");
        }
      } else {
        const result = await signIn(email, password);
        error = result.error;
      }
      
      if (error) {
        let errorMessage = "Authentication failed.";
        
        if (error.message) {
          if (error.message.includes("credentials")) {
            errorMessage = "Invalid email or password.";
          } else if (error.message.includes("already")) {
            errorMessage = "Email already registered. Please sign in.";
            setIsSignUp(false);
          } else {
            errorMessage = error.message;
          }
        }
        
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden px-6 sm:px-8">
      <div className="w-full max-w-md z-10">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp 
                ? "Sign up to start coding collaboratively" 
                : "Sign in to your account to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors relative" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader className="animate-spin mr-2 h-4 w-4" />
                    <span>Processing</span>
                  </span>
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full text-sm" 
              onClick={toggleAuthMode}
            >
              {isSignUp 
                ? "Already have an account? Sign In" 
                : "Don't have an account? Sign Up"
              }
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="absolute inset-0 z-0">
        <ul className="squares">
          {Array.from({ length: 10 }).map((_, idx) => (
            <li
              key={idx}
              style={{
                "--i": Math.random() * 10 + 1,
                "--j": Math.random() * 7 + 1,
              } as React.CSSProperties}
              className="bg-indigo-500/20 absolute list-none rounded-lg animate-float"
            />
          ))}
        </ul>
      </div>
      
      <footer className="absolute bottom-4 text-center w-full text-sm text-gray-600 z-10">
        Built with ❤️ by Cloud Crafters
      </footer>
    </div>
  );
};

export default AuthPage;
