﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using JennySeeversPhotography.Data;
using JennySeeversPhotography.Models;
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
    public class UploadController : Controller
    {
        private readonly IConfiguration _config;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public UploadController(IConfiguration c, UserManager<IdentityUser> um, ApplicationDbContext db)
        {
            _context = db;
            _userManager = um;
            _config = c;
        }

        [HttpGet("media/{typeID}/{projID}/{name}")]
        public async Task<IActionResult> GetPic(int typeID, int projID, string name)
        {
            var filePath = _config.GetValue<string>("UploadPath")+ typeID + "/" + projID + "/" + name;
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
        [HttpPost("admin/upload")]
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

                string lowfile = fullFile.ToLower();

                if (typeTest(lowfile))
                {
                    ProcessImage(filePath, file.FileName);
                }

                bool typeTest(string path)
                {
                    return (path.EndsWith(".jpg") || path.EndsWith(".png") || path.EndsWith(".svg") || path.EndsWith(".bmp"));
                }
            }

            string title = file.FileName;
            string relPath = "/media/" + typeID + "/" + projID + "/" + title;
            string relThumb = "/media/" + typeID + "/" + projID + "/" + "th-" + title;

            _context.Add(new Photo
            {
                PicURL = relPath,
                ThumbURL = relThumb,
                Title = title,
                IsFeatured = false,
                PhotoProjID = projID,
                Location = null
            });

            _context.SaveChanges();

            return Ok(new { file = relPath, thumbnail = relThumb });
        }

        [HttpDelete("admin/delete-pic")]
        public JsonResult DeletePic(int id)
        {
            var pic = _context.Photos
                .Where(p => p.PicID == id)
                .First();

            string picPath = pic.PicURL;
            string thumbPath = pic.ThumbURL;

            picPath = picPath.Remove(0, 7);
            thumbPath = thumbPath.Remove(0, 7);

            picPath = _config.GetValue<string>("UploadPath") + picPath;
            thumbPath = _config.GetValue<string>("UploadPath") + thumbPath;
            

            System.IO.File.Delete(picPath);
            System.IO.File.Delete(thumbPath);

            _context.Remove(pic);

            _context.SaveChanges();

            return new JsonResult(new
            {
                status = true
            });
        }

        public void ProcessImage(string dir, string file)
        {
            Image<Rgba32> image = Image.Load(dir + file);

            if (image.Height >= image.Width)
            {
                image.Mutate(x => x
                .Resize(1080, 0)
                );

                image.Save(dir + file);

                image.Mutate(x => x
                .Resize(250, 0)
                );

                image.Save(dir + "th-" + file);
            }

            if (image.Width >= image.Height)
            {
                image.Mutate(x => x
                .Resize(0, 1080)
                );

                image.Save(dir + file);

                image.Mutate(x => x
                .Resize(0, 250)
                );

                image.Save(dir + "th-" + file);
            }
        }
    }
}