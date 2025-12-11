namespace backend.DTOs
{
    public class AuthResponseDto
    {
        public string Message { get; set; } = string.Empty;
        public bool IsAuthenticated { get; set; } = false;
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime? RefreshTokenExpiration { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new List<string>();
        public int? ManagedBranchId { get; set; } = null;

    }
}