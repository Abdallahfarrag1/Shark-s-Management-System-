using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;

namespace Sharks.Services
{
    public class PayPalService
    {
        private readonly PayPalHttpClient _client;

        public PayPalService(IConfiguration config)
        {
            var clientId = config["PayPal:ClientId"];
            var secret = config["PayPal:Secret"];
            var mode = config["PayPal:Mode"] ?? "sandbox";

            var env = mode.ToLower() == "live"
                ? (PayPalEnvironment)new LiveEnvironment(clientId, secret)
                : new SandboxEnvironment(clientId, secret);

            _client = new PayPalHttpClient(env);
        }

        public async Task<Order> CreateOrder(decimal amount, string currency = "USD")
        {
            var orderRequest = new OrderRequest()
            {
                CheckoutPaymentIntent = "CAPTURE",
                PurchaseUnits = new List<PurchaseUnitRequest>
        {
            new PurchaseUnitRequest
            {
                AmountWithBreakdown = new AmountWithBreakdown
                {
                    CurrencyCode = currency,
                    Value = amount.ToString("F2")
                }
            }
        },
                ApplicationContext = new ApplicationContext
                {
                    ReturnUrl = "http://localhost:5261/api/paypal/return",
                    CancelUrl = "http://localhost:5261/api/paypal/cancel",
                    BrandName = "Sharks",
                    LandingPage = "LOGIN",
                    UserAction = "PAY_NOW",
                    ShippingPreference = "NO_SHIPPING"
                }
            };

            var request = new OrdersCreateRequest();
            request.Prefer("return=representation");
            request.RequestBody(orderRequest);

            var response = await _client.Execute(request);
            return response.Result<Order>();
        }


        public async Task<Order> CaptureOrder(string orderId)
        {
            var request = new OrdersCaptureRequest(orderId);
            request.RequestBody(new OrderActionRequest());
            var response = await _client.Execute(request);
            return response.Result<Order>();
        }
        public async Task<Order> GetOrderDetails(string orderId)
        {
            var request = new OrdersGetRequest(orderId);
            var response = await _client.Execute(request);
            return response.Result<Order>();
        }
    }
}
