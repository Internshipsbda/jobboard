import React, { useState } from 'react';
import JobBoard from './components/JobBoard';
import JobDetail from './components/JobDetail';
import CompanyForm from './components/CompanyForm';
import { Job } from './types/Job';
import { initialJobs } from './data/mockJobs';

function App() {
  const [currentPage, setCurrentPage] = useState<'board' | 'detail' | 'form'>('board');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setCurrentPage('detail');
  };

  const handleBackToBoard = () => {
    setCurrentPage('board');
    setSelectedJob(null);
  };

  const handleAddJob = (newJob: Omit<Job, 'id'>) => {
    const job: Job = {
      ...newJob,
      id: Math.max(...jobs.map(j => j.id)) + 1,
    };
    setJobs([...jobs, job]);
    setCurrentPage('board');
  };

  const handleShowForm = () => {
    setCurrentPage('form');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'board' && (
        <JobBoard 
          jobs={jobs} 
          onJobClick={handleJobClick}
          onShowForm={handleShowForm}
        />
      )}
      {currentPage === 'detail' && selectedJob && (
        <JobDetail 
          job={selectedJob} 
          onBack={handleBackToBoard}
        />
      )}
      {currentPage === 'form' && (
        <CompanyForm 
          onSubmit={handleAddJob}
          onBack={handleBackToBoard}
        />
      )}
    </div>
  );
}

export default App;