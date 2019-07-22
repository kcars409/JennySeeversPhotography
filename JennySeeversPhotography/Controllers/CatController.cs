using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JennySeeversPhotography.Data;
using JennySeeversPhotography.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace JennySeeversPhotography.Controllers
{
    [Route("admin")]
    public class CatController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ILogger _logger;

        public CatController(ApplicationDbContext context, ILogger<CatController> logger,
            UserManager<IdentityUser> userManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }

        [HttpGet("get-cats")]
        public JsonResult GetCats()
        {
            IdentityUser user = Task.Run(async () => { return await _userManager.GetUserAsync(HttpContext.User); }).Result;

            List<ProjType> cats = _context.ProjTypes
                .Where(c => c.TypeID > 1)
                .ToList();

            return new JsonResult(cats);
        }

        [HttpPost("add-cat")]
        public JsonResult AddCat(string name)
        {
            IdentityUser user = Task.Run(async () => { return await _userManager.GetUserAsync(HttpContext.User); }).Result;

            _context.Add(new ProjType
            {
                TypeName = name
            });

            _context.SaveChanges();

            return new JsonResult(new
            {
                status = true
            });
        }

        [HttpPost("edit-cat")]
        public JsonResult EditCat(int id, string name)
        {
            IdentityUser user = Task.Run(async () => { return await _userManager.GetUserAsync(HttpContext.User); }).Result;

            var cat = _context.ProjTypes
                .Where(c => c.TypeID == id)
                .First();

            cat.TypeName = name;

            _context.Update(cat);

            _context.SaveChanges();

            return new JsonResult(new
            {
                status = true
            });
        }

    }
}