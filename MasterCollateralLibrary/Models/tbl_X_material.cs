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
    
    public partial class tbl_X_material
    {
        public int ID { get; set; }
        public int material_comp_id { get; set; }
        public int material_material_id { get; set; }
        public Nullable<bool> material_primary { get; set; }
        public byte[] SSMA_TimeStamp { get; set; }
    
        public virtual tbl_comp tbl_comp { get; set; }
        public virtual tbl_material tbl_material { get; set; }
    }
}
