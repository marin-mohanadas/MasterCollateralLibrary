using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;

namespace MasterCollateralLibrary.Models
{
    public class CrossReferenceViewModel
    {
        // cross_reference_view
        [DisplayName("Cross-Referenced Component/Vendor")]
        public int xref_equiv_compid { get; set; }
        //SELECT tbl_comp.comp_id, tbl_comp.comp_desc_orig, tbl_comp.comp_desc_attrbt, tbl_vend.vend_child_name, tbl_comp.comp_vend_pn, tbl_comp.comp_desc_adj, tbl_comp.comp_desc_color
        //FROM tbl_vend INNER JOIN tbl_comp ON tbl_vend.vend_id = tbl_comp.comp_vend_id
        //ORDER BY tbl_comp.comp_desc_orig;

        public string vend_child_name { get; set; }

        //[DisplayName("Component Part Number")]
        //public int xref_equiv_compid { get; set; }

//xref_life_cycle_id
//SELECT tbl_life_cycle.life_cycle_id, tbl_life_cycle.life_cycle_desc
//FROM tbl_life_cycle
//ORDER BY tbl_life_cycle.life_cycle_order;

        //Functional Equivalent Priority

        [DisplayName("Exact Cross")]
        public bool xref_exact { get; set; }

        public int xref_life_cycle_id { get; set; }
//SELECT tbl_life_cycle.life_cycle_id, tbl_life_cycle.life_cycle_desc
//FROM tbl_life_cycle
//ORDER BY tbl_life_cycle.life_cycle_order;

    }
}