using AutoMapper;
using MCL.DTOs;
using MCL.EF.DAL;
using MCL.EF.DAL.Interfaces;
using MCL.EF.Model;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MasterCollateralLibrary.Controllers
{
    [Authorize]
    public class DistributorsController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public DistributorsController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
        }

        // GET: Distributors
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetDistributors()
        {
            var data = UnitOfWork.TblDistributor.GetAll()
                .OrderBy(t => t.dist_name)
                .ToList();

            var dto = Mapper.Map<IEnumerable<DistributorDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDistributor(int id)
        {
            var data = UnitOfWork.TblDistributor.Get(id);
            var dto = Mapper.Map<DistributorDTO>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }
    }
}