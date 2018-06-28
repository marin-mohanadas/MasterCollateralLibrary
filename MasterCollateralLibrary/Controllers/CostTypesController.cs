using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AutoMapper;
using MCL.DTOs;
using MCL.EF.DAL;
using MCL.EF.DAL.Interfaces;
using MCL.EF.Model;
using MCL.Services;

namespace MasterCollateralLibrary.Controllers
{
    [Authorize]
    public class CostTypesController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;

        public CostTypesController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
        }

        // GET: Brands
        public ActionResult Index()
        {
            return View();
        }

        
        //[HttpGet]
        //public JsonResult GetFormulaEdit(int id)
        //{
        //    var data = UnitOfWork.TblFormula.Get(id);
        //    var dto = Mapper.Map<FormulaDTO>(data);
        //    return Json(dto, JsonRequestBehavior.AllowGet);
        //}

        [HttpPost]
        public JsonResult Find(CostTypeFindDTO param)
        {
            var data = UnitOfWork.TblCostType.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir, param.cst_type_desc, param.cst_type_mu);
            var dto = Mapper.Map<PageListDTO<ICollection<CostTypeFindDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult Update(CostTypeDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblCostType.Get(dto.id);

                if (model != null)
                {
                    model.cst_type_desc = dto.cst_type_desc;
                    model.cst_type_mu = dto.cst_type_mu;
                    model.cst_type_deleted = dto.cst_type_deleted;
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
        public JsonResult SaveNew(CostTypeDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = new tbl_cst_type();

                model.cst_type_desc = dto.cst_type_desc;
                model.cst_type_mu = dto.cst_type_mu;

                UnitOfWork.TblCostType.Add(model);

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
                var model = UnitOfWork.TblCostType.Get(id);

                if (model != null)
                {
                    UnitOfWork.TblCostType.Remove(model);
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