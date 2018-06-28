using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;

namespace MasterCollateralLibrary.Models
{
    public class LabelLanguageViewModel
    {
        [DisplayName("Language")]
        public int lbl_lang_id { get; set; }

        [DisplayName("Label Description")]
        public string lbl_desc { get; set; }

    }
}