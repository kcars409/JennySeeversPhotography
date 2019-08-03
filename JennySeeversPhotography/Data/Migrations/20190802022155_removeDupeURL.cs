using Microsoft.EntityFrameworkCore.Migrations;

namespace JennySeeversPhotography.Data.Migrations
{
    public partial class removeDupeURL : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhotoURL",
                table: "Photos");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhotoURL",
                table: "Photos",
                nullable: true);
        }
    }
}
