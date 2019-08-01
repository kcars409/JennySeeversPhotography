using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace JennySeeversPhotography.Controllers
{
    [Route("admin")]
    public class UploadController : Controller
    {
        private readonly IConfiguration _config;
        private readonly UserManager<IdentityUser> _userManager;

        public UploadController(IConfiguration c, UserManager<IdentityUser> um)
        {
            _userManager = um;
            _config = c;
        }

        [HttpGet("media/{typeID}/{projID}/")]
        public async Task<IActionResult> GetPic(int typeID, int projID)
        {
            var filePath = _config.GetValue<string>("UploadPath")+ typeID + "/" + projID + "/";
            if (System.IO.File.Exists(filePath))
            {
                var imageFile = System.IO.File.OpenRead(filePath);
                return File(imageFile, "image/jpg");
            } else
            {
                return NotFound();
            }
        }

        //[Authorize(Roles = _userManager.Users.)]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadPic(IFormFile file, int typeID, int projID)
        {
            var filePath = _config.GetValue<string>("UploadPath") + typeID + "/" + projID + "/";

            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

            var fullFile = filePath + file.FileName;

            using (var stream = new FileStream(fullFile, FileMode.Create))
            {
                await file.CopyToAsync(stream);
                stream.Close();

                if (fullFile.ToLower().EndsWith(".jpg"))
                {
                    ProcessImage(filePath, file.FileName);
                }
            }

            return Ok(new { file = "/media/" + file.FileName, thumbnail = "/media/" + "th-" + file.FileName });
        }

        public void ProcessImage(string dir, string file)
        {
            Image<Rgba32> image = Image.Load(dir + file);

            image.Mutate(x => x
            .Resize(0, 1080)
            );

            image.Save(dir + file);

            image.Mutate(x => x
            .Resize(0, 300)
            );

            image.Save(dir + "th-" + file);
        }
    }
}