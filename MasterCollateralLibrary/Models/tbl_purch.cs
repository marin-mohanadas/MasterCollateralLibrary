//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MasterCollateralLibrary.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbl_purch
    {
        public Nullable<int> purch_comp_id { get; set; }
        public Nullable<int> purch_plant_id { get; set; }
        public Nullable<double> purch_aqsn_cost { get; set; }
        public Nullable<int> purch_currncy_id { get; set; }
        public string purch_puom { get; set; }
        public string purch_suom { get; set; }
        public string purch_uuom { get; set; }
        public Nullable<int> purch_puom_qty { get; set; }
        public Nullable<int> purch_suom_qty { get; set; }
        public Nullable<int> purch_uuom_qty { get; set; }
        public Nullable<double> purch_VAT_refund { get; set; }
        public Nullable<double> purch_inbnd_fgt { get; set; }
        public Nullable<double> purch_import_duty { get; set; }
        public Nullable<int> purch_cost_type_id { get; set; }
        public Nullable<int> purch_eoq_min { get; set; }
        public Nullable<int> purch_eoq_max { get; set; }
        public Nullable<int> purch_cartn_lgt { get; set; }
        public Nullable<int> purch_cartn_wdt { get; set; }
        public Nullable<int> purch_cartn_hgt { get; set; }
        public Nullable<int> purch_cartn_wgt { get; set; }
        public Nullable<int> purch_lead_time { get; set; }
        public Nullable<double> purch_scrap { get; set; }
        public Nullable<System.DateTime> purch_date_create { get; set; }
        public Nullable<bool> purch_expry { get; set; }
        public Nullable<System.DateTime> purch_date_expry { get; set; }
        public byte[] SSMA_TimeStamp { get; set; }
        public int id { get; set; }
    
        public virtual tbl_comp tbl_comp { get; set; }
        public virtual tbl_cst_type tbl_cst_type { get; set; }
        public virtual tbl_currncy tbl_currncy { get; set; }
        public virtual tbl_plant tbl_plant { get; set; }
    }
}
