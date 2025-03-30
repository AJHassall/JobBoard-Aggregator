using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data.SqlClient;
using JobBoardAggregator.Models;
using WebCrawler.Repositories;

public class JobRepository : IJobRepository
{
    private readonly JobDbContext _context;

    public JobRepository(JobDbContext context)
    {
        _context = context;
    }

    public async Task AddJobsAsync(List<Job> jobs)
    {
        await _context.Jobs.AddRangeAsync(jobs);
        await _context.SaveChangesAsync();
    }
}

public class JobScraperWorker : BackgroundService
{
    private readonly ILogger<JobScraperWorker> _logger;
    private readonly string _rapidApiKey = "YOUR_RAPIDAPI_KEY"; // Replace!
    private readonly IJobRepository _jobRepository;

    public JobScraperWorker(ILogger<JobScraperWorker> logger, IJobRepository jobRepository)
    {
        _logger = logger;
        _jobRepository = jobRepository;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ScrapeAndStoreJobs();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during job scraping.");
            }

            await Task.Delay(TimeSpan.FromMinutes(60), stoppingToken); // Adjust delay
        }
    }

    private async Task ScrapeAndStoreJobs()
    {
        using (var client = new HttpClient())
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri("https://active-jobs-db.p.rapidapi.com/active-ats-24h?limit=10&offset=0&title_filter=%22Data%20Engineer%22&location_filter=%22United%20Kingdom%22&description_type=text"),
                Headers =
                {
                    { "x-rapidapi-key", _rapidApiKey },
                    { "x-rapidapi-host", "active-jobs-db.p.rapidapi.com" },
                },
            };

            using (var response = await client.SendAsync(request))
            {
                response.EnsureSuccessStatusCode();
                var body = await response.Content.ReadAsStringAsync();
                var jobs = JsonConvert.DeserializeObject<List<Job>>(body);

                if (jobs != null && jobs.Count > 0)
                {
                    jobs.ForEach(j => j.DateAdded = DateTime.UtcNow); //Set the date for each job.
                    await _jobRepository.AddJobsAsync(jobs);
                    _logger.LogInformation($"Added {jobs.Count} jobs to the database.");

                } else {
                    _logger.LogInformation("No jobs found");
                }
            }
        }
    }
}