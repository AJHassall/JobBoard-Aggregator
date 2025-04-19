using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebScraperDataIngestionAPI;
using WebScraperDataIngestionAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);


string connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");

Console.WriteLine(connectionString);

if (string.IsNullOrEmpty(connectionString))
{
    string? POSTGRES_HOST = builder.Configuration.GetSection("Database")["POSTGRES_HOST"];
    string? POSTGRES_PASSWORD = builder.Configuration.GetSection("Database")["POSTGRES_PASSWORD"];
    string? POSTGRES_DB = builder.Configuration.GetSection("Database")["POSTGRES_DB"];
    string? POSTGRES_USER = builder.Configuration.GetSection("Database")["POSTGRES_USER"];

    connectionString = $"Host={POSTGRES_HOST};Port={5432};Username={POSTGRES_USER};Password={POSTGRES_PASSWORD};Database={POSTGRES_DB};";

}

builder.Services.AddDbContext<JobDbContext>(options =>
    options.UseNpgsql(connectionString));
// Add Repository
builder.Services.AddScoped<IJobRepository, JobRepository>();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHostedService<HourlyMessageSender>();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<JobDbContext>();
    dbContext.Database.Migrate();
}

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
