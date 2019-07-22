using System;
using System.Collections.Generic;
using System.Text;
using JennySeeversPhotography.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace JennySeeversPhotography.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public DbSet<Project> Projects { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Form> Forms { get; set; }
        public DbSet<ProjType> ProjTypes { get; set; }
        public IEnumerable<object> Project { get; internal set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
