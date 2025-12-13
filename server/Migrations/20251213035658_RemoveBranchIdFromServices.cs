using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveBranchIdFromServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Services_Branches_BranchId",
                table: "Services");

            migrationBuilder.DropIndex(
                name: "IX_Services_BranchId",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "BranchId",
                table: "Services");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BranchId",
                table: "Services",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Services_BranchId",
                table: "Services",
                column: "BranchId");

            migrationBuilder.AddForeignKey(
                name: "FK_Services_Branches_BranchId",
                table: "Services",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id");
        }
    }
}
