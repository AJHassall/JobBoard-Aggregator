using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebScraperDataIngestionAPI;
using WebScraperDataIngestionAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

string connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");

if (string.IsNullOrEmpty(connectionString))
{
    // Handle the case where the connection string is missing (e.g., log an error, use a default)
    Console.WriteLine("Warning: DATABASE_CONNECTION_STRING is not set.");
}

builder.Services.AddDbContext<JobDbContext>(options =>
    options.UseNpgsql(connectionString));
// Add Repository
builder.Services.AddScoped<IJobRepository, JobRepository>();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers(); 

app.Run();
