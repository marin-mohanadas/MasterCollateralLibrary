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
    
    public partial class tbl_HScode
    {
        public string HS_code { get; set; }
        public string HS_desc { get; set; }
        public Nullable<double> HS_rate { get; set; }
        public string HS_import_locn { get; set; }
        public byte[] SSMA_TimeStamp { get; set; }
    }
}