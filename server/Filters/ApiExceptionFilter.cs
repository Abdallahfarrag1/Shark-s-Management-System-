using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;

namespace backend.Filters
{
    public class ApiExceptionFilter : IExceptionFilter
    {
        private readonly ILogger<ApiExceptionFilter> _logger;

        public ApiExceptionFilter(ILogger<ApiExceptionFilter> logger)
        {
            _logger = logger;
        }

        public void OnException(ExceptionContext context)
        {
            var ex = context.Exception;

            // Log the exception
            _logger.LogError(ex, "Unhandled exception caught by ApiExceptionFilter");

            ObjectResult result;

            if (ex is ArgumentOutOfRangeException || ex is ArgumentNullException || ex is ArgumentException)
            {
                result = new ObjectResult(new { message = ex.Message }) { StatusCode = 400 };
            }
            else if (ex is InvalidOperationException)
            {
                result = new ObjectResult(new { message = ex.Message }) { StatusCode = 409 };
            }
            else if (ex is UnauthorizedAccessException)
            {
                result = new ObjectResult(new { message = ex.Message }) { StatusCode = 401 };
            }
            else
            {
                result = new ObjectResult(new { message = "An unexpected error occurred." }) { StatusCode = 500 };
            }

            context.Result = result;
            context.ExceptionHandled = true;
        }
    }
}
