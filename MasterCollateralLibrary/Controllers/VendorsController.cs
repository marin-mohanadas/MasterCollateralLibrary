using AutoMapper;
using MCL.DTOs;
using MCL.EF.DAL;
using MCL.EF.DAL.Interfaces;
using MCL.EF.Model;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace MasterCollateralLibrary.Controllers
{
    [Authorize]
    public class VendorsController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public VendorsController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
        }

        // GET: Vendors
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult Vendors()
        {
            var data = UnitOfWork.TblVendor.GetAll()
                .OrderBy(t => t.vend_parent_name)
                .ToList();
            var dto = Mapper.Map<ICollection<VendorDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Find(int pageSize, int pageNumber,
            string sortBy, string sortDir)
        {
            var data = UnitOfWork.TblVendor.List(pageSize, pageNumber, sortBy, sortDir);
            var dto = Mapper.Map<PageListDTO<ICollection<VendorDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Get(int id)
        {
            var data = UnitOfWork.TblVendor.Get(id);
            var dto = Mapper.Map<VendorCreateDTO>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetVendorComponents(int id, FindBaseDTO find)
        {
            var data = UnitOfWork.TblComp.Find(find.PageSize, find.PageNumber, 
                find.SortBy, find.SortDir, "", "", "", "", false, "", "", "", "", id);

            var dto = Mapper.Map<PageListDTO<IEnumerable<ComponentLiteDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Save(VendorCreateDTO dto)
        {
            VendorCreateDTO result = null;

            try
            {
                var entity = UnitOfWork.TblVendor.Get(dto.id);

                if (entity == null)
                {                    
                    entity = new tbl_vend();
                    entity.id = 0;
                }

                entity.vend_child_name = dto.vend_child_name;
                entity.vend_label_name = dto.vend_label_name;
                entity.vend_memo = dto.vend_memo;
                entity.vend_parent_name = dto.vend_parent_name;
                entity.vend_street1 = dto.vend_street1;
                entity.vend_street2 = dto.vend_street2;
                entity.vend_city = dto.vend_city;
                entity.vend_state = dto.vend_state;
                entity.vend_zip = dto.vend_zip;
                entity.vend_country = dto.vend_country;                

                if (entity.id > 0)
                {
                    UnitOfWork.Save();                                       
                }
                else
                {
                    UnitOfWork.TblVendor.Add(entity);
                    UnitOfWork.Save();            
                }

                if (dto.tbl_vendDtl != null && dto.tbl_vendDtl.Count > 0)
                {
                    foreach (var dtl in dto.tbl_vendDtl)
                    {
                        var d = UnitOfWork.TblVendorDtl
                            .Find(t => t.id == dtl.id && t.vendDtl_vend_id == entity.id)
                            .FirstOrDefault();

                        if (d == null)
                        {
                            d = new tbl_vendDtl();
                            d.id = 0;                            
                        }

                        if (d.vendDtl_vend_id == 0)
                            d.vendDtl_vend_id = entity.id;

                        d.vendDtl_conct_lname = dtl.vendDtl_conct_lname;
                        d.vendDtl_conct_fname = dtl.vendDtl_conct_fname;
                        d.vendDtl_conct_email = dtl.vendDtl_conct_email;
                        d.vendDtl_conct_phone = dtl.vendDtl_conct_phone;
                        d.vendDtl_conct_mobile = dtl.vendDtl_conct_mobile;
                        d.vendDtl_conct_notes = dtl.vendDtl_conct_notes;                        

                        if (d.id > 0)
                            UnitOfWork.Save();
                        else
                        {
                            UnitOfWork.TblVendorDtl.Add(d);
                            UnitOfWork.Save();
                        }
                    }
                }

                var saved = UnitOfWork.TblVendor.Get(entity.id);
                if (saved != null)
                    result = Mapper.Map<VendorCreateDTO>(saved);                
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
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