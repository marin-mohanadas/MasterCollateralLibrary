using MCL.EF.DAL;
using MCL.EF.DAL.Interfaces;
using MCL.EF.Model;
using MCL.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MasterCollateralLibrary.Controllers
{
    public class HomeController : Controller
    {
        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        protected readonly IUnitOfWork UnitOfWork;
        protected readonly IQuoteService QuoteService;

        public HomeController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
            QuoteService = new QuoteService(UnitOfWork);
        }

        public ActionResult Index()
        {
            string logo = "gri_alleset_logo.png";
            
            if (User.Identity.IsAuthenticated)
            {
                var userId = User.Identity.GetUserId();
                var claims = UserManager.GetClaims(userId);
                if (claims != null)
                {
                    var brand = claims.FirstOrDefault(t => t.Type == "brand_id");

                    if (brand != null)
                    {
                        int brandId = 0;
                        int.TryParse(brand.Value, out brandId);
                        var blogo = QuoteService.GetBrandLogo(brandId);
                        if (!string.IsNullOrEmpty(blogo)) logo = blogo;
                    }                    
                }
            }
            ViewBag.ApprovalTicker = 0;
            ViewBag.Logo = logo;

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "";

            return View();
        }
    }
}