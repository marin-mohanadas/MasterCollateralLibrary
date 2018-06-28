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
    public class GPOsController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public GPOsController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
        }

        // GET: GPOs
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetGPOs()
        {
            var data = UnitOfWork.TblGpo.GetAll()
                .OrderBy(t => t.gpo_name)
                .ToList();

            var dto = Mapper.Map<IEnumerable<GpoDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetGPO(int id)
        {
            var data = UnitOfWork.TblGpo.Get(id);
            var dto = Mapper.Map<GpoDTO>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult Find(GpoFindDTO param)
        {
            var data = UnitOfWork.TblGpo.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir, param.gpo_name);
            var dto = Mapper.Map<PageListDTO<ICollection<GpoDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult Update(GpoDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblGpo.Get(dto.id);

                if (model != null)
                {
                    model.id = dto.id;
                    model.gpo_name = dto.gpo_name;
                    UnitOfWork.Save();
                    succeeded = true;
                }
            }
            catch (Exception ex)
            {
                succeeded = false;
            }
            return Json(succeeded, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveNew(GpoDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = new tbl_gpo();

                model.id = dto.id;
                model.gpo_name = dto.gpo_name;

                UnitOfWork.TblGpo.Add(model);

                UnitOfWork.Save();
                dto.id = model.id;

            }
            catch (Exception ex)
            {
                dto.id = 0;
            }
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult Delete(int id)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblGpo.Get(id);

                if (model != null)
                {
                    UnitOfWork.TblGpo.Remove(model);
                    UnitOfWork.Save();
                    succeeded = true;
                }
            }
            catch (Exception ex)
            {
                succeeded = false;
            }
            return Json(succeeded, JsonRequestBehavior.AllowGet);
        }
    }
}