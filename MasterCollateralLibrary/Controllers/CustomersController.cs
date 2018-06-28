using AutoMapper;
using MCL.DTOs;
using MCL.EF.DAL;
using MCL.EF.DAL.Interfaces;
using MCL.EF.Model;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace MasterCollateralLibrary.Controllers
{
    [Authorize]
    public class CustomersController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;

        public CustomersController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
        }

        // GET: Customers
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult Customers()
        {
            var data = UnitOfWork.TblAccount.GetAll()
                .OrderBy(t => t.acct_name)
                .ToList();
            var dto = Mapper.Map<ICollection<AccountDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);            
        }

        [HttpGet]
        public JsonResult GetCustomerByid(int id)
        {
            var data = UnitOfWork.TblAccount.Get(id);
            var dto = Mapper.Map<AccountDTO>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                UnitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}