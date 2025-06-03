
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/theme-provider';
import { toast } from '@/hooks/use-toast';

const Auth: React.FC = () => {
  const { theme } = useTheme();
  const { login, signup, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && !username.trim()) {
      toast({
        title: "Error",
        description: "Username is required for registration",
        variant: "destructive",
      });
      return;
    }

    const result = isLogin 
      ? await login(email, password)
      : await signup(email, password, username);

    if (!result.error) {
      toast({
        title: "Success",
        description: isLogin ? "Logged in successfully!" : "Account created successfully!",
      });
      navigate('/');
    } else {
      toast({
        title: "Error",
        description: result.error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className={`${theme === "bright" ? "border-[1.5px] border-black/40" : ""}`}>
        <CardHeader>
          <CardTitle className="text-center">
            {isLogin ? 'Login' : 'Create Account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
              disabled={loading}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
