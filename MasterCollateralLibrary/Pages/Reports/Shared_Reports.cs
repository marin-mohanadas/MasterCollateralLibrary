using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;
using System.Web;

namespace SharedReportMethods
{
    public class Data
    {
        public static DataTable GetDataFromSql(string sql, string get_column = "", string DB = "")
        {
            DataTable dt = new DataTable();
            if (get_column != "")
            {
                string sqlOrig = sql;
                string leftString = "";
                //if (sqlOrig.Contains("*"))
                //{
                //    leftString = "*";
                //}
                //else
                //{
                    leftString = sqlOrig.Substring((sqlOrig.ToUpper().IndexOf("FROM") + 0));
                //}
                string SQL_ReWrite = "Select DISTINCT " + get_column + " " + leftString + " ORDER BY " + get_column;
                //sql = String.Format(sqlOrig, get_column);
                sql = SQL_ReWrite;
                using (SqlConnection connection = GetSqlConnection(get_column, DB))
                {
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.Connection.Open();
                    dt.Load(command.ExecuteReader());
                    CloseConnection(command);
                }
            }
            else
            {
                using (SqlConnection connection = GetSqlConnection(get_column, DB))
                {
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.Connection.Open();
                    dt.Load(command.ExecuteReader());
                    CloseConnection(command);
                }
            }
            return dt;
        }
        private static SqlConnection GetSqlConnection(string get_column = "", string DB = "")
        {
            string sqlDB = "";
            if (DB != "DW") {sqlDB = ConfigurationManager.ConnectionStrings["GRI_Identity"].ConnectionString;}
            else {sqlDB = ConfigurationManager.ConnectionStrings["GRI_DW"].ConnectionString;}
            SqlConnection conn = new SqlConnection(sqlDB);
            return conn;
        }
        private static void CloseConnection(SqlCommand cmd)
        {
            cmd.Connection.Close();
            cmd.Connection.Dispose();
            cmd.Dispose();
        }
    }
    public class UserData
    {
        public string getClaims(string claimType)
        {
            ClaimsPrincipal principal = HttpContext.Current.User as ClaimsPrincipal;
            if (null != principal)
            {
                foreach (Claim claim in principal.Claims)
                {
                    if (claim.Type == claimType)
                    {
                        return claim.Value;
                        //string.Format("CLAIM TYPE: " + claim.Type + "; CLAIM VALUE: " + claim.Value + "</br>");
                    }
                }
            }
            return null;
        }
        public void roleCheck(string userid)
        {
            bool isReportRunner = false;
            if (ClaimsPrincipal.Current.IsInRole("Administrator") || ClaimsPrincipal.Current.IsInRole("Report User"))
            {
                isReportRunner = true;
            }
            if (isReportRunner != true)
            {
                HttpContext.Current.Session["isReportRunner"] = false;
                //HttpContext.Current.Session["salesrep_id"] = getClaims("salesrep_id");
            }
            else
            {
                HttpContext.Current.Session["isReportRunner"] = true;
                //HttpContext.Current.Session["salesrep_id"] = getClaims("salesrep_id");
            }
            //string salesrep_id = "";
            //var identity = (ClaimsPrincipal)Thread.CurrentPrincipal;
            //IEnumerable<Claim> claims = ClaimsPrincipal.Current.IsInRole("Administrator");
            //foreach (Claim claim in claims)
            //{
            //    if (claim.Type == "salesrep_id")
            //    {
            //        salesrep_id = claim.Value;
            //    }
            //}
        }
    }
}