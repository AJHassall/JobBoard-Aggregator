
using System.ComponentModel.DataAnnotations;

namespace JobBoardAggregator.Models
{
    public class Company{
        [Key]
        public int Id {get; private set;}
        public required string Name {get; set;}

    }
}