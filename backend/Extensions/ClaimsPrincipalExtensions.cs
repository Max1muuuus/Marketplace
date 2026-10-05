using System.Security.Claims;

namespace backend.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int? GetUserId(this ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst("sub")
                           ?? user.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var parsedUserId))
            {
                return parsedUserId;
            }

            return null;
        }
    }
}
