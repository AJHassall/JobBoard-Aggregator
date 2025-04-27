
using System.ComponentModel.DataAnnotations;

namespace JobBoardAggregator.Models
{
    public class Job
    {
        [Key]
        public int Id {get; private set;}
        public required string Title { get; set; }
        public int CompanyId { get; set; }
        public required Company Company {get; set;}
        public required string Location { get; set; }
        public required string Description { get; set; }
        public required string Url { get; set; }
        public required bool IsEasyApply { get; set; }
        public DateTime DateAdded { get; internal set; }

        public Job(){
            DateAdded = DateTime.Now;
        }
    }
}
