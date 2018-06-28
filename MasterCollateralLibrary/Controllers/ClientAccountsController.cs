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
using NLog;

namespace MasterCollateralLibrary.Controllers
{
    [Authorize]
    public class ClientAccountsController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public ClientAccountsController()
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
            var data = UnitOfWork.TblAccount.Get(id);
            var dto = Mapper.Map<AccountDTO>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Find(AccountFindDTO param)
        {
            var data = UnitOfWork.TblAccount.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir, param.acct_name, param.acct_city, param.acct_state);
            var dto = Mapper.Map<PageListDTO<ICollection<AccountFindDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult Update(AccountDTO dto)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblAccount.Get(dto.id);

                if (model != null)
                {
                    model.acct_name = dto.acct_name;
                    model.acct_city = dto.acct_city;
                    model.acct_state = dto.acct_state;
                    model.acct_cntry = dto.acct_cntry;
                    model.acct_3code = dto.acct_3code;
                    model.acct_whrhs = dto.acct_whrhs;
                    model.acct_frght = dto.acct_frght;
                    model.acct_misc = dto.acct_misc;
                    model.acct_logstcs = dto.acct_logstcs;
                    model.acct_admin = dto.acct_admin;
                    model.acct_contract_start = dto.acct_contract_start;
                    model.acct_contract_end = dto.acct_contract_end;
                    model.acct_assoc = dto.acct_assoc;
                    model.acct_gpo_id = dto.acct_gpo_id;
                    model.acct_auth_dist_id = dto.acct_auth_dist_id;
                    model.acct_cat_id = dto.acct_cat_id;
                    model.acct_marketing_percent_fee = dto.acct_marketing_percent_fee;
                    model.acct_gpo_percent_fee = dto.acct_gpo_percent_fee;
                    model.acct_spif_percent_fee = dto.acct_spif_percent_fee;
                    model.acct_dist_street1 = dto.acct_dist_street1;
                    model.acct_dist_street2 = dto.acct_dist_street2;
                    model.acct_dist_city = dto.acct_dist_city;
                    model.acct_dist_state = dto.acct_dist_state;
                    model.acct_dist_zip = dto.acct_dist_zip;
                    model.acct_dist_country = dto.acct_dist_country;
                    model.acct_rep_id = dto.acct_rep_id;
                    model.acct_address = dto.acct_address;
                    model.acct_zip = dto.acct_zip;
                    model.acct_primary_contact_name = dto.acct_primary_contact_name;
                    model.acct_primary_contact_dept = dto.acct_primary_contact_dept;
                    model.acct_primary_contact_phone = dto.acct_primary_contact_phone;
                    model.acct_primary_contact_email = dto.acct_primary_contact_email;
                    model.acct_secondary_contact_name = dto.acct_secondary_contact_name;
                    model.acct_secondary_contact_dept = dto.acct_secondary_contact_dept;
                    model.acct_secondary_contact_phone = dto.acct_secondary_contact_phone;
                    model.acct_secondary_contact_email = dto.acct_secondary_contact_email;

                    UnitOfWork.Save();
                    succeeded = true;
                }
            }
            catch (Exception ex)
            {
                succeeded = false;
                _logger.Error(ex);
            }
            return Json(succeeded, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveNew(AccountDTO dto)
        {
            try
            {
                var model = new tbl_acct();

                model.acct_name = dto.acct_name;
                model.acct_city = dto.acct_city;
                model.acct_state = dto.acct_state;
                model.acct_cntry = dto.acct_cntry;
                model.acct_3code = dto.acct_3code;
                model.acct_whrhs = dto.acct_whrhs;
                model.acct_frght = dto.acct_frght;
                model.acct_misc = dto.acct_misc;
                model.acct_logstcs = dto.acct_logstcs;
                model.acct_admin = dto.acct_admin;
                model.acct_contract_start = dto.acct_contract_start;
                model.acct_contract_end = dto.acct_contract_end;
                model.acct_assoc = dto.acct_assoc;
                model.acct_gpo_id = dto.acct_gpo_id;
                model.acct_auth_dist_id = dto.acct_auth_dist_id;
                model.acct_cat_id = dto.acct_cat_id;
                model.acct_marketing_percent_fee = dto.acct_marketing_percent_fee;
                model.acct_gpo_percent_fee = dto.acct_gpo_percent_fee;
                model.acct_spif_percent_fee = dto.acct_spif_percent_fee;
                model.acct_dist_street1 = dto.acct_dist_street1;
                model.acct_dist_street2 = dto.acct_dist_street2;
                model.acct_dist_city = dto.acct_dist_city;
                model.acct_dist_state = dto.acct_dist_state;
                model.acct_dist_zip = dto.acct_dist_zip;
                model.acct_dist_country = dto.acct_dist_country;

                UnitOfWork.TblAccount.Add(model);

                UnitOfWork.Save();
                dto.id = model.id;
            }
            catch (Exception ex)
            {
                dto.id = 0;
                _logger.Error(ex);
            }
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult Delete(int id)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblAccount.Get(id);

                if (model != null)
                {
                    UnitOfWork.TblAccount.Remove(model);
                    UnitOfWork.Save();
                    succeeded = true;
                }
            }
            catch (Exception ex)
            {
                succeeded = false;
                _logger.Error(ex);
            }
            return Json(succeeded, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetBrands()
        {
            var data = UnitOfWork.TblBrand.GetAll()
                .OrderBy(t => t.brand_name)
                .ToList();

            var dto = Mapper.Map<IEnumerable<BrandDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetAccountCategories()
        {
            var data = UnitOfWork.TblAccountCategory.GetAll()
                .Where(t => t.cat_deleted == false)
                .OrderBy(t => t.cat_name)
                .ToList();
            var dto = Mapper.Map<IEnumerable<AccountCategoryDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult IsAccountCodeExists(string accountCode, int excludeId)
        {
            var result = false;

            try
            {
                result = UnitOfWork.TblAccount.IsAccountCodeExists(accountCode, excludeId);                    
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}