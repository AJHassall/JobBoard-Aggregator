using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobBoardAggregator.Models;
using Microsoft.EntityFrameworkCore;

namespace WebCrawler.Repositories
{
    public class JobRepository : IJobRepository
    {
        private readonly JobDbContext _dbContext;

        public JobRepository(JobDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddJobsAsync(Job job)
        {
            await _dbContext.Jobs.AddAsync(job);
            await _dbContext.SaveChangesAsync();

        }
    }
}