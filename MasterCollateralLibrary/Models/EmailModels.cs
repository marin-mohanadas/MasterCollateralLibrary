using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MasterCollateralLibrary.Models
{
    public class EmailModels
    {
        public string To { get; set; }
        public string CC { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public HttpPostedFileBase Attachment { get; set; }
    }
}