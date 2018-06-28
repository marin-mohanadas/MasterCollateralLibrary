using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;


namespace MasterCollateralLibrary.Models
{
    public class SpecialtyViewModel
    {
        [DisplayName("Specialty(es) Related to Product")]
        public int spclty_spclty_id { get; set; }
//SELECT tbl_spclty.spclty_id, tbl_spclty.spclty_name
//FROM tbl_spclty
//ORDER BY tbl_spclty.[spclty_name];
    }
}