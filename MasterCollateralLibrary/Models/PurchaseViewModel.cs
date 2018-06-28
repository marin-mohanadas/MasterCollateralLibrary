//using System;
//using System.Collections.Generic;
//using System.Data.Linq;
//using System.Linq;
//using System.Web;
//using System.ComponentModel;

//namespace MasterCollateralLibrary.Models
//{
//    public class CurrencyViewModel
//    {
//        public int CurrencyID { get; set; }
//        public string CurrencyCode { get; set; }
//        public string CurrencyName { get; set; }
//        public int? CurrencyBase { get; set; }
//    }

//    public class PlantViewModel
//    {
//        public int PlantId { get; set; } 
//        public string PlantName { get; set; } 
//        public string PlantCity { get; set; }
//        public string PlantCountry { get; set; }
//    }

//    public class PurchaseViewModel
//    {
//        [DisplayName("Base Currency")]
//        public Nullable<int> purch_currncy_id { get; set; }

//        public IEnumerable<CurrencyViewModel> Currencies
//        {
//            get
//            {
//                using (var entities = new GriMclEntityDataModel())
//                {
//                    return (from c in entities.tbl_currncy
//                            where c.currncy_base == 3
//                            orderby c.currncy_name descending
//                            select new CurrencyViewModel { CurrencyID =  c.currncy_id,
//                                CurrencyCode = c.currncy_code,
//                                CurrencyName = c.currncy_name,
//                                CurrencyBase = c.currncy_base }).ToList();  
//                }                        
//            }
//        }

//        [DisplayName("Plant/Location")]
//        public Nullable<int> purch_plant_id { get; set; }

//        public IEnumerable<PlantViewModel> Plants
//        {
//            get
//            {
//                using (var entities = new GriMclEntityDataModel())
//                {
//                    return (from p in entities.tbl_plant
//                            orderby p.plant_name descending
//                            select new PlantViewModel
//                            {
//                                PlantId = p.plant_id,
//                                PlantCity = p.plant_city,
//                                PlantCountry = p.plant_country,
//                                PlantName = p.plant_name
//                            }).ToList();
//                }
//            }
//        }


//        [DisplayName("Acquisition Cost (case)")]
//        public Nullable<double> purch_aqsn_cost { get; set; }

//        [DisplayName("Inbound Freight(case)")]
//        public Nullable<double> purch_inbnd_fgt { get; set; }

//        [DisplayName("Purchase Duty Rate (%)")]
//        public Nullable<double> purch_import_duty { get; set; }

//        [DisplayName("VAT Refund(%)")]
//        public Nullable<double> purch_VAT_refund { get; set; }

//        [DisplayName("Cost Type")]
//        public Nullable<int> purch_cost_type_id { get; set; }

//        [DisplayName("Purchasing Unit")]
//        public string purch_puom { get; set; }

//        public IEnumerable<tbl_uom> UOMs
//        {
//            get
//            {
//                using (var entities = new GRI_MCLEntities1()) //GriMclEntityDataModel())
//                {
//                    return (from u in entities.tbl_uom
//                            orderby u.uom_desc ascending
//                            select u).ToList();
//                }
//            }
//        }

//        [DisplayName("Qty")]
//        public Nullable<int> purch_puom_qty { get; set; }

//        [DisplayName("Selling Unit")]
//        public string purch_suom { get; set; }

//        [DisplayName("Qty")]
//        public Nullable<int> purch_suom_qty { get; set; }

//        [DisplayName("Usage Unit")]
//        public string purch_uuom { get; set; }

//        [DisplayName("Qty")]
//        public Nullable<int> purch_uuom_qty { get; set; }

//        [DisplayName("Acquisition Cost (each)")]
//        public string AcqusitionCost
//        {
//            get
//            {
//                // =FormatNumber([purch_aqsn_cost]/[purch_puom_qty],3,-1) & " " & [currncy_code]
//                return String.Format("{0:#.000} {1}", purch_aqsn_cost / purch_puom_qty, currncy_code);
//            }
//        }

//        public Nullable<int> purch_comp_id { get; set; }
//        public string uom_code { get; set; }
//        public string uom_desc { get; set; }
//        public string plant_name { get; set; }
//        public string plant_city { get; set; }
//        public string plant_country { get; set; }
//        public string cst_type_desc { get; set; }
//        public string currncy_name { get; set; }
//        public Nullable<int> purch_cartn_lgt { get; set; }
//        public Nullable<int> purch_cartn_wdt { get; set; }
//        public Nullable<int> purch_cartn_hgt { get; set; }
//        public Nullable<int> purch_cartn_wgt { get; set; }
//        public Nullable<System.DateTime> purch_date_create { get; set; }
//        public Nullable<bool> purch_expry { get; set; }
//        public Nullable<System.DateTime> purch_date_expry { get; set; }
//        public string currncy_code { get; set; }
//        public Nullable<double> purch_scrap { get; set; }
//    }
//}