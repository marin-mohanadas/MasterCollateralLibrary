using AutoMapper;
using MCL.DTOs;
using MCL.EF.DAL;
using MCL.EF.DAL.Interfaces;
using MCL.EF.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace MasterCollateralLibrary.Controllers
{
    [Authorize]
    public class ProductGroupsController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;

        public ProductGroupsController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
        }

        // GET: ProductGroups
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ProductGroups()
        {
            var data = UnitOfWork.TblGrpHdr.GetAll()
                .OrderBy(t => t.grphdr_name)
                .ToList();
            var dto = Mapper.Map<ICollection<GrpHdrDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);            
        }

        [HttpGet]
        public JsonResult Find(int pageSize, int pageNumber,
            string sortBy, string sortDir)
        {
            var data = UnitOfWork.TblGrpHdr.List(pageSize, pageNumber, sortBy, sortDir);
            var dto = Mapper.Map<PageListDTO<ICollection<GrpHdrDTO>>>(data);            
            return Json(dto, JsonRequestBehavior.AllowGet);            
        }

        [HttpGet]
        public JsonResult GetProductGroupDetail(int id)
        {
            var hdr = UnitOfWork.TblGrpHdr.GetDetail(id);
            var dto = Mapper.Map<GrpCreateDTO>(hdr);
            return Json(dto, JsonRequestBehavior.AllowGet);            
        }

        [HttpGet]
        public JsonResult GetCeClasses()
        {
            var data = UnitOfWork.TblCEclass.GetAll()
                .OrderBy(t => t.CEclass_order)
                .ToList();
            var dto = Mapper.Map<ICollection<CEclassDTO>>(data);
            return Json(data, JsonRequestBehavior.AllowGet);            
        }

        [HttpGet]
        public JsonResult GetTechnicalHeadings()
        {
            var data = UnitOfWork.TblTechHdng.GetAll()
                .OrderBy(t => t.techhdng_order)                
                .ToList();
            var dto = Mapper.Map<ICollection<TechHdngDTO>>(data);
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