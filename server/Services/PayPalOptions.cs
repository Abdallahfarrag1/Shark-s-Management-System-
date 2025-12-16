namespace Sharks.Services
{
    public class PayPalOptions
    {
        public string ClientId { get; set; } = "";
        public string Secret { get; set; } = "";
        public string BaseUrl { get; set; } = "";
      //  public string Mode { get; set; } = ""; // اختياري لو عايز تحدد sandbox أو live

    }
}
