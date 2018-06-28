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
    public class QuoteStatusController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public QuoteStatusController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
        }

        // GET: GPOs
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetStatus()
        {
            var data = UnitOfWork.TblQtStatus.GetAll()
                .OrderBy(t => t.qtstatus_desc)
                .ToList();

            var dto = Mapper.Map<IEnumerable<QuoteStatusDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetStatus(int id)
        {
            var data = UnitOfWork.TblQtStatus.Get(id);
            var dto = Mapper.Map<QuoteStatusDTO>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult Find(QuoteFindDTO param)
        {
            var data = UnitOfWork.TblQtStatus.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir, param.qtstatus_desc);
            var dto = Mapper.Map<PageListDTO<ICollection<QuoteStatusDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult Update(QuoteStatusDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblQtStatus.Get(dto.id);

                if (model != null)
                {
                    model.id = dto.id;
                    model.qtstatus_desc = dto.qtstatus_desc;
                    model.qtstatus_defn = dto.qtstatus_defn;
                    model.qtstatus_qc_sbmt = dto.qtstatus_qc_sbmt;
                    model.qtstatus_sls_sbmt = dto.qtstatus_sls_sbmt;
                    model.qtstatus_lock = dto.qtstatus_lock;
                    model.qtstatus_output = dto.qtstatus_output;
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
        public JsonResult SaveNew(QuoteStatusDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = new tbl_qtstatus();

                model.id = dto.id;
                model.qtstatus_desc = dto.qtstatus_desc;
                model.qtstatus_defn = dto.qtstatus_defn;
                model.qtstatus_qc_sbmt = dto.qtstatus_qc_sbmt;
                model.qtstatus_sls_sbmt = dto.qtstatus_sls_sbmt;
                model.qtstatus_lock = dto.qtstatus_lock;
                model.qtstatus_output = dto.qtstatus_output;

                //model.qtstatus_desc = .qtstatus_desc;
                //model.qtstatus_defn = dto.qtstatus_defn;
                //model.qtstatus_qc_sbmt = dto.qtstatus_qc_sbmt;
                //model.qtstatus_sls_sbmt = dto.qtstatus_sls_sbmt;
                //model.qtstatus_lock = dto.qtstatus_lock;
                //model.qtstatus_output = dto.qtstatus_output;

                UnitOfWork.TblQtStatus.Add(model);

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
                var model = UnitOfWork.TblQtStatus.Get(id);

                if (model != null)
                {
                    UnitOfWork.TblQtStatus.Remove(model);
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