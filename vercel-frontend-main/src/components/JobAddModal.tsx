import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useJobs, JobStatus } from "@/contexts/JobContext";
import { useNavigate } from "react-router-dom";

interface JobAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JobAddModal = ({ isOpen, onClose }: JobAddModalProps) => {
  const { addJob } = useJobs();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [pay, setPay] = useState("");
  const [dateApplied, setDateApplied] = useState(new Date().toISOString().split("T")[0]);
  const [interviewDate, setInterviewDate] = useState("");
  const [jobType, setJobType] = useState<"Internship" | "Full-Time" | "IT + FT" | "IT + PBC" | "">("");
  const [status, setStatus] = useState<JobStatus>("applied");
  const [mode, setMode] = useState<"on-campus" | "off-campus">("on-campus");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addJob({
      company,
      role,
      pay,
      dateApplied,
      interviewDate: interviewDate || undefined,
      jobType: jobType || undefined,
      status,
      mode,
      notes
    });
    
    // Reset form
    setCompany("");
    setRole("");
    setPay("");
    setDateApplied(new Date().toISOString().split("T")[0]);
    setInterviewDate("");
    setJobType("");
    setStatus("applied");
    setMode("on-campus");
    setNotes("");
    
    // Close modal
    onClose();
    
    // Navigate to the appropriate status page
    navigate(`/job-tracker/${status}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-lg glass dark:bg-jobwise-dark/90"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-jobwise-dark dark:text-white">
            Add New Job Application
          </DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Fill in the details of your job application
          </DialogDescription>
        </DialogHeader>
        
        {/* Make only the form fields scroll */}
        <div className="overflow-y-auto max-h-[53vh] scrollbar-thin px-1 mb-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="company" className="dark:text-white">Company</Label>
              <Input 
                id="company" 
                placeholder="Company name" 
                value={company}
                onChange={e => setCompany(e.target.value)}
                required
                className="dark:bg-jobwise-dark/70 dark:border-jobwise-medium/30 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="role" className="dark:text-white">Role</Label>
              <Input 
                id="role" 
                placeholder="Job title/position" 
                value={role}
                onChange={e => setRole(e.target.value)}
                required
                className="dark:bg-jobwise-dark/70 dark:border-jobwise-medium/30 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pay" className="dark:text-white">Compensation</Label>
              <Input 
                id="pay" 
                placeholder="Salary or hourly rate" 
                value={pay}
                onChange={e => setPay(e.target.value)}
                className="dark:bg-jobwise-dark/70 dark:border-jobwise-medium/30 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="date" className="dark:text-white">Date Applied</Label>
              <Input 
                id="date" 
                type="date" 
                value={dateApplied}
                onChange={e => setDateApplied(e.target.value)}
                required
                className="dark:bg-jobwise-dark/70 dark:border-jobwise-medium/30 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="interviewDate" className="dark:text-white">Interview Date</Label>
              <Input 
                id="interviewDate" 
                type="date" 
                value={interviewDate}
                onChange={e => setInterviewDate(e.target.value)}
                className="dark:bg-jobwise-dark/70 dark:border-jobwise-medium/30 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="jobType" className="dark:text-white">Job Type</Label>
              <Select 
                value={jobType} 
                onValueChange={value => setJobType(value as "Internship" | "Full-Time" | "IT + FT" | "IT + PBC" | "")}
              >
                <SelectTrigger className="dark:bg-jobwise-dark/70 dark:border-jobwise-medium/30 dark:text-white">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-jobwise-dark dark:border-jobwise-medium/30">
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                  <SelectItem value="IT + FT">IT + FT</SelectItem>
                  <SelectItem value="IT + PBC">IT + PBC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="status" className="dark:text-white">Status</Label>
              <Select 
                value={status} 
                onValueChange={value => setStatus(value as JobStatus)}
              >
                <SelectTrigger className="dark:bg-jobwise-dark/70 dark:border-jobwise-medium/30 dark:text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-jobwise-dark dark:border-jobwise-medium/30">
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offered">Offered</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="mode" className="dark:text-white">Application Mode</Label>
              <Select 
                value={mode} 
                onValueChange={value => setMode(value as "on-campus" | "off-campus")}
              >
                <SelectTrigger className="dark:bg-jobwise-dark/70 dark:border-jobwise-medium/30 dark:text-white">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="dark:bg-jobwise-dark dark:border-jobwise-medium/30">
                  <SelectItem value="on-campus">On-Campus</SelectItem>
                  <SelectItem value="off-campus">Off-Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="notes" className="dark:text-white">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Additional notes about the application" 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="dark:bg-jobwise-dark/70 dark:border-jobwise-medium/30 dark:text-white"
              />
            </div>
          </form>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="dark:border-jobwise-medium/50 dark:text-white dark:hover:bg-jobwise-dark"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            className="bg-jobwise-medium hover:bg-jobwise-dark dark:bg-jobwise-dark dark:hover:bg-jobwise-medium"
          >
            Add Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobAddModal;
