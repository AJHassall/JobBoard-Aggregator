using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using WebScraperDataIngestionAPI;
using WebScraperDataIngestionAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

string? POSTGRES_HOST = Environment.GetEnvironmentVariable("POSTGRES_HOST")?? builder.Configuration.GetSection("Database")["POSTGRES_HOST"];
string? POSTGRES_PASSWORD = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD")?? builder.Configuration.GetSection("Database")["POSTGRES_PASSWORD"];
string? POSTGRES_DB = Environment.GetEnvironmentVariable("POSTGRES_DB")?? builder.Configuration.GetSection("Database")["POSTGRES_DB"];
string? POSTGRES_USER = Environment.GetEnvironmentVariable("POSTGRES_USER")?? builder.Configuration.GetSection("Database")["POSTGRES_USER"];


var sb = new NpgsqlConnectionStringBuilder();
sb.Host = POSTGRES_HOST;
sb.Database = POSTGRES_DB;
sb.Username= POSTGRES_USER;
sb.Password = POSTGRES_PASSWORD;
string connectionString = sb.ConnectionString;

Console.WriteLine(connectionString);

builder.Services.AddDbContext<JobDbContext>(options =>
    options.UseNpgsql(connectionString));
// Add Repository
builder.Services.AddScoped<IJobRepository, JobRepository>();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



//builder.Services.AddHostedService<HourlyMessageSender>();
builder.Services.AddHostedService<SixHourMessageSender>();



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
