using Microsoft.AspNet.Identity;
using SharedReportMethods;
using System;
using System.Web;
using System.Web.UI;

namespace MasterCollateralLibrary.Pages.Reports
{
    public partial class Reports : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.User.Identity.IsAuthenticated)
            {
                Response.Redirect("~/Account/Login?ReturnUrl=" + HttpContext.Current.Request.Url.PathAndQuery);
            }
            else
            {
                var userData = new UserData();
                userData.roleCheck(Page.User.Identity.GetUserId());
                string salesrep_id = userData.getClaims("salesrep_id");
                HttpContext.Current.Session["salesrep_id"] = salesrep_id;
            }
        }
    }
}