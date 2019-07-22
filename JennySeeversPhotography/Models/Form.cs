using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JennySeeversPhotography.Models
{
    public class Form
    {
        [Key]
        public int ResponseID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ProjectType { get; set; }
        public DateTime When { get; set; }
    }
}
