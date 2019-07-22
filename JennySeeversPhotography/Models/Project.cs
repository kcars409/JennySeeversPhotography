using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JennySeeversPhotography.Models
{
    public class Project
    {
        [Key]
        public int ProjID { get; set; }
        public string ProjName { get; set; }
        public int ProjTypeID { get; set; }
        public List<Photo> ProjPhotos { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
