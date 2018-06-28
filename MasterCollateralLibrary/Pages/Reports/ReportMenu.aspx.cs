using Microsoft.AspNet.Identity;
using SharedReportMethods;
using System;
using System.Data;
using System.Web;


namespace MasterCollateralLibrary.Pages.Reports
{
    public partial class ReportMenu : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            var userData = new UserData();
            userData.roleCheck(Page.User.Identity.GetUserId());
            string salesrep_id = userData.getClaims("salesrep_id");
            HttpContext.Current.Session["salesrep_id"] = salesrep_id;

            RepInfo.Text = string.Format("Welcome {0}, RepID: {1}", User.Identity.Name, Session["salesrep_id"]);
            foreach (DataRow row in Data.GetDataFromSql("Select * from Reports_Info ORDER BY ReportName").Rows)
            {
                bool isReportRunner = Convert.ToBoolean(HttpContext.Current.Session["isReportRunner"]);
                bool adminReport = Convert.ToBoolean(row["adminReport"]);

                string reportLink = "";
                string staticPage = Convert.ToString(row["staticPage"]);
                if (adminReport)
                {
                    if (isReportRunner)
                    {
                        if (!String.IsNullOrEmpty(staticPage))
                        {
                            reportLink = "<li class=list-group-item><a href=" + row["staticPage"] + "> " + row["ReportName"] + "</a></li>";
                        }
                        else
                        {
                            reportLink = "<li class=list-group-item><a href=ReportRunner.aspx?ReportID=" + row["id"] + ">" + row["ReportName"] + "</a></li>";
                        }
                    }
                }
                else
                {
                    if (!String.IsNullOrEmpty(staticPage))
                    {
                        reportLink = "<li class=list-group-item><a href=" + row["staticPage"] + "> " + row["ReportName"] + "</a></li>";
                    }
                    else
                    {
                        reportLink = "<li class=list-group-item><a href=ReportRunner.aspx?ReportID=" + row["id"] + ">" + row["ReportName"] + "</a></li>";
                    }
                }

                reports.Text += reportLink;
            }

        }
    }
}