using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WebCrawler;
using WebCrawler.Repositories;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();

// Add Repository
builder.Services.AddScoped<IJobRepository, JobRepository>();

var host = builder.Build();
host.Run();
