using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JennySeeversPhotography.Models
{
    public class Photo
    {
        [Key]
        public int PicID { get; set; }
        public string Title { get; set; }
        public bool IsFeatured { get; set; }
        public int PhotoProjID { get; set; }
        public string PhotoURL { get; set; }
        public string Location { get; set; }
    }
}
