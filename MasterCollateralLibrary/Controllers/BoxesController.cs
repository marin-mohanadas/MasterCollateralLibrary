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
    public class BoxesController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;

        public BoxesController()
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
        public JsonResult Find(BoxFindDTO param)
        {
            var data = UnitOfWork.TblBox.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir);
            var dto = Mapper.Map<PageListDTO<ICollection<BoxFindDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult Update(BoxDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblBox.Get(dto.id);

                if (model != null)
                {
                    model.box_active = dto.box_active;
                    model.box_brand = dto.box_brand;
                    model.box_desc = dto.box_desc;
                    model.box_hght = dto.box_hght;
                    model.box_lngth = dto.box_lngth;
                    model.box_wdth = dto.box_wdth;
                    model.box_wght = dto.box_wght;
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
        public JsonResult SaveNew(BoxDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = new tbl_boxes();

                model.box_active = dto.box_active;
                model.box_brand = dto.box_brand;
                model.box_desc = dto.box_brand;
                model.box_hght = dto.box_hght;
                model.box_lngth = dto.box_lngth;
                model.box_wdth = dto.box_wdth;
                model.box_wght = dto.box_wght;

                UnitOfWork.TblBox.Add(model);

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
                var model = UnitOfWork.TblBox.Get(id);

                if (model != null)
                {
                    UnitOfWork.TblBox.Remove(model);
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