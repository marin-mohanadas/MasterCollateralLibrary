//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;
//using System.ComponentModel;

//namespace MasterCollateralLibrary.Models
//{
//    public class VendorViewModel
//    {
//        public int VendorID { get; set; }
//        public string VendorChildName { get; set; }
//    }

//    public class SterilityViewModel
//    {
//        public int SterilityID { get; set; }
//        public string SetrilityDescription { get; set; }
//    }

//    public partial class ComponentListViewModel // <- component_master_view
//    {
//        [DisplayName("Component ID (Unique)")]
//        public int comp_id { get; set; }

//        [DisplayName("Vendor/Supplier")]
//        public Nullable<int> comp_vend_id { get; set; }

//        public IEnumerable<VendorViewModel> Vendors
//        {
//            get
//            {
//                using (var entities = new GRI_MCLEntities1()) //GriMclEntityDataModel())
//                {
//                    return (from v in entities.tbl_vend

//                            orderby v.vend_child_name ascending
//                            select new VendorViewModel
//                            {
//                                VendorID = v.vend_id,
//                                VendorChildName = v.vend_child_name
//                            }).ToList();
//                }
//            }
//        }

//        [DisplayName("Manufacturer")]
//        public Nullable<int> comp_mfgr_id { get; set; }

//        [DisplayName("Vendor Part Number")]
//        public string comp_vend_pn { get; set; }

//        [DisplayName("Description (original)")]
//        public string comp_desc_orig { get; set; }

//        [DisplayName("Noun")]
//        public string comp_desc_noun { get; set; }

//        [DisplayName("Attribute")]
//        public string comp_desc_attrbt { get; set; }

//        [DisplayName("Adjective")]
//        public string comp_desc_adj { get; set; }

//        [DisplayName("Alternate Description")]
//        public string comp_desc_alt { get; set; }

//        [DisplayName("Search Keywords")]
//        public string comp_desc_kywrd { get; set; }

//        [DisplayName("Color")]
//        public string comp_desc_color { get; set; }

//        [DisplayName("Side (e.g. L or R)")]
//        public string comp_desc_side { get; set; }

//        [DisplayName("Imperial Component Size")]
//        public string comp_size_imp { get; set; }

//        [DisplayName("Metric Component Size")]
//        public string comp_size_met { get; set; }

//        [DisplayName("Country of Origin")]
//        public string comp_coo_id { get; set; }

//        public IEnumerable<tbl_coo> Countries
//        {
//            get
//            {
//                using (var entities = new GRI_MCLEntities1()) //GriMclEntityDataModel())
//                {
//                    return (from c in entities.tbl_coo

//                            orderby c.coo_desc ascending
//                            select c).ToList();
//                }
//            }
//        }

//        [DisplayName("Sterility")]
//        public Nullable<int> comp_strlty { get; set; }

//        public IEnumerable<SterilityViewModel> Sterilities
//        {
//            get
//            {
//                using (var entities = new GRI_MCLEntities1())//GriMclEntityDataModel())
//                {
//                    return (from s in entities.tbl_strlty

//                            orderby s.strlty_ID  ascending
//                            select new SterilityViewModel { SterilityID = s.strlty_ID, SetrilityDescription = s.strlty_desc }).ToList();
//                }
//            }
//        }

//        [DisplayName("Status")]
//        public Nullable<int> comp_status_id { get; set; }

//        public IEnumerable<tbl_stat> Statuses
//        {
//            get
//            {
//                using (var entities = new GRI_MCLEntities1()) //GriMclEntityDataModel())
//                {
//                    if (comp_npe.Value == false)
//                    {
//                        return (from s in entities.tbl_stat
//                                where s.stat_npe.Value == comp_npe.Value
//                                select s).ToList();
//                    }
//                    else
//                    {
//                        return (from s in entities.tbl_stat
//                                select s).ToList();
//                    }
//                }
//            }
//        }

//        [DisplayName("HS Code")]
//        public Nullable<double> comp_HS_code { get; set; }

//        [DisplayName("Minimum Order Quantity (in purchase UOM)")]
//        public Nullable<int> comp_moq { get; set; }

//        [DisplayName("Component Evaluation on File")]
//        public Nullable<bool> comp_npe { get; set; }

//        [DisplayName("Product Manager")]
//        public Nullable<int> comp_pm { get; set; }

//        public IEnumerable<tbl_prodmgr> ProductManagers
//        {
//            get
//            {
//                using (var entities = new GRI_MCLEntities1()) //GriMclEntityDataModel())
//                {
//                    return (from p in entities.tbl_prodmgr
//                            orderby p.prodmgr_Lname ascending
//                            select p).ToList();
//                }
//            }
//        }

//        public PurchaseViewModel Purchase { get; set; }
//        public CrossReferenceViewModel CrossReference { get; set; }
//        public CategoryViewModel Category { get; set; }
//        public TraitViewModel Trait { get; set; }
//        public MaterialViewModel Material { get; set; }
//        public SpecialtyViewModel Specialty { get; set; }
//        public LabelLanguageViewModel LabelLanguage { get; set; }
//        public PictureViewModel Picture { get; set; }
//    }
//}