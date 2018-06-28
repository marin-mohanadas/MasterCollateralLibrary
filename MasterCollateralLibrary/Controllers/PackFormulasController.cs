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
    public class PackFormulasController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;

        public PackFormulasController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
        }

        // GET: Brands
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Edit(int id)
        {
            return View();
        }

        public ActionResult Create()
        {
            return View("Edit");
        }

        [HttpGet]
        public JsonResult GetFormulaEdit(int id)
        {
            var data = UnitOfWork.TblFormula.Get(id);
            var dto = Mapper.Map<FormulaDTO>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Find(FormulaFindDTO param)
        {
            var data = UnitOfWork.TblFormula.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir, param.formula_name);
            var dto = Mapper.Map<PageListDTO<ICollection<FormulaDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult Update(FormulaDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblFormula.Get(dto.id);

                if (model != null)
                {
                    model.formula_name = dto.formula_name;
                    model.formula_locn = dto.formula_locn;
                    model.formula_labor_rate = dto.formula_labor_rate;
                    model.formula_labor_time = dto.formula_labor_time;
                    model.formula_labor_factor = dto.formula_labor_factor;
                    model.formula_OH = dto.formula_OH;
                    model.formula_GA = dto.formula_GA;
                    model.formula_finance = dto.formula_finance;
                    model.formula_warehouse = dto.formula_warehouse;
                    model.formula_inlndfrgt = dto.formula_inlndfrgt;
                    model.formula_inlndfrgt_size = dto.formula_inlndfrgt_size;
                    model.formula_oceanfrgt = dto.formula_oceanfrgt;
                    model.formula_oceanfrgt_size = dto.formula_oceanfrgt_size;
                    model.formula_imprtdty = dto.formula_imprtdty;
                    model.formula_excisetx = dto.formula_excisetx;
                    model.formula_MAR = dto.formula_MAR;
                    model.formula_strlzn = dto.formula_strlzn;
                    model.formula_strlzn_load = dto.formula_strlzn_load;
                    model.formula_import_ship_rate = dto.formula_import_ship_rate;
                    model.formula_updtdate = dto.formula_updtdate;
                    model.formula_deleted = dto.formula_deleted;

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
        public JsonResult SaveNew(FormulaDTO dto)
        {
            try
            {
                var model = new tbl_formulas();

                model.formula_name = dto.formula_name;
                model.formula_locn = dto.formula_locn;
                model.formula_labor_rate = dto.formula_labor_rate;
                model.formula_labor_time = dto.formula_labor_time;
                model.formula_labor_factor = dto.formula_labor_factor;
                model.formula_OH = dto.formula_OH;
                model.formula_GA = dto.formula_GA;
                model.formula_finance = dto.formula_finance;
                model.formula_warehouse = dto.formula_warehouse;
                model.formula_inlndfrgt = dto.formula_inlndfrgt;
                model.formula_inlndfrgt_size = dto.formula_inlndfrgt_size;
                model.formula_oceanfrgt = dto.formula_oceanfrgt;
                model.formula_oceanfrgt_size = dto.formula_oceanfrgt_size;
                model.formula_imprtdty = dto.formula_imprtdty;
                model.formula_excisetx = dto.formula_excisetx;
                model.formula_MAR = dto.formula_MAR;
                model.formula_strlzn = dto.formula_strlzn;
                model.formula_strlzn_load = dto.formula_strlzn_load;
                model.formula_import_ship_rate = dto.formula_import_ship_rate;
                model.formula_updtdate = dto.formula_updtdate;

                UnitOfWork.TblFormula.Add(model);
                UnitOfWork.Save();
                dto.id = model.id;
            
            }
            catch (Exception ex)
            {
                dto.id = 0;
            }
            return Json(dto, JsonRequestBehavior.AllowGet);
        }
    }
}