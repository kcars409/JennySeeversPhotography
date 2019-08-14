using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JennySeeversPhotography.Data;
using JennySeeversPhotography.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace JennySeeversPhotography.Controllers
{
    public class ProjController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ILogger _logger;

        public ProjController(ApplicationDbContext context, ILogger<ProjController> logger,
            UserManager<IdentityUser> userManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }

        [HttpGet("get-projs")]
        public JsonResult GetProjs(int typeID)
        {
            IdentityUser user = Task.Run(async () => { return await _userManager.GetUserAsync(HttpContext.User); }).Result;

            List<Project> projs = _context.Projects
                .Where(p => p.ProjTypeID == typeID)
                .ToList();

            return new JsonResult(projs);
        }
        
        [HttpPost("admin/add-proj")]
        public JsonResult AddProj(int typeID, string name)
        {
            IdentityUser user = Task.Run(async () => { return await _userManager.GetUserAsync(HttpContext.User); }).Result;

            var type = _context.ProjTypes
                .Include(t => t.ProjectsOfType)
                .Where(t => t.TypeID == typeID)
                .First();

            type.ProjectsOfType.Add(new Project
            {
                ProjName = name,
                ProjTypeID = typeID,
                CreatedAt = DateTime.Now
            });

            _context.SaveChanges();

            return new JsonResult(new
            {
                status = true
            });
        }

        [HttpPost("admin/edit-proj")]
        public JsonResult EditProj(int id, string name)
        {
            IdentityUser user = Task.Run(async () => { return await _userManager.GetUserAsync(HttpContext.User); }).Result;

            var proj = _context.Projects
                .Where(p => p.ProjID == id)
                .First();

            proj.ProjName = name;

            _context.Update(proj);

            _context.SaveChanges();

            return new JsonResult(new
            {
                status = true
            });
        }

        [HttpDelete("admin/delete-proj")]
        public JsonResult DeleteProj(int id)
        {
            IdentityUser user = Task.Run(async () => { return await _userManager.GetUserAsync(HttpContext.User); }).Result;

            var proj = _context.Projects
                .Where(p => p.ProjID == id)
                .First();

            _context.Remove(proj);

            //List<Photo> photos = _context.Photos
            //    .Where(p => p.PhotoProjID == id)
            //    .ToList();

            //_context.RemoveRange(photos);

            _context.SaveChanges();

            return new JsonResult(new
            {
                status = true
            });
        }
    }
}