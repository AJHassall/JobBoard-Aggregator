
import { useEffect, useState } from 'react'
import './App.css'
import { Job } from './models/models';
import { GetJobs } from './api/JobApi';

function App() {
  
  const [jobs, setJobData] = useState<Job[] | null>(null);

  useEffect(() => {
    const fetchJobData = async () => {
// Reset error state on each fetch

      try {
        const data = await GetJobs();
        if (data) {
          setJobData(data);
        }
      } catch (err) {
        console.error('Error fetching job data:', err);
      }
    };

    fetchJobData();
  }, []);

  return (
    <>
        <div className='container'>
          <div className='job-list'>
              <ul>
                  {jobs?.map(job => (
                    <li key={job?.Id}>
                      <p>{job?.Title}</p>
                      <p>{job?.IsEasyApply? "easy apply": "not easy apply"}</p>
                      <p> {job?.Company?.Name?? ""} </p>
                    </li>
                  ))}
              </ul>
          </div>
          <div className='job-view'>
            a
          </div>  
        </div>
    </>
  )
}

export default App
