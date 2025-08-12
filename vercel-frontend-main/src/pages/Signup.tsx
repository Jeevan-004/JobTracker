  import { useState } from "react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { motion } from "framer-motion";
  import { useNavigate, Link } from "react-router-dom";
  import { toast } from "sonner";
  import { User, Mail, Lock } from "lucide-react";
  import { auth } from "@/services/api";

  const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState(
      "What is your pet's name?"
    );
    const [securityAnswer, setSecurityAnswer] = useState("");
    //const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      
      try {
        const { token, user } = await auth.signup(name, email, password,securityQuestion,securityAnswer);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success("Registered successfully!");
        navigate("/home");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to register");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen w-full flex flex-col space-bg overflow-hidden">
        <div className="flex-1 w-full flex items-center justify-center p-4">
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="space-card p-8 rounded-2xl backdrop-blur-md flex flex-col justify-center">
              <div className="mb-8 text-white space-y-1">
                <h1 className="text-3xl font-bold">SIGN UP</h1>
                <p className="text-sm text-white">Create your account</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm text-white">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="bg-jobwise-dark/50 border-purple-800/30 text-white placeholder:text-white/40 py-6 pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm text-white">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="bg-jobwise-dark/50 border-purple-800/30 text-white placeholder:text-white/40 py-6 pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm text-white">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="bg-jobwise-dark/50 border-purple-800/30 text-white placeholder:text-white/40 py-6 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="securityQuestion"
                    className="text-sm text-white"
                  >
                    Security Question
                  </label>
                  <select
                    id="securityQuestion"
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    className="bg-jobwise-dark/50 border-purple-800/30 text-white placeholder:text-white/40 py-6 pl-3 w-full rounded-md"
                    required
                  >
                    <option>What is your pet's name?</option>
                    <option>What is your mother's maiden name?</option>
                    <option>What was your first car?</option>
                    <option>What is your favorite book?</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="securityAnswer" className="text-sm text-white">
                    Security Answer
                  </label>
                  <div className="relative">
                    <Input
                      id="securityAnswer"
                      type="text"
                      placeholder="Answer to your security question"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      required
                      className="bg-jobwise-dark/50 border-purple-800/30 text-white placeholder:text-white/40 py-6 pl-10"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="auth-btn primary-btn bg-purple-600 hover:bg-purple-700 text-white w-full py-6"
                >
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>
                
                <div className="text-center text-white mt-6">
                  <p>Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300">Sign in</Link></p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  export default Signup;
