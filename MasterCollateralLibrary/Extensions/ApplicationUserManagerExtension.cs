using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MasterCollateralLibrary.Extensions
{
    public static class ApplicationUserManagerExtension
    {
        public static int? GetSalesRepIdByUserId(this ApplicationUserManager mgr, string userId)
        {
            var claims = mgr.GetClaims(userId);
            if (claims != null && claims.Count > 0)
            {
                var rep = claims.FirstOrDefault(t => t.Type == "salesrep_id");
                if (rep != null)
                {
                    var num = 0;
                    if (int.TryParse(rep.Value, out num))
                        return num;
                }
            }
            return null;
        }
    }
}