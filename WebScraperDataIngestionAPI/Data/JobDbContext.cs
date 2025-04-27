using JobBoardAggregator.Models;
using Microsoft.EntityFrameworkCore;

public class JobDbContext : DbContext
{
    public JobDbContext(DbContextOptions<JobDbContext> options) : base(options) { }
    public DbSet<Job> Jobs { get; set; }
     public DbSet<Company> Companies { get; set; }

}