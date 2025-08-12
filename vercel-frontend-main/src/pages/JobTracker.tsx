
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Send, 
  MessageSquare, 
  BadgeCheck, 
  XCircle 
} from "lucide-react";
import { useJobs, JobStatus } from "@/contexts/JobContext";

const JobTracker = () => {
  const { getJobsByStatus } = useJobs();

  const trackerCategories = [
    {
      id: "applied",
      title: "Applied",
      description: "Jobs you've applied for",
      icon: Send,
      color: "from-blue-400 to-blue-600",
      path: "/job-tracker/applied",
      count: getJobsByStatus("applied").length,
    },
    {
      id: "interview",
      title: "Interview",
      description: "Jobs with scheduled interviews",
      icon: MessageSquare,
      color: "from-amber-400 to-amber-600",
      path: "/job-tracker/interview",
      count: getJobsByStatus("interview").length,
    },
    {
      id: "offered",
      title: "Offered",
      description: "Jobs with offers received",
      icon: BadgeCheck,
      color: "from-green-400 to-green-600",
      path: "/job-tracker/offered",
      count: getJobsByStatus("offered").length,
    },
    {
      id: "rejected",
      title: "Rejected",
      description: "Jobs that didn't work out",
      icon: XCircle,
      color: "from-red-400 to-red-600",
      path: "/job-tracker/rejected",
      count: getJobsByStatus("rejected").length,
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-jobwise-dark">Job Tracker</h1>
        <p className="text-gray-600">
          Track and manage all your job applications in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trackerCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl overflow-hidden shadow-lg h-60"
          >
            <Link 
              to={category.path} 
              className={`h-full w-full flex flex-col justify-between p-6 bg-gradient-to-br ${category.color} text-white`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                  <div className="bg-white/20 text-white px-2 py-1 rounded-full text-sm inline-block mt-1">
                    {category.count} job{category.count !== 1 ? 's' : ''}
                  </div>
                </div>
                <category.icon className="h-10 w-10 opacity-90" />
              </div>
              <div>
                <p className="text-white/90 mb-4">{category.description}</p>
                <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium">
                  View all
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobTracker;
