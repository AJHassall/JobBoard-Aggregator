using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebScraperDataIngestionAPI.Migrations
{
    /// <inheritdoc />
    public partial class CompaniesTable : Migration
    {
        /// <inheritdoc />
protected override void Up(MigrationBuilder migrationBuilder)
{
    // 1. Drop the Articles table
    migrationBuilder.DropTable(
        name: "Articles");

    // 2. Create the Companies table
    migrationBuilder.CreateTable(
        name: "Companies",
        columns: table => new
        {
            Id = table.Column<int>(type: "integer", nullable: false)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            Name = table.Column<string>(type: "text", nullable: false)
        },
        constraints: table =>
        {
            table.PrimaryKey("PK_Companies", x => x.Id);
        });

    // 3.  Populate the Companies table with distinct company names from Jobs (BEFORE dropping the column)
    migrationBuilder.Sql(@"
        INSERT INTO ""Companies"" (""Name"")
        SELECT DISTINCT ""Company"" FROM ""Jobs"" WHERE ""Company"" IS NOT NULL;
    ");

    // 4. Add the new CompanyId column to the Jobs table
    migrationBuilder.AddColumn<int>(
        name: "CompanyId",
        table: "Jobs",
        type: "integer",
        nullable: false,
        defaultValue: 0); // Important:  Set a default value

    // 5. Update the Jobs table to set the CompanyId based on the Company name (BEFORE dropping the column)
    migrationBuilder.Sql(@"
        UPDATE ""Jobs""
        SET ""CompanyId"" = (SELECT c.""Id"" FROM ""Companies"" c WHERE ""Jobs"".""Company"" = c.""Name"")
        WHERE ""Jobs"".""Company"" IS NOT NULL;
    ");

    // 6. Drop the old Company column from the Jobs table
    migrationBuilder.DropColumn(
        name: "Company",
        table: "Jobs");

    // 7.  Remove duplicate URLs from the Jobs table, keeping only the first occurrence
    migrationBuilder.Sql(@"
        CREATE TEMPORARY TABLE temp_keep_ids AS
        SELECT min(""Id"") as ""Id""
        FROM ""Jobs""
        GROUP BY ""Url"";

        DELETE FROM ""Jobs""
        WHERE ""Id"" NOT IN (SELECT ""Id"" FROM temp_keep_ids);

        DROP TABLE temp_keep_ids;
    ");

    // 8. Create a unique index on the Url column in the Jobs table
    migrationBuilder.CreateIndex(
        name: "IX_Jobs_Url",
        table: "Jobs",
        column: "Url",
        unique: true);

    // 9. Create the foreign key relationship between Jobs and Companies
    migrationBuilder.CreateIndex(
        name: "IX_Jobs_CompanyId",
        table: "Jobs",
        column: "CompanyId");

    migrationBuilder.AddForeignKey(
        name: "FK_Jobs_Companies_CompanyId",
        table: "Jobs",
        column: "CompanyId",
        principalTable: "Companies",
        principalColumn: "Id",
        onDelete: ReferentialAction.Cascade);
}

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // 1. Drop the foreign key
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_Companies_CompanyId",
                table: "Jobs");

            // 2. Drop the index on CompanyId
            migrationBuilder.DropIndex(
                name: "IX_Jobs_CompanyId",
                table: "Jobs");

            // 3. Drop the unique index on Url
            migrationBuilder.DropIndex(
                name: "IX_Jobs_Url",
                table: "Jobs");

            // 4. Drop the CompanyId column
            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Jobs");

            // 5. Re-add the Company column
            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "Jobs",
                type: "text",
                nullable: false,
                defaultValue: "");  //  Important:  Set a default value

            // 6. Populate the Company column in Jobs
            migrationBuilder.Sql(@"
                UPDATE ""Jobs""
                SET ""Company"" = c.""Name""
                FROM ""Companies"" c
                WHERE ""Jobs"".""Id"" = c.""Id"";
            ");

            // 7. Drop the Companies table
            migrationBuilder.DropTable(
                name: "Companies");

            // 8. Re-create the Articles table
            migrationBuilder.CreateTable(
                name: "Articles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Text = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Articles", x => x.Id);
                });
        }
    }
}
