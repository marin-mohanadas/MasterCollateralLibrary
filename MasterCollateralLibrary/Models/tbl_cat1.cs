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
    
    public partial class tbl_cat1
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tbl_cat1()
        {
            this.tbl_X_cat = new HashSet<tbl_X_cat>();
        }
    
        public int id { get; set; }
        public string cat1_desc { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbl_X_cat> tbl_X_cat { get; set; }
    }
}
