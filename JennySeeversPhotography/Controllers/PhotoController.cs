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
    [Route("admin")]
    public class PhotoController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ILogger _logger;

        public PhotoController(ApplicationDbContext context, ILogger<PhotoController> logger,
            UserManager<IdentityUser> userManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }

        [HttpGet("get-pics")]
        public JsonResult GetPics(int id)
        {
            IdentityUser user = Task.Run(async () => { return await _userManager.GetUserAsync(HttpContext.User); }).Result;

            List<Photo> pics = _context.Photos
                .Where(p => p.PhotoProjID == id)
                .ToList();

            return new JsonResult(pics);
        }

        [HttpPost("add-pic")]
        public JsonResult AddPic(int id, string name, bool isFeatured, string location)
        {
            IdentityUser user = Task.Run(async () => { return await _userManager.GetUserAsync(HttpContext.User); }).Result;

            var proj = _context.Projects
                .Include(p => p.ProjPhotos)
                .Where(p => p.ProjID == id)
                .First();
                
                
            proj.ProjPhotos.Add(new Photo
            {
                Title = name,
                PhotoProjID = id,
                IsFeatured = isFeatured,
                Location = location
            });

            _context.SaveChanges();

            return new JsonResult(new
            {
                status = true
            });
        }

        [HttpPost("edit-pic")]
        public JsonResult EditPic(int id, string name, bool isFeatured, string location)
        {
            IdentityUser user = Task.Run(async () => { return await _userManager.GetUserAsync(HttpContext.User); }).Result;

            var pic = _context.Photos
                .Where(p => p.PicID == id)
                .First();

            pic.Title = name;
            pic.IsFeatured = isFeatured;
            pic.Location = location;

            _context.Update(pic);

            _context.SaveChanges();

            return new JsonResult(new
            {
                status = true
            });
        }

        [HttpDelete("delete-pic")]
        public JsonResult DeletePic(int id)
        {
            IdentityUser user = Task.Run(async () => { return await _userManager.GetUserAsync(HttpContext.User); }).Result;

            var pic = _context.Photos
                .Where(t => t.PicID == id)
                .First();

            _context.Remove(pic);

            _context.SaveChanges();

            return new JsonResult(new
            {
                status = true
            });
        }
    }
}