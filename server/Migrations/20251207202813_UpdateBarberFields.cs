using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBarberFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "Barbers",
                newName: "PhoneNumber");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Barbers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Barbers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Barbers");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Barbers");

            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Barbers",
                newName: "FullName");
        }
    }
}
