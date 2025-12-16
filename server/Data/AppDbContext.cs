using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Chair> Chairs { get; set; }
        public DbSet<QueueItem> QueueItems { get; set; }
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Branch> Branches => Set<Branch>();
        public DbSet<Barber> Barbers => Set<Barber>();
        public DbSet<Service> Services => Set<Service>();
        public DbSet<Booking> Bookings => Set<Booking>();
        public DbSet<BarberSchedule> BarberSchedules => Set<BarberSchedule>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Feedback> Feedbacks => Set<Feedback>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ========== Branch ==========
            modelBuilder.Entity<Branch>(b =>
            {
                b.HasKey(x => x.Id);

                b.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                b.Property(x => x.Location)
                    .IsRequired();

                b.HasOne(x => x.Manager)
                    .WithMany()
                    .HasForeignKey(x => x.ManagerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ========== Service ==========
            modelBuilder.Entity<Service>(s =>
            {
                s.HasKey(x => x.Id);
                s.Property(x => x.Name).IsRequired().HasMaxLength(200);
                s.Property(x => x.Price).HasPrecision(18, 2); // مهم جداً
            });
            //////////////////////////////orders//////////////////////////////
            modelBuilder.Entity<Order>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Total).HasColumnType("decimal(18,2)");
                b.Property(x => x.PaymentMethod).HasMaxLength(100);
                b.Property(x => x.Status).HasConversion<string>().HasMaxLength(50);
                b.HasMany(o => o.Items).WithOne(i => i.Order).HasForeignKey(i => i.OrderId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<OrderItem>(bi =>
            {
                bi.HasKey(x => x.Id);
                bi.Property(x => x.Price).HasColumnType("decimal(18,2)");
            });
            ////////////feedback///////////////////////

            modelBuilder.Entity<Feedback>(f =>
            {
                f.HasKey(x => x.Id);
                f.Property(x => x.Rating).IsRequired();
                f.Property(x => x.IpAddress).HasMaxLength(100);
            });

            // ========== Fix relationships and add indexes ==========
            modelBuilder.Entity<Barber>()
              .HasOne(b => b.Branch)
              .WithMany(br => br.Staff)
              .HasForeignKey(b => b.BranchId)
              .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BarberSchedule>()
                .HasOne(bs => bs.Branch)
                .WithMany()
                .HasForeignKey(bs => bs.BranchId)
                .OnDelete(DeleteBehavior.Restrict); // منع الكاسكيد

            modelBuilder.Entity<BarberSchedule>()
                .HasOne(bs => bs.Barber)
                .WithMany(bar => bar.Schedules)
                .HasForeignKey(bs => bs.BarberId)
                .OnDelete(DeleteBehavior.Restrict); // منع الكاسكيد

            // Booking precision for service price
            modelBuilder.Entity<Booking>(bk =>
            {
                bk.Property(x => x.ServicePrice).HasColumnType("decimal(18,2)");
            });

            // Indexes to speed up queue operations
            modelBuilder.Entity<QueueItem>(q =>
            {
                q.HasKey(x => x.Id);
                q.HasIndex(x => new { x.BranchId, x.IsServed });
                q.HasIndex(x => x.BookingId);
            });

            modelBuilder.Entity<Booking>(b =>
            {
                b.HasIndex(x => x.BranchId);
            });

            modelBuilder.Entity<Chair>(c =>
            {
                c.HasIndex(x => x.AssignedBarberId);
            });
        }
    }
}
