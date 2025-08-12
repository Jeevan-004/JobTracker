import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { useJobs, JobStatus, Job } from "@/contexts/JobContext";

const JOB_TYPE_OPTIONS = ["Internship", "Full-Time", "IT + FT", "IT + PBC"];

const JobStatusPage = () => {
  const { status } = useParams<{ status: string }>();
  const navigate = useNavigate();
  const { getJobsByStatus, addJob, updateJob, deleteJob } = useJobs();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    pay: "",
    dateApplied: new Date().toISOString().split('T')[0],
    interviewDate: "",
    jobType: "" as "Internship" | "Full-Time" | "IT + FT" | "IT + PBC" | "",
    status: (status || "applied") as JobStatus,
    mode: "on-campus" as "on-campus" | "off-campus",
    notes: "",
  });

  if (!status || !["applied", "interview", "offered", "rejected"].includes(status)) {
    navigate("/job-tracker");
    return null;
  }

  const validStatus = status as JobStatus;
  const jobs = getJobsByStatus(validStatus);
  const statusTitle = {
    applied: "Applied Jobs",
    interview: "Interview Stage",    
    offered: "Job Offers",
    rejected: "Rejected Applications",
  }[validStatus] || "Jobs";

  const handleOpenDialog = () => {
    setFormData({
      company: "",
      role: "",
      pay: "",
      dateApplied: new Date().toISOString().split('T')[0],
      interviewDate: "",
      jobType: "" as "Internship" | "Full-Time" | "IT + FT" | "IT + PBC" | "",
      status: validStatus,
      mode: "on-campus",
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setFormData({
      company: job.company,
      role: job.role,
      pay: job.pay,
      dateApplied: job.dateApplied.split('T')[0],
      interviewDate: job.interviewDate ? job.interviewDate.split('T')[0] : "",
      jobType: job.jobType || "" as "Internship" | "Full-Time" | "IT + FT" | "IT + PBC" | "",
      status: job.status,
      mode: job.mode,
      notes: job.notes,
    });
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value as JobStatus });
  };

  const handleModeChange = (value: string) => {
    setFormData({ ...formData, mode: value as "on-campus" | "off-campus" });
  };

  const handleJobTypeChange = (value: string) => {
    setFormData({ ...formData, jobType: value as "Internship" | "Full-Time" | "IT + FT" | "IT + PBC" | "" });
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addJob({
        ...formData,
        interviewDate: formData.interviewDate || undefined,
        jobType: formData.jobType || undefined,
        mode: formData.mode
      });
      setIsDialogOpen(false);
    } catch (error) {
      // Error is already handled in the context
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJob) {
      setIsLoading(true);
      try {
        const updatedJob = {
          ...formData,
          _id: selectedJob._id,
          interviewDate: formData.interviewDate || undefined,
          jobType: formData.jobType || undefined,
          mode: formData.mode
        };
        await updateJob(updatedJob);        
        // If status changed, navigate to the new status page
        if (formData.status !== status) {
          navigate(`/job-tracker/${formData.status}`);
        }
        setIsEditDialogOpen(false);
      } catch (error) {
        // Error is already handled in the context
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteJob = async () => {
    if (selectedJob) {
      setIsLoading(true);
      try {
        await deleteJob(selectedJob._id);
        setIsEditDialogOpen(false);
      } catch (error) {
        // Error is already handled in the context
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getBgGradient = () => {
    switch (status) {
      case "applied": return "from-blue-400/10 to-blue-500/5";
      case "interview": return "from-amber-400/10 to-amber-500/5";
      case "offered": return "from-green-400/10 to-green-500/5";
      case "rejected": return "from-red-400/10 to-red-500/5";
      default: return "from-blue-400/10 to-blue-500/5";
    }
  };

  return (
    <div className={`container mx-auto max-w-6xl px-4 py-8 bg-gradient-to-br ${getBgGradient()} rounded-3xl`}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-jobwise-dark">{statusTitle}</h1>
          <p className="text-gray-600">
            Manage jobs in the {status} stage
          </p>
        </div>
        <Button 
          onClick={handleOpenDialog}
          className={`bg-${status === "applied" ? "blue" : status === "interview" ? "amber" : status === "offered" ? "green" : "red"}-500 hover:bg-${status === "applied" ? "blue" : status === "interview" ? "amber" : status === "offered" ? "green" : "red"}-600`}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600 mb-4">No jobs in this category yet</h3>
          <Button onClick={handleOpenDialog}>Add Your First Job</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 overflow-x-auto">
          {jobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="min-w-[300px]"
            >
              <Card 
                className="h-full overflow-hidden glass-card hover:shadow-xl transition-all cursor-pointer"
                onClick={() => handleEditJob(job)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-jobwise-dark line-clamp-1">{job.company}</h3>
                      <p className="text-jobwise-medium font-medium">{job.role}</p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 flex-grow">
                      <p><span className="font-medium">Salary:</span> {job.pay}</p>
                      <p><span className="font-medium">Applied:</span> {new Date(job.dateApplied).toLocaleDateString()}</p>
                      {job.jobType && <p><span className="font-medium">Type:</span> {job.jobType}</p>}
                      {job.interviewDate && (
                        <p><span className="font-medium">Interview:</span> {new Date(job.interviewDate).toLocaleDateString()}</p>
                      )}
                      <p><span className="font-medium">Mode:</span> {job.mode}</p>
                      {job.notes && (
                        <p className="line-clamp-2"><span className="font-medium">Notes:</span> {job.notes}</p>
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-jobwise-medium hover:text-jobwise-dark hover:bg-jobwise-light/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditJob(job);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* --- ADD JOB DIALOG --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Job</DialogTitle>
            <DialogDescription>
              Enter the details of the job you've applied for.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[53vh] scrollbar-thin px-1 mb-4">
          <form onSubmit={handleAddJob} className="space-y-2">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company name"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Job title"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pay">Salary Range</Label>
                <Input
                  id="pay"
                  name="pay"
                  value={formData.pay}
                  onChange={handleInputChange}
                  placeholder="e.g. $80,000 - $100,000"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateApplied">Date Applied</Label>
                <Input
                  id="dateApplied"
                  name="dateApplied"
                  type="date"
                  value={formData.dateApplied}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* INTERVIEW DATE FIELD - OPTIONAL */}
              <div className="grid gap-2">
                <Label htmlFor="interviewDate">Interview Date (Optional)</Label>
                <Input
                  id="interviewDate"
                  name="interviewDate"
                  type="date"
                  value={formData.interviewDate}
                  onChange={handleInputChange}
                  placeholder="Select interview date"
                  disabled={isLoading}
                />
              </div>
              
              {/* JOB TYPE FIELD */}
              <div className="grid gap-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select 
                  value={formData.jobType}
                  onValueChange={handleJobTypeChange}
                  disabled={isLoading}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mode">Application Mode</Label>
                <Select 
                  value={formData.mode} 
                  onValueChange={handleModeChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-campus">On Campus</SelectItem>
                    <SelectItem value="off-campus">Off Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={handleStatusChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offered">Offered</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes"
                  disabled={isLoading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Job"}
              </Button>
            </DialogFooter>
          </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- EDIT JOB DIALOG --- */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update the job details.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[53vh] scrollbar-thin px-1 mb-4">
          <form onSubmit={handleUpdateJob} className="space-y-2">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company name"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Job title"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pay">Salary Range</Label>
                <Input
                  id="pay"
                  name="pay"
                  value={formData.pay}
                  onChange={handleInputChange}
                  placeholder="e.g. $80,000 - $100,000"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateApplied">Date Applied</Label>
                <Input
                  id="dateApplied"
                  name="dateApplied"
                  type="date"
                  value={formData.dateApplied}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* INTERVIEW DATE FIELD - OPTIONAL */}
              <div className="grid gap-2">
                <Label htmlFor="interviewDate">Interview Date (Optional)</Label>
                <Input
                  id="interviewDate"
                  name="interviewDate"
                  type="date"
                  value={formData.interviewDate}
                  onChange={handleInputChange}
                  placeholder="Select interview date"
                  disabled={isLoading}
                />
              </div>
              
              {/* JOB TYPE FIELD */}
              <div className="grid gap-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select 
                  value={formData.jobType}
                  onValueChange={handleJobTypeChange}
                  disabled={isLoading}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mode">Application Mode</Label>
                <Select 
                  value={formData.mode} 
                  onValueChange={handleModeChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-campus">On Campus</SelectItem>
                    <SelectItem value="off-campus">Off Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={handleStatusChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offered">Offered</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes"
                  disabled={isLoading}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDeleteJob}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobStatusPage;
