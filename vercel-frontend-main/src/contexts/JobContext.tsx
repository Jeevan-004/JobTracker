import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";

export type JobStatus = "applied" | "interview" | "offered" | "rejected";

export interface Job {
  _id: string;
  company: string;
  role: string;
  pay: string;
  dateApplied: string;
  interviewDate?: string;
  jobType?: "Internship" | "Full-Time" | "IT + FT" | "IT + PBC";
  status: JobStatus;
  mode: "on-campus" | "off-campus";
  notes: string;
}

interface JobContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, "_id">) => Promise<void>;
  updateJob: (job: Job) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  getJobsByStatus: (status: JobStatus) => Job[];
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  // Load jobs from API on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
        toast.error("Failed to load jobs");
      }
    };

    fetchJobs();
  }, []);

  // Add a new job
  const addJob = async (jobData: Omit<Job, "_id">) => {
    try {
      const response = await api.post("/api/jobs", jobData);
      setJobs((prevJobs) => [...prevJobs, response.data]);
      toast.success("Job added successfully!");
    } catch (error) {
      console.error("Failed to add job", error);
      toast.error("Failed to add job");
      throw error;
    }
  };

  // Update an existing job
  const updateJob = async (updatedJob: Job) => {
    try {
      const response = await api.put(`/api/jobs/${updatedJob._id}`, updatedJob);
      setJobs((prevJobs) => 
        prevJobs.map((job) => (job._id === updatedJob._id ? response.data : job))
      );
      toast.success("Job updated successfully!");
    } catch (error) {
      console.error("Failed to update job", error);
      toast.error("Failed to update job");
      throw error;
    }
  };

  // Delete a job
  const deleteJob = async (id: string) => {
    try {
      await api.delete(`/api/jobs/${id}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
      toast.success("Job removed successfully!");
    } catch (error) {
      console.error("Failed to delete job", error);
      toast.error("Failed to delete job");
      throw error;
    }
  };

  // Get jobs by status
  const getJobsByStatus = (status: JobStatus) => {
    return jobs.filter((job) => job.status === status);
  };

  const value = {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    getJobsByStatus,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

