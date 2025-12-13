using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomerNameToOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add column only if it does not already exist (idempotent)
            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.Orders','CustomerName') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD CustomerName NVARCHAR(MAX) NULL;
    -- use dynamic SQL for statements that reference the new column to avoid compile-time name resolution errors
    EXEC('UPDATE dbo.Orders SET CustomerName = '''' WHERE CustomerName IS NULL');
    EXEC('ALTER TABLE dbo.Orders ALTER COLUMN CustomerName NVARCHAR(MAX) NOT NULL');
END
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop column only if it exists
            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.Orders','CustomerName') IS NOT NULL
BEGIN
    ALTER TABLE dbo.Orders DROP COLUMN CustomerName;
END
");
        }
    }
}
