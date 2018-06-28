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
    public class SalesRepsController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;

        public SalesRepsController()
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
        public JsonResult GetRepEdit(int id)
        {
            var data = UnitOfWork.TblRep.Get(id);
            var dto = Mapper.Map<RepDTO>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Find(RepFindDTO param)
        {
            var data = UnitOfWork.TblRep.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir, param.rep_fname, param.rep_lname);
            var dto = Mapper.Map<PageListDTO<ICollection<RepFindDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult Update(RepDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblRep.Get(dto.id);

                if (model != null)
                {
                    model.rep_fname = dto.rep_fname;
                    model.rep_lname = dto.rep_lname;
                    model.rep_title = dto.rep_title;
                    model.rep_phone = dto.rep_phone;
                    model.rep_mobile = dto.rep_mobile;
                    model.rep_email = dto.rep_email;
                    model.rep_address1 = dto.rep_address1;
                    model.rep_address2 = dto.rep_address2;
                    model.rep_city = dto.rep_city;
                    model.rep_state = dto.rep_state;
                    model.rep_zip = dto.rep_zip;
                    model.rep_country = dto.rep_country;
                    model.rep_company = dto.rep_company;
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
        public JsonResult SaveNew(RepDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = new tbl_rep();

                model.rep_fname = dto.rep_fname;
                model.rep_lname = dto.rep_lname;
                model.rep_title = dto.rep_title;
                model.rep_phone = dto.rep_phone;
                model.rep_mobile = dto.rep_mobile;
                model.rep_email = dto.rep_email;
                model.rep_address1 = dto.rep_address1;
                model.rep_address2 = dto.rep_address2;
                model.rep_city = dto.rep_city;
                model.rep_state = dto.rep_state;
                model.rep_zip = dto.rep_zip;
                model.rep_country = dto.rep_country;
                model.rep_company = dto.rep_company;

                UnitOfWork.TblRep.Add(model);

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
                var model = UnitOfWork.TblRep.Get(id);

                if (model != null)
                {
                    UnitOfWork.TblRep.Remove(model);
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