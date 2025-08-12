
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle, Award, Clock, BarChart, Target, Mail, MoveDown } from "lucide-react";
import Footer from "@/components/Footer";
import { useRef } from "react";

const Landing = () => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={scrollRef} className="min-h-screen w-full bg-gradient-to-br from-jobwise-dark via-[#292966] to-black text-white overflow-x-hidden">
      {/* Animated 3D Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ y, opacity }}
          className="absolute top-[15%] right-[10%] w-32 h-32 rounded-2xl bg-jobwise-light/30 backdrop-blur-xl transform rotate-12 shadow-xl border border-white/20"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[25%] right-[25%] w-24 h-24 rounded-full bg-jobwise/20 backdrop-blur-xl border border-white/10"
        />
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute top-[40%] right-[15%] w-16 h-16 rounded-md bg-jobwise-medium/40 backdrop-blur-xl transform -rotate-12 border border-white/30"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute top-[35%] right-[30%] w-20 h-20 rounded-full border-4 border-jobwise-light/20 backdrop-blur-xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: [-45, 0, 45, 0, -45] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[50%] right-[20%] w-12 h-12 rounded-sm bg-jobwise-medium/30 backdrop-blur-xl transform"
        />
        
        {/* Add floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/30"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
              className="w-6 h-6 rounded-full bg-jobwise-light"
            />
            <span className="text-xl font-bold">JobWise</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-white hover:text-jobwise-light transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-white hover:text-jobwise-light transition-colors"
            >
              About
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="link" className="text-white hover:text-jobwise-light">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-white text-jobwise-dark hover:bg-jobwise-light hover:text-jobwise-dark rounded-full px-5">
                Try for free
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-12 md:pt-24 pb-24 relative z-10">
        <div className="max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-4 text-white"
          >
            The new
            <span className="block">Job Search AI</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-white mb-8 max-w-2xl"
          >
            A next-generation job search platform that intelligently manages your applications, 
            provides AI-powered resume feedback, and helps you land your dream job.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/signup">
              <Button className="bg-jobwise-medium hover:bg-jobwise text-white rounded-full px-6 py-6">
                Start tracking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-6 py-6">
              <Play className="mr-2 h-4 w-4" />
              Watch demo
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 hidden md:block"
          >
            <button 
              onClick={() => scrollToSection('features')}
              className="flex flex-col items-center text-white/60 hover:text-white transition-colors"
            >
              <span className="text-sm mb-2">Discover more</span>
              <MoveDown className="h-6 w-6 animate-bounce" />
            </button>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Features</h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Streamline your job search process with our comprehensive suite of tools designed to help you succeed.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <CheckCircle className="w-10 h-10 text-jobwise-light" />,
                title: "Application Tracking",
                description: "Keep all your job applications organized in one place with status updates and reminders."
              },
              {
                icon: <Target className="w-10 h-10 text-jobwise-light" />,
                title: "AI Resume Feedback",
                description: "Get personalized feedback to improve your resume and increase your chances of landing interviews."
              },
              {
                icon: <BarChart className="w-10 h-10 text-jobwise-light" />,
                title: "Analytics Dashboard",
                description: "Visualize your application progress with comprehensive analytics and insights."
              },
              {
                icon: <Clock className="w-10 h-10 text-jobwise-light" />,
                title: "JD Analysis",
                description: "Understand key requirements from job descriptions to tailor your applications effectively."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-jobwise-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:transform hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-white">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with 3D Card Effect */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-4xl font-bold mb-6 text-white">About JobWise</h2>
              <p className="text-lg mb-6 text-white">
                JobWise was created by a team of job seekers who were frustrated with the 
                disorganized and opaque nature of the job search process. We built the tool 
                we wished we had when applying for jobs.
              </p>
              <p className="text-lg mb-6 text-white">
                Our mission is to empower job seekers with tools that provide clarity, 
                organization, and insights throughout their job search journey.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-jobwise-light" />
                  <span className="text-white">Trusted by 10,000+ users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-6 w-6 text-jobwise-light" />
                  <span className="text-white">Dedicated support</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-1 lg:order-2"
            >
              <div className="relative perspective-500">
                <motion.div 
                  initial={{ rotateY: 0, rotateX: 0 }}
                  animate={{ 
                    rotateY: [0, 5, 0, -5, 0],
                    rotateX: [0, -5, 0, 5, 0]
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="aspect-video overflow-hidden rounded-2xl shadow-2xl border border-white/20 transform-3d"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Team working together" 
                    className="w-full h-full object-cover brightness-75" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-jobwise-dark/80 to-transparent mix-blend-overlay"></div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="absolute -bottom-6 -right-6 bg-jobwise-medium backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/20 z-10"
                >
                  <p className="text-white font-bold">Built by job seekers, for job seekers</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Not fixed */}
      <Footer />
    </div>
  );
};

export default Landing;
