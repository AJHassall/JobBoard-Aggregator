using JobBoardAggregator.Models;
using Microsoft.AspNetCore.Mvc;
using WebScraperDataIngestionAPI;
using WebScraperDataIngestionAPI.Repositories;

namespace WebScraperDataIngestionAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class JobController : ControllerBase
    {
        private readonly IJobRepository _jobRepository;

        public JobController(IJobRepository jobRepository)
        {
            _jobRepository = jobRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobs()
        {
            var jobs = await _jobRepository.GetAllJobsAsync();
            return Ok(jobs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Job>> GetJob(int id)
        {
            var job = await _jobRepository.GetJobByIdAsync(id);
            if (job == null)
            {
                return NotFound();
            }
            return Ok(job);
        }

        [HttpPost]
        public async Task<ActionResult<Job>> PostJob(Job job)
        {
            await _jobRepository.AddJobAsync(job);
            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutJob(int id, Job job)
        {
            if (id != job.Id)
            {
                return BadRequest();
            }

            var existingJob = await _jobRepository.GetJobByIdAsync(id);
            if (existingJob == null)
            {
                return NotFound();
            }

            await _jobRepository.UpdateJobAsync(job);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _jobRepository.GetJobByIdAsync(id);
            if (job == null)
            {
                return NotFound();
            }

            await _jobRepository.DeleteJobAsync(id);
            return NoContent();
        }
    }
}
