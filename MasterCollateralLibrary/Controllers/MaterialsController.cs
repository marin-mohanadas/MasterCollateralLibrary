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
    public class MaterialsController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;

        public MaterialsController()
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
        public JsonResult Find(MaterialFindDTO param)
        {
            var data = UnitOfWork.TblMaterial.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir, param.material_desc, param.material_abbv);
            var dto = Mapper.Map<PageListDTO<ICollection<MaterialFindDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult Update(MaterialDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblMaterial.Get(dto.id);

                if (model != null)
                {
                    model.material_desc = dto.material_desc;
                    model.material_abbv = dto.material_abbv;
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
        public JsonResult SaveNew(MaterialDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = new tbl_material();

                model.material_desc = dto.material_desc;
                model.material_abbv = dto.material_abbv;

                UnitOfWork.TblMaterial.Add(model);

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
                var model = UnitOfWork.TblMaterial.Get(id);

                if (model != null)
                {
                    UnitOfWork.TblMaterial.Remove(model);
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