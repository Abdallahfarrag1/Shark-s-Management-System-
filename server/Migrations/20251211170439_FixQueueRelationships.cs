using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class FixQueueRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Barbers_Branches_BranchId1",
                table: "Barbers");

            migrationBuilder.DropForeignKey(
                name: "FK_BarberSchedules_Barbers_BarberId1",
                table: "BarberSchedules");

            migrationBuilder.DropIndex(
                name: "IX_BarberSchedules_BarberId1",
                table: "BarberSchedules");

            migrationBuilder.DropIndex(
                name: "IX_Barbers_BranchId1",
                table: "Barbers");

            migrationBuilder.DropColumn(
                name: "BarberId1",
                table: "BarberSchedules");

            migrationBuilder.DropColumn(
                name: "BranchId1",
                table: "Barbers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BarberId1",
                table: "BarberSchedules",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BranchId1",
                table: "Barbers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BarberSchedules_BarberId1",
                table: "BarberSchedules",
                column: "BarberId1");

            migrationBuilder.CreateIndex(
                name: "IX_Barbers_BranchId1",
                table: "Barbers",
                column: "BranchId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Barbers_Branches_BranchId1",
                table: "Barbers",
                column: "BranchId1",
                principalTable: "Branches",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BarberSchedules_Barbers_BarberId1",
                table: "BarberSchedules",
                column: "BarberId1",
                principalTable: "Barbers",
                principalColumn: "Id");
        }
    }
}
