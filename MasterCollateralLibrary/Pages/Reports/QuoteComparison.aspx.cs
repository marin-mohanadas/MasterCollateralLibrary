using System;
using SharedReportMethods;
using System.Data;
using Telerik.Web.UI;
using System.Drawing;
using System.Web.UI.WebControls;
using System.Web;

namespace MasterCollateralLibrary.Pages.Reports
{
    public partial class QuoteComparison : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            var DDLs = Get_DDL_Quotes();

            DataRow newRow = DDLs.NewRow();
            newRow[0] = "0";
            newRow[1] = "-Select Quote-";
            DDLs.Rows.InsertAt(newRow, 0);

            Quote1_var.DataSource = DDLs;
            Quote1_var.DataTextField = "QuoteNo";
            Quote1_var.DataValueField = "id";
            Quote1_var.DataBind();

            Quote2_var.DataSource = DDLs;
            Quote2_var.DataTextField = "QuoteNo";
            Quote2_var.DataValueField = "id";
            Quote2_var.DataBind();

        }
        protected DataTable Query_Quotes(string Quote1, string Quote2)
        {
            return Data.GetDataFromSql("EXEC [dbo].[Quote_Comparison] @Quote1_id = " + Quote1 + ", @Quote2_id = " + Quote2 + "");
        }
        protected DataTable Get_DDL_Quotes()
        {
            bool isReportRunner = Convert.ToBoolean(HttpContext.Current.Session["isReportRunner"]);
            string salesrep_id = Convert.ToString(HttpContext.Current.Session["salesrep_id"]);
            string repfilter = "";
            DataTable dt = new DataTable();
            if (!isReportRunner)
            {
                repfilter = "and (qthdr_rep_id = " + salesrep_id + ")";
            }
            dt = Data.GetDataFromSql(@"SELECT TOP (100) PERCENT id, CAST(qthdr_qn_basis AS nvarchar(10)) + '-' + qthdr_rev AS QuoteNo
                                        FROM            dbo.tbl_qthdr
                                        WHERE        (ISNULL(qthdr_deleted, 0) = 0) " + repfilter + "ORDER BY qthdr_qn_basis, qthdr_rev");
            return dt;
        }
        protected void RunComp_Click(object sender, EventArgs e)
        {
            RadGrid1.DataBind();
        }
        protected void RadGrid1_ItemDataBound(object sender, GridItemEventArgs e)
        {
            if (e.Item is GridDataItem)
            {
                GridDataItem row = e.Item as GridDataItem;
                foreach (GridColumn col in (sender as RadGrid).MasterTableView.RenderColumns)
                {
                    if (col is GridBoundColumn)
                    {
                        foreach (GridDataItem item in RadGrid1.Items)
                        {
                            int number = 0;
                            TableCell cell = item[col.UniqueName];

                            if (Int32.TryParse(cell.Text, out number))
                            {
                                if (number < 0)
                                {
                                    cell.BackColor = Color.Red;
                                }
                            }
                            if (cell.Text == "&nbsp;" || string.IsNullOrEmpty(cell.Text))
                            {
                                cell.BackColor = Color.Red;
                            }

                        }
                    }
                }
            }
        }

        protected void RadGrid1_NeedDataSource(object sender, GridNeedDataSourceEventArgs e)
        {
            if (Quote1_var.SelectedValue != "0" && Quote1_var.SelectedValue != "0")
            {
                RadGrid1.DataSource = Query_Quotes(Quote1_var.SelectedValue, Quote2_var.SelectedValue);
            }

        }
    }
}