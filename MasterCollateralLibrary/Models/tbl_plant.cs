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
    
    public partial class tbl_plant
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tbl_plant()
        {
            this.tbl_purch = new HashSet<tbl_purch>();
        }
    
        public int id { get; set; }
        public string plant_name { get; set; }
        public string plant_city { get; set; }
        public string plant_country { get; set; }
        public Nullable<int> plant_currncy { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbl_purch> tbl_purch { get; set; }
    }
}