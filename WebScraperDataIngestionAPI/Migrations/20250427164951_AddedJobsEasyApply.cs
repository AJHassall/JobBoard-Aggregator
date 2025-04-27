using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebScraperDataIngestionAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddedJobsEasyApply : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsEasyApply",
                table: "Jobs",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEasyApply",
                table: "Jobs");
        }
    }
}
