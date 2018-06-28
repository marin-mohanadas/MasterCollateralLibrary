using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;

namespace MasterCollateralLibrary.Extensions
{    
    public class CustomAuthorizeAttr : AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            var controller = httpContext.Request.RequestContext.RouteData.GetRequiredString("controller");
            var action = httpContext.Request.RequestContext.RouteData.GetRequiredString("action");
            var verb = httpContext.Request.HttpMethod;
            var claimPrincipal = httpContext.User as ClaimsPrincipal;
            if (claimPrincipal == null) return base.AuthorizeCore(httpContext);
            var roles = claimPrincipal.Claims
                .Where(t => t.Type == ClaimTypes.Role)
                .Select(t => t.Value)
                .ToList();

            if (!string.IsNullOrEmpty(controller)
                && !string.IsNullOrEmpty(action)
                && !string.IsNullOrEmpty(verb)
                && claimPrincipal != null
                && roles.Count > 0)
            {
                return AuthHelper.IsAllowed(roles, controller, action, verb);
            }
            
            return base.AuthorizeCore(httpContext);
        }        
    }

    // todo: move this logic
    public static class AuthHelper
    {
        public static bool IsAllowed(IEnumerable<string> roles, 
            string controller, string action, string verb)
        {
            if (roles.Contains("Administrator")) return true; // admin is allowed to do everything

            var writeVerbs = new string[] { "POST", "PUT", "DELETE" };
            var writeMethods = new string[] { "Update", "Delete", "Remove", "Add", "Create" };

            var readVerbs = new string[] { "GET", "POST" };
            
            // component
            if (controller == "ComponentList")
            {
                // read
                if (readVerbs.Contains(verb) &&
                    !writeMethods.Any(t => action.StartsWith(t)))
                {
                    return roles.Contains("TrayEngineer")
                        || roles.Contains("QuotesUser")
                        || roles.Contains("ComponentMgr")
                        || roles.Contains("SalesRep");                        
                }

                // write
                if (writeVerbs.Contains(verb) &&
                    writeMethods.Any(t => action.StartsWith(t)))
                {
                    return roles.Contains("TrayEngineer")
                        || roles.Contains("QuotesUser")
                        || roles.Contains("ComponentMgr");
                }                
            }

            // quote
            if (controller == "QuoteMaster")
            {
                if (verb == "POST" && action.Equals("CreateNewAwardFromId", 
                    System.StringComparison.CurrentCultureIgnoreCase))             
                {
                    return roles.Contains("TrayEngineer");
                }                
                else
                {
                    return roles.Contains("TrayEngineer")
                        || roles.Contains("QuotesUser")
                        || roles.Contains("SalesRep");
                }                
            }

            return false;
        }
    }
}