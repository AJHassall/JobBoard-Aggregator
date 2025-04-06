
using System.ComponentModel.DataAnnotations;

namespace JobBoardAggregator.Models
{
    public class Article
    {
        [Key]
        public int Id {get; private set;}
        public required string Text { get; set; }

    }
}