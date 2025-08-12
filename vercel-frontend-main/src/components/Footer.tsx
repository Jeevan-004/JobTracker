
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 md:py-8 bg-jobwise-dark/70 backdrop-blur-md border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-jobwise-light"></div>
              <span className="text-xl font-bold text-white">JobWise</span>
            </div>
            <p className="text-white text-sm md:text-base">
              The intelligent job application tracker that helps you land your dream job faster.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-3 text-sm md:text-base">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-white/90 hover:text-white transition-colors">Home</Link></li>
              <li><a href="/#features" className="text-white/90 hover:text-white transition-colors">Features</a></li>
              <li><a href="/#about" className="text-white/90 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-3 text-sm md:text-base">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white/90 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-white/90 hover:text-white transition-colors">Career Tips</a></li>
              <li><a href="#" className="text-white/90 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h3 className="text-white font-semibold mb-3 text-sm md:text-base">Connect</h3>
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter" className="text-white/90 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-white/90 hover:text-white">
                <Linkedin size={20} />
              </a>
              <a href="#" aria-label="GitHub" className="text-white/90 hover:text-white">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10 text-center text-white/90 text-sm">
          <p>© {currentYear} JobWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
