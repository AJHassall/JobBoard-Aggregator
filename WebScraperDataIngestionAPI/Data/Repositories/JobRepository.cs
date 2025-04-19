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

        public async Task<Job> AddJobAsync(Job job)
        {
            var _job = await _dbContext.Jobs.AddAsync(job);
            await _dbContext.SaveChangesAsync();

            return _job.Entity;
        }
        public async Task<IEnumerable<Job>> AddJobsAsync(IEnumerable<Job> jobs)
        {
            var trackedJobEntries = new List<Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<Job>>();

            foreach (var job in jobs)
            {
                var trackedEntry = await _dbContext.Jobs.AddAsync(job);
                trackedJobEntries.Add(trackedEntry);
            }

            await _dbContext.SaveChangesAsync();

            // Return the tracked entities
            return trackedJobEntries.Select(entry => entry.Entity).ToList();
        }

        public async Task DeleteJobAsync(int id)
        {
            var jobToDelete = await _dbContext.Jobs.FindAsync(id);
            if (jobToDelete != null)
            {
                _dbContext.Jobs.Remove(jobToDelete);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Job>> GetAllJobsAsync()
        {
            return await _dbContext.Jobs.ToListAsync();
        }


        public async Task<Job> UpdateJobAsync(Job job)
        {
            var existingJob = await _dbContext.Jobs.FindAsync(job.Id);
            if (existingJob == null) return null;

            existingJob.Title = job.Title;
            existingJob.Description = job.Description;

            await _dbContext.SaveChangesAsync();
            return existingJob;
        }

        public async Task<Job> GetJobByIdAsync(int id)
        {
            return await _dbContext.Jobs.FindAsync(id);
        }
    }
}
