using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobBoardAggregator.Models;
using Microsoft.EntityFrameworkCore;

namespace WebScraperDataIngestionAPI.Repositories
{
    public class JobRepository : IJobRepository
    {
        private readonly JobDbContext _dbContext;

        public JobRepository(JobDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<Job> AddJobAsync(Job job)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Job>> AddJobsAsync(IEnumerable<Job> jobs)
        {
            throw new NotImplementedException();
        }

        public Task DeleteJobAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Job>> GetAllJobsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Job> GetJobByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Job> UpdateJobAsync(Job job)
        {
            throw new NotImplementedException();
        }

    }
}
