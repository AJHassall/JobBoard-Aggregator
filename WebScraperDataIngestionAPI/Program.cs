using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebScraperDataIngestionAPI;
using WebScraperDataIngestionAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

string POSTGRES_USER = Environment.GetEnvironmentVariable("POSTGRES_USER");
if (string.IsNullOrEmpty(POSTGRES_USER))
{
    POSTGRES_USER = builder.Configuration.GetSection("Database")["POSTGRES_USER"];
    Console.WriteLine(POSTGRES_USER);

}

string POSTGRES_PASSWORD = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
if (string.IsNullOrEmpty(POSTGRES_PASSWORD))
{
    POSTGRES_PASSWORD = POSTGRES_USER = builder.Configuration.GetSection("Database")["POSTGRES_PASSWORD"];
    Console.WriteLine(POSTGRES_PASSWORD);


}

string POSTGRES_DB = Environment.GetEnvironmentVariable("POSTGRES_DB");
if (string.IsNullOrEmpty(POSTGRES_DB))
{
    POSTGRES_DB = POSTGRES_USER = builder.Configuration.GetSection("Database")["POSTGRES_DB"];
    Console.WriteLine(POSTGRES_DB);

}

string POSTGRES_HOST = Environment.GetEnvironmentVariable("POSTGRES_HOST");
if (string.IsNullOrEmpty(POSTGRES_HOST))
{
    POSTGRES_HOST = POSTGRES_USER = builder.Configuration.GetSection("Database")["POSTGRES_HOST"];
    Console.WriteLine(POSTGRES_HOST);

}
string connectionString = $"Host={POSTGRES_HOST};Port={5432};Username={POSTGRES_USER};Password={POSTGRES_PASSWORD};Database={POSTGRES_DB};";


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
