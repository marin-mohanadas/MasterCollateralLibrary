using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;

namespace MasterCollateralLibrary.Models
{
    public class CategoryViewModel
    {
        [DisplayName("Primary Category")]
        public int cat_cat1_id { get; set; }


//SELECT tbl_cat1.cat1_id, tbl_cat1.cat1_desc
//FROM tbl_cat1
//ORDER BY tbl_cat1.[cat1_desc];


        [DisplayName("Secondary Category")]
        public string cat2_desc { get; set; }
            
    }
}