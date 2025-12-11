using backend.Data;
using backend.Models;
using backend.Services;
using BarberBooking.API.Services;
using backend.Filters;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Sharks.Services;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog from configuration and console/file sinks
builder.Host.UseSerilog((ctx, lc) => lc
    .ReadFrom.Configuration(ctx.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
);

// =========================
//      CORS
// =========================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

// =========================
//     Add Controllers (register ApiExceptionFilter globally)
// =========================
builder.Services.AddScoped<ApiExceptionFilter>();
builder.Services.AddControllers(options =>
{
    options.Filters.AddService<ApiExceptionFilter>();
});

// =========================
//     Database
// =========================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.Configure<backend.Helpers.CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));

// =========================
//     Identity
// =========================
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// =========================
//     Services DI
// =========================
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBranchService, BranchService>();
builder.Services.AddScoped<IBarberService, BarberService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPhotoService,PhotoService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAvailabilityService, AvailabilityService>();
builder.Services.AddScoped<IBarberScheduleService, BarberScheduleService>();

// Register queue, order and feedback services
builder.Services.AddScoped<IQueueService, QueueService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();

builder.Services.AddScoped<PayPalService>();
builder.Services.AddHttpContextAccessor();

// =========================
//     JWT Auth
// =========================
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["Key"];
var validAudience = jwtSettings["ValidAudience"] ?? jwtSettings["Audience"];
var validIssuer = jwtSettings["ValidIssuer"] ?? jwtSettings["Issuer"];


// Build authentication builder first
var authBuilder = builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
});

authBuilder.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        // Do not validate issuer or audience - allow any
        ValidateIssuer = false,
        ValidateAudience = false,
        // Still validate the signature
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// =========================
//     Swagger
// =========================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Sharks API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Enter JWT token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// =========================
//     Middleware
// =========================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serilog request logging
app.UseSerilogRequestLogging();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// =========================
//     Seed Roles + Admin
// =========================
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        await DbSeeder.SeedRolesAndAdminAsync(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error seeding database");
    }
}

app.Run();
