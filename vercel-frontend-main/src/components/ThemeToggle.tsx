
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  
  // Since we're only using dark mode, we'll make this a dummy component
  // that just displays the sun icon without any toggle functionality

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={`${className || 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}
      aria-label="Theme indicator"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-5 h-5 flex items-center justify-center"
      >
        <Sun className="h-4 w-4" />
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;
