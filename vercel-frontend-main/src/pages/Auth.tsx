
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import { Mail, Globe } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, just navigate to home
    toast.success(isLogin ? "Logged in successfully!" : "Registered successfully!");
    navigate("/home");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center space-bg overflow-hidden p-4 relative">
      {/* Top-right theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle className="bg-black/20 text-white hover:bg-black/30" />
      </div>
      
      {/* Header with user name - mobile version top left */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-white">
        <span className="text-sm font-medium">Ibrahim</span>
      </div>
      
      {/* Space elements - planets and stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large blue planet */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="planet w-64 h-64 rounded-full bg-blue-700/30 border border-blue-500/20 left-[-5%] top-[5%]"
        />
        
        {/* Small purple planet */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="planet w-36 h-36 rounded-full bg-purple-700/20 border border-purple-500/20 left-[60%] top-[15%]"
        />
        
        {/* Medium purple planet */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="planet w-48 h-48 rounded-full bg-purple-800/30 border border-purple-600/20 right-[-10%] bottom-[10%]"
        />
        
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: Math.random() * 0.7 + 0.3 }}
            transition={{ delay: Math.random() * 0.5, duration: 0.5 }}
            className="cosmos-particle"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 5}s`,
            }}
          />
        ))}
        
        {/* Shooting star */}
        <motion.div
          initial={{ x: "-100%", y: "100%", opacity: 0 }}
          animate={{ x: "200%", y: "-200%", opacity: [0, 1, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 7
          }}
          className="absolute w-[150px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent transform rotate-[25deg] left-[30%] top-[40%]"
        />
      </div>
      
      {/* Mobile version */}
      <div className="md:hidden w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12 text-white space-y-1">
            <h1 className="text-3xl font-bold">SIGN IN</h1>
            <p className="text-xs text-white/60">Sign in with email address</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-jobwise-dark/50 border-purple-800/30 text-white placeholder:text-white/40 py-6"
            />
            
            <Button 
              type="submit" 
              className="auth-btn primary-btn"
            >
              Sign up
            </Button>
            
            <div className="flex items-center gap-2 pt-4">
              <div className="flex-1 h-[1px] bg-white/10"></div>
              <span className="text-xs text-white/40">Or continue with</span>
              <div className="flex-1 h-[1px] bg-white/10"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button type="button" className="auth-btn social-btn">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button type="button" className="auth-btn social-btn">
                <Globe className="mr-2 h-4 w-4" />
                Web
              </Button>
            </div>
            
            <div className="text-xs text-center text-white/40 pt-6">
              By signing in you agree to our <a href="#" className="underline">Terms and Conditions</a>
            </div>
          </form>
        </motion.div>
      </div>
      
      {/* Desktop version */}
      <div className="hidden md:block w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-12"
        >
          {/* Left side - message */}
          <div className="flex flex-col justify-center items-start p-8">
            <div className="text-white space-y-6">
              <h1 className="text-4xl font-bold">SIGN IN TO YOUR</h1>
              <h1 className="text-4xl font-bold text-purple-400">ADVENTURE!</h1>
            </div>
          </div>
          
          {/* Right side - form */}
          <div className="space-card p-8 rounded-2xl backdrop-blur-md flex flex-col justify-center">
            <div className="mb-8 text-white space-y-1">
              <h2 className="text-3xl font-bold">SIGN IN</h2>
              <p className="text-sm text-white/60">Sign in with email address</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-jobwise-dark/50 border-purple-800/30 text-white placeholder:text-white/40 py-6"
              />
              
              <Button 
                type="submit" 
                className="auth-btn primary-btn"
              >
                Sign up
              </Button>
              
              <div className="flex items-center gap-2 pt-4">
                <div className="flex-1 h-[1px] bg-white/10"></div>
                <span className="text-xs text-white/40">Or continue with</span>
                <div className="flex-1 h-[1px] bg-white/10"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button type="button" className="auth-btn social-btn">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button type="button" className="auth-btn social-btn">
                  <Globe className="mr-2 h-4 w-4" />
                  Web
                </Button>
              </div>
              
              <div className="text-xs text-center text-white/40 pt-4">
                By signing in you agree to our <a href="#" className="underline">Terms and Conditions</a>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
