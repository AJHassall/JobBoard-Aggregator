using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using JobBoardAggregator.Models;
using WebCrawler.Repositories;
using Microsoft.Extensions.DependencyInjection; // Add this using statement

public class JobScraperWorker : BackgroundService
{
    private readonly ILogger<JobScraperWorker> _logger;
    private readonly string _rapidApiKey = "";
    private readonly IServiceScopeFactory _scopeFactory;

    public JobScraperWorker(ILogger<JobScraperWorker> logger, IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ScrapeAndStoreJobs(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during job scraping.");
            }

            await Task.Delay(TimeSpan.FromMinutes(60), stoppingToken);
        }
    }

    private async Task ScrapeAndStoreJobs(CancellationToken stoppingToken) // Pass cancellation token
    {
        using (var scope = _scopeFactory.CreateScope()) // Create scope
        {
            var jobRepository = scope.ServiceProvider.GetRequiredService<IJobRepository>(); // Resolve repository

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

                using (var response = await client.SendAsync(request, stoppingToken)) // Pass cancellation token
                {
                    response.EnsureSuccessStatusCode();
                    var body = await response.Content.ReadAsStringAsync();
                    var jobs = JsonConvert.DeserializeObject<List<Job>>(body);

                    if (jobs != null)
                    {
                        foreach (var job in jobs)
                        {
                            job.DateAdded = DateTime.UtcNow;
                            await jobRepository.AddJobsAsync(job); // Use repository from scope
                        }
                        _logger.LogInformation($"{jobs.Count} jobs added to database");
                    }
                    else
                    {
                        _logger.LogInformation("No jobs found");
                    }
                }
            }
        }
    }
}