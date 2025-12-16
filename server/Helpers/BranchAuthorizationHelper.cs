using System.Security.Claims;

namespace backend.Helpers;

public static class BranchAuthorizationHelper
{
    public static bool IsManagerOfBranch(ClaimsPrincipal user, int branchId)
    {
        // Admin allowed automatically
        if (user.IsInRole("Admin"))
            return true;

        // BranchManager must match BranchId claim
        if (user.IsInRole("BranchManager"))
        {
            var managerBranchId = user.FindFirst("BranchId")?.Value;
            return managerBranchId == branchId.ToString();
        }

        return false;
    }
}