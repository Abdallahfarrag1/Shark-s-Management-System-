using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Data
{
    public static class DbSeeder
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider service)
        {
            var userManager = service.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = service.GetRequiredService<RoleManager<IdentityRole>>();

            // ================================
            // 1) Create Roles
            // ================================
            string[] roleNames = { "Admin", "BranchManager", "Customer", "Barber" };

            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // ================================
            // 2) Create Default Admin
            // ================================
            var adminEmail = "admin@sharks.com";
            var adminPassword = "P@ssw0rd123!";

            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                var newAdmin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "Abo",
                    LastName = "Zein",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(newAdmin, adminPassword);

                if (!result.Succeeded)
                {
                    throw new Exception("Failed to create default Admin user: "
                        + string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                adminUser = newAdmin;
            }

            // ================================
            // 3) Add Admin Role
            // ================================
            if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }
}
