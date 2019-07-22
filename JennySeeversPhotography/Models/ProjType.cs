using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JennySeeversPhotography.Models
{
    public class ProjType
    {
        [Key]
        public int TypeID { get; set; }
        public string TypeName { get; set; }
        public List<Project> ProjectsOfType { get; set; }
    }
}
