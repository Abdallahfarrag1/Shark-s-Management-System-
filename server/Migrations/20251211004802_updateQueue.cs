using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class updateQueue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_QueueItems_BookingId",
                table: "QueueItems",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_QueueItems_BranchId_IsServed",
                table: "QueueItems",
                columns: new[] { "BranchId", "IsServed" });

            migrationBuilder.CreateIndex(
                name: "IX_Chairs_AssignedBarberId",
                table: "Chairs",
                column: "AssignedBarberId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_BranchId",
                table: "Bookings",
                column: "BranchId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_QueueItems_BookingId",
                table: "QueueItems");

            migrationBuilder.DropIndex(
                name: "IX_QueueItems_BranchId_IsServed",
                table: "QueueItems");

            migrationBuilder.DropIndex(
                name: "IX_Chairs_AssignedBarberId",
                table: "Chairs");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_BranchId",
                table: "Bookings");
        }
    }
}
