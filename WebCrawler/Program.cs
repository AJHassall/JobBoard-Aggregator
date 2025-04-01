using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WebCrawler;
using WebCrawler.Repositories;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddDbContext<JobDbContext>(options =>
    options.UseInMemoryDatabase("ContactManagementDb")
);

// Add Repository
builder.Services.AddScoped<IJobRepository, JobRepository>();

builder.Services.AddHostedService<JobScraperWorker>();

var host = builder.Build();
host.Run();
