import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
  const navigate = useNavigate();

  // Fetch security question when email is provided
  const fetchSecurityQuestion = async () => {
    if (!email) return;
    
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/security-question?email=${encodeURIComponent(email)}`
      );
      
      const data = await res.json();
      
      if (res.ok) {
        setSecurityQuestion(data.securityQuestion);
        setShowSecurityQuestion(true);
      } else {
        toast.error(data.message || "User not found. Please check your email.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch security question. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, securityAnswer, newPassword }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully! Please login.");
        navigate("/login");
      } else {
        toast.error(
          data.message || "Failed to reset password. Please try again."
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col space-bg overflow-hidden">
      <div className="flex-1 w-full flex items-center justify-center p-4">
        {/* Planets and stars UI remains unchanged */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Planets */}
          <motion.div className="planet w-64 h-64 rounded-full bg-blue-700/30 border border-blue-500/20 left-[-5%] top-[5%]" />
          <motion.div className="planet w-36 h-36 rounded-full bg-purple-700/20 border border-purple-500/20 left-[60%] top-[15%]" />
          <motion.div className="planet w-48 h-48 rounded-full bg-purple-800/30 border border-purple-600/20 right-[-10%] bottom-[10%]" />
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
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
              repeatDelay: 7,
            }}
            className="absolute w-[150px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent transform rotate-[25deg] left-[30%] top-[40%]"
          />
        </div>

        {/* Form UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="space-card p-8 rounded-2xl backdrop-blur-md flex flex-col justify-center">
            <div className="mb-8 text-white space-y-1">
              <h1 className="text-3xl font-bold">Forgot Password</h1>
              <p className="text-sm text-white">Reset your password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm text-white">
                  Email
                </label>
                <div className="relative flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-jobwise-dark/50 border-purple-800/30 text-white placeholder:text-white/40 py-6 pl-10 w-96"
                    />
                  <Button 
                    type="button" 
                    onClick={fetchSecurityQuestion}
                    className="auth-btn primary-btn bg-purple-600 hover:bg-purple-700 text-white py-6"
                  >
                    Get Question
                  </Button>
                </div>
              </div>

              {showSecurityQuestion && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm text-white">
                      Security Question
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={securityQuestion}
                        readOnly
                        className="bg-jobwise-dark/50 border-purple-800/30 text-white placeholder:text-white/40 py-6 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="securityAnswer" className="text-sm text-white">
                      Your Answer
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
                </>
              )}

              {showSecurityQuestion && (
                <div className="space-y-1">
                  <label htmlFor="newPassword" className="text-sm text-white">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="bg-jobwise-dark/50 border-purple-800/30 text-white placeholder:text-white/40 py-6 pl-10"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="auth-btn primary-btn bg-purple-600 hover:bg-purple-700 text-white w-full py-6"
              >
                Reset Password
              </Button>

              <div className="text-center text-white mt-6">
                <p>
                  Remembered your password?{" "}
                  <Link
                    to="/login"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
