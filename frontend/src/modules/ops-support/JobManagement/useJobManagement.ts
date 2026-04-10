
import { useState, useMemo } from 'react';
import { MOCK_JOBS, Job } from './mockData';

export const useJobManagement = () => {
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [selectedJobId, setSelectedJobId] = useState<string>(MOCK_JOBS[0]?.id || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => 
            job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [jobs, searchQuery]);

    const selectedJob = useMemo(() => {
        return jobs.find(job => job.id === selectedJobId) || null;
    }, [jobs, selectedJobId]);

    const stats = useMemo(() => {
        const total = jobs.length;
        const running = jobs.filter(j => j.status === 'RUNNING').length;
        const failed = jobs.filter(j => j.status === 'FAILED').length;
        const successRate = 98.5; // From design
        return { total, running, failed, successRate };
    }, [jobs]);

    const runJob = (id: string) => {
        setJobs(prev => prev.map(job => 
            job.id === id ? { ...job, status: 'RUNNING', lastRun: 'Vừa xong', progress: 0 } : job
        ));
    };

    const stopJob = (id: string) => {
        setJobs(prev => prev.map(job => 
            job.id === id ? { ...job, status: 'IDLE', progress: undefined } : job
        ));
    };

    return {
        jobs,
        filteredJobs,
        selectedJob,
        selectedJobId,
        setSelectedJobId,
        searchQuery,
        setSearchQuery,
        stats,
        runJob,
        stopJob,
        isLogDrawerOpen,
        setIsLogDrawerOpen
    };
};
