using Microsoft.EntityFrameworkCore.Migrations;

namespace JennySeeversPhotography.Data.Migrations
{
    public partial class updatePicURL : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhotoProjTypeID",
                table: "Photos");

            migrationBuilder.AddColumn<string>(
                name: "PicURL",
                table: "Photos",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PicURL",
                table: "Photos");

            migrationBuilder.AddColumn<int>(
                name: "PhotoProjTypeID",
                table: "Photos",
                nullable: false,
                defaultValue: 0);
        }
    }
}
