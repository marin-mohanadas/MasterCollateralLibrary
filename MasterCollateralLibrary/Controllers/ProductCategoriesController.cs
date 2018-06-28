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
    public class ProductCategoriesController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;

        public ProductCategoriesController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
        }

        // GET: ProductCategories
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult Product1Categories()
        {
            var data = UnitOfWork.TblCategory1.GetAll()
                .OrderBy(t => t.cat1_desc)
                .ToList();
            var dto = Mapper.Map<ICollection<Category1DTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Product2Categories()
        {
            var data = UnitOfWork.TblCategory2.GetAll()
                .OrderBy(t => t.cat2_desc)
                .ToList();
            var dto = Mapper.Map<ICollection<Category2DTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Product2CategoriesByCat1Id(int id)
        {
            var data = UnitOfWork.TblCategory2.Find(t => t.cat1_id == id)
                .OrderBy(t => t.cat2_desc)
                .ToList();
            var dto = Mapper.Map<ICollection<Category2DTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Find(int pageSize, int pageNumber,
            string sortBy, string sortDir)
        {
            var data = UnitOfWork.TblCategory1.List(pageSize, pageNumber, sortBy, sortDir);
            var dto = Mapper.Map<PageListDTO<ICollection<VendorDTO>>>(data);
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