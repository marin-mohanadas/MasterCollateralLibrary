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
    
    public partial class tbl_lang
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tbl_lang()
        {
            this.tbl_lbl = new HashSet<tbl_lbl>();
        }
    
        public string id { get; set; }
        public string lang_fam { get; set; }
        public string lang_desc_en { get; set; }
        public string lang_desc_nv { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbl_lbl> tbl_lbl { get; set; }
    }
}