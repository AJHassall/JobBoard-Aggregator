using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebScraperDataIngestionAPI;
using WebScraperDataIngestionAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<JobDbContext>(options =>
    options.UseInMemoryDatabase("ContactManagementDb"));

// Add Repository
builder.Services.AddScoped<IJobRepository, JobRepository>();

builder.Services.AddControllers(); // Add controllers

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

app.UseAuthorization(); // If you use auth.

app.MapControllers(); // Map controllers

app.Run();
