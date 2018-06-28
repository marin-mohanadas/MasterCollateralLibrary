using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SharedReportMethods;
using Telerik.Web.UI;
using System.Data;

namespace MasterCollateralLibrary.Pages.Reports
{
    public partial class ReportRunner : System.Web.UI.Page
    {
        string sql = "";
        string DB = "";
        string get_column = "";

        protected void Page_Load(object sender, EventArgs e)
        {
            bool isReportRunner = Convert.ToBoolean(HttpContext.Current.Session["isReportRunner"]);
            string salesrep_id = Convert.ToString(HttpContext.Current.Session["salesrep_id"]);
            string repfilter = "";

            int reportID = Convert.ToInt32(Request.QueryString["reportID"]);

            DataTable reportDT = Data.GetDataFromSql("Select * from Reports_Info WHERE (id = " + reportID + ")");
            DataRow reporRow = reportDT.Rows[0];


            if (!isReportRunner)
            {
                if (!string.IsNullOrEmpty(Convert.ToString(reporRow["salesRepFilterColumn"])))
                {
                    repfilter = " WHERE (" + Convert.ToString(reporRow["salesRepFilterColumn"]) + " = " + salesrep_id + ")";
                }
            }

            string reportname = Convert.ToString(reporRow["ReportName"]);

            DB = Convert.ToString(reporRow["queryDB"]);

            if (reportname == string.Empty || reportname == "" || reportname == null)
            {
                sql = "Select 'No Report Selected' as Notice";
            }

            sql = Convert.ToString(reporRow["ReportQuery"]) + repfilter;
            ReportGrid.ExportSettings.FileName = Request.QueryString["ReportName"];
        }
        protected void ReportGrid_NeedDataSource(object sender, Telerik.Web.UI.GridNeedDataSourceEventArgs e)
        {
            ReportGrid.DataSource = Data.GetDataFromSql(sql, get_column, DB);
        }

        protected void ReportGrid_FilterCheckListItemsRequested(object sender, Telerik.Web.UI.GridFilterCheckListItemsRequestedEventArgs e)
        {
            string DataField = (e.Column as IGridDataColumn).GetActiveDataField();
            e.ListBox.DataSource = Data.GetDataFromSql(sql, DataField, DB);
            e.ListBox.DataKeyField = DataField;
            e.ListBox.DataTextField = DataField;
            e.ListBox.DataValueField = DataField;
            e.ListBox.DataBind();
        }
        protected void ReportGrid_ColumnCreated(object sender, GridColumnCreatedEventArgs e)
        {
            e.Column.FilterCheckListEnableLoadOnDemand = true;
            e.Column.FilterControlWidth = Unit.Percentage(80);
        }

        protected void ReportGrid_InfrastructureExporting(object sender, GridInfrastructureExportingEventArgs e)
        {
            //Telerik.Web.UI.ExportInfrastructure.Table table = e.ExportStructure.Tables[0];
            //for (int i = 1; (i <= table.Rows.Count); i++)
            //{
            //    for (int j = 1; (j <= ReportGrid.MasterTableView.RenderColumns.Count()); j++)
            //    {
            //        table.Cells[j, i].Format = "@";
            //        table.Cells[j, i].Value = table.Cells[j, i].Text;
            //    }

            //}
        }
    }
}