using JobBoardAggregator.Models;
using Microsoft.EntityFrameworkCore;

namespace WebCrawler.Repositories
{
    public interface IJobRepository
    {
        Task<Job> AddJobAsync(Job job);
        Task<IEnumerable<Job>> AddJobsAsync(IEnumerable<Job> jobs); 
        Task DeleteJobAsync(int id);
        Task<IEnumerable<Job>> GetAllJobsAsync();
        Task<Job> GetJobByIdAsync(int id);
        Task<Job> UpdateJobAsync(Job job);
    }
}