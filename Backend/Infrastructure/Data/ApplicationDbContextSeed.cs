using Core.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public static class ApplicationDbContextSeed
    {
        public static async Task SeedDefaultUserAsync(IServiceProvider serviceProvider, IConfiguration configuration, ILogger<ApplicationDbContext> logger)
        {
            try
            {
                var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                // Ensure roles exist
                string[] roles = { "Admin", "User" };
                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                        logger.LogInformation($"Created {role} role");
                    }
                }

                // Create admin user if it doesn't exist
                var adminEmail = configuration["AdminAccount:Email"] ?? "admin@eventbooking.com";
                var adminPassword = configuration["AdminAccount:Password"] ?? "Admin@123456";
                var adminUser = await userManager.FindByEmailAsync(adminEmail);

                if (adminUser == null)
                {
                    adminUser = new ApplicationUser
                    {
                        UserName = "admin",
                        Email = adminEmail,
                        FirstName = "System",
                        LastName = "Administrator",
                        EmailConfirmed = true,
                        SecurityStamp = Guid.NewGuid().ToString(),
                        CreatedAt = DateTime.UtcNow
                    };

                    var result = await userManager.CreateAsync(adminUser, adminPassword);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(adminUser, "Admin");
                        logger.LogInformation($"Admin user created with email {adminEmail}");
                    }
                    else
                    {
                        var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                        logger.LogError($"Failed to create admin user: {errors}");
                    }
                }
                else if (!(await userManager.IsInRoleAsync(adminUser, "Admin")))
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                    logger.LogInformation($"Added Admin role to existing user {adminEmail}");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding the database with the admin user");
            }
        }
    }
} 