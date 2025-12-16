using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ConvertBarberScheduleToWeeklyJson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DayOfWeek",
                table: "BarberSchedules");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "BarberSchedules");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "BarberSchedules");

            migrationBuilder.AddColumn<string>(
                name: "WeeklyScheduleJson",
                table: "BarberSchedules",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WeeklyScheduleJson",
                table: "BarberSchedules");

            migrationBuilder.AddColumn<int>(
                name: "DayOfWeek",
                table: "BarberSchedules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "EndTime",
                table: "BarberSchedules",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "StartTime",
                table: "BarberSchedules",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }
    }
}
