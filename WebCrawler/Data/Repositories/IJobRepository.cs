using JobBoardAggregator.Models;
using Microsoft.EntityFrameworkCore;

namespace WebCrawler.Repositories
{
    
    public interface IJobRepository
    {
        Task AddJobsAsync(Job jobs);
    }
}