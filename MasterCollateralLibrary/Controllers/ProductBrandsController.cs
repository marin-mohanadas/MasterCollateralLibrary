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
    public class ProductBrandsController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;

        public ProductBrandsController()
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
        public JsonResult GetComponentEdit(int id)
        {
            var data = UnitOfWork.TblBrand.Get(id);
            var dto = Mapper.Map<BrandDTO>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Find(BrandFindDTO param)
        {
            var data = UnitOfWork.TblBrand.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir, param.brand_name, param.brand_city, param.brand_state, param.brand_zip);
            var dto = Mapper.Map<PageListDTO<ICollection<BrandFindDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult Update(BrandDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblBrand.Get(dto.id);

                if (model != null)
                {
                    model.brand_name = dto.brand_name;
                    model.brand_address1 = dto.brand_address1;
                    model.brand_address2 = dto.brand_address2;
                    model.brand_city = dto.brand_city;
                    model.brand_state = dto.brand_state;
                    model.brand_zip = dto.brand_zip;
                    model.brand_tel = dto.brand_tel;
                    model.brand_deleted = dto.brand_deleted;

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
        public JsonResult SaveNew(BrandDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = new tbl_brand();

                model.brand_name = dto.brand_name;
                model.brand_address1 = dto.brand_address1;
                model.brand_address2 = dto.brand_address2;
                model.brand_city = dto.brand_city;
                model.brand_state = dto.brand_state;
                model.brand_zip = dto.brand_zip;
                model.brand_tel = dto.brand_tel;

                UnitOfWork.TblBrand.Add(model);

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