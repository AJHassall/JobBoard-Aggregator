using JobBoardAggregator.Models;

namespace WebCrawler.Repositories
{
    public interface IJobRepository
    {
        Task AddJobsAsync(List<Job> jobs);
    }
}