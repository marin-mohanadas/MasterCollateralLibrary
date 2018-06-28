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
    public class ProductManagersController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;

        public ProductManagersController()
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
        public JsonResult Find(ProdMgrFindDTO param)
        {
            var data = UnitOfWork.TblProdMgr.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir, param.prodmgr_Fname, param.prodmgr_Lname, param.IsDeleted);
            var dto = Mapper.Map<PageListDTO<ICollection<ProdMgrDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult Update(ProdMgrDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblProdMgr.Get(dto.id);

                if (model != null)
                {
                    model.prodmgr_Fname = dto.prodmgr_Fname;
                    model.prodmgr_Lname = dto.prodmgr_Lname;
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
        public JsonResult SaveNew(ProdMgrDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = new tbl_prodmgr();

                model.prodmgr_Fname = dto.prodmgr_Fname;
                model.prodmgr_Lname = dto.prodmgr_Lname;

                UnitOfWork.TblProdMgr.Add(model);

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
        //public JsonResult Delete(int id)
        //{
        //    bool succeeded = false;

        //    try
        //    {
        //        var model = UnitOfWork.TblProdMgr.Get(id);

        //        if (model != null)
        //        {
        //            UnitOfWork.TblProdMgr.Remove(model);
        //            UnitOfWork.Save();
        //            succeeded = true;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        succeeded = false;
        //    }
        //    return Json(succeeded, JsonRequestBehavior.AllowGet);
        //}
        public JsonResult Delete(int id)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblProdMgr.Get(id);

                if (model != null)
                {
                    model.IsDeleted = true;                    
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