using Microsoft.EntityFrameworkCore.Migrations;

namespace JennySeeversPhotography.Data.Migrations
{
    public partial class AddThumb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThumbURL",
                table: "Photos",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbURL",
                table: "Photos");
        }
    }
}
