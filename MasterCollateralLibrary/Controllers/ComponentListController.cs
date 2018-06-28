using AutoMapper;
using MasterCollateralLibrary.Extensions;
using MasterCollateralLibrary.Models;
using MCL.DTOs;
using MCL.DTOs.Users;
using MCL.EF.DAL;
using MCL.EF.DAL.Interfaces;
using MCL.EF.Model;
using Microsoft.AspNet.Identity.Owin;
using NLog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace MasterCollateralLibrary.Controllers
{
    //[Authorize]
    [CustomAuthorizeAttr]
    public class ComponentListController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;
        private static Logger _logger = LogManager.GetCurrentClassLogger();
        private ApplicationUserManager _userManager;

        public ComponentListController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
        }
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        //[Authorize(Roles = "ComponentMgr, Administrator")]        
        public ActionResult Index()
        {
            return View();
        }

        //[Authorize(Roles = "ComponentMgr, Administrator")]        
        public ActionResult Create()
        {
            return View();
        }

        //[Authorize(Roles = "ComponentMgr, Administrator")]        
        public ActionResult Edit(int id, string callbackMethod = "")
        {
            return View();
        }

        [HttpPost]
        public JsonResult Find(ComponentFindDTO param)
        {
            bool? aclOnly = null;

            //if (param.acl == 1)
            //{ aclOnly = true; }
            //if (param.acl == 0)
            //{ aclOnly = null; }

            if (param.acl.HasValue && !param.acl.Value) aclOnly = null;
            else aclOnly = param.acl;
            if (param.latex.HasValue && !param.latex.Value) param.latex = null;

            if (User.Identity.IsAuthenticated && User.IsInRole("SalesRep"))
                aclOnly = true;

            List<int> exceptionCompIDs = new List<int> { };
            if (aclOnly == true)
            {                
                if (param.acct_id.HasValue)
                {
                    var exceptionData = UnitOfWork.TblACLAccountExceptions.GetCompExecptionsByAccount((int)param.acct_id);
                    foreach (var row in exceptionData)
                    {
                        exceptionCompIDs.Add(row.comp_id);
                    }
                }
            }

            var data = UnitOfWork.TblComp.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir, param.descOrg, param.vendor, param.vendorPart,
                param.equiv, param.includeDeleted, param.desc, param.mfg, param.sterility, param.WildcardSearch,
                null, param.id, aclOnly, param.latex, exceptionCompIDs);
            var dto = Mapper.Map<PageListDTO<ICollection<ComponentVendorDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetComponentEdit(int id)
        {
            var data = UnitOfWork.TblComp.Get(id);
            var dto = Mapper.Map<ComponentCreateDTO>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        //[Authorize(Roles = "ComponentMgr, Administrator")]
        [HttpPost]
        public JsonResult Create(ComponentCreateDTO dto)
        {
            ComponentCreateDTO result = null;

            try
            {
                var entity = Mapper.Map<tbl_comp>(dto);

                if (entity != null)
                {
                    entity.tbl_vend = null;
                    entity.tbl_X_ref = null;
                    entity.tbl_X_ref_equiv = null;
                    entity.tbl_X_trait = null;
                    entity.tbl_X_material = null;
                    entity.tbl_X_spclty = null;
                    entity.tbl_lbl = null;
                    entity.tbl_pix = null;

                    UnitOfWork.TblComp.Add(entity);
                    UnitOfWork.Save();

                    if (dto.tbl_purch == null || dto.tbl_purch.Count == 0)
                    {
                        var purchase = new tbl_purch();
                        purchase.purch_comp_id = entity.id;
                        purchase.purch_date_create = DateTime.Now;
                        var usd = UnitOfWork.TblCurrency.Find(t => t.currncy_code == "USD").FirstOrDefault();
                        if (usd != null)
                            purchase.purch_currncy_id = usd.id;
                        UnitOfWork.TblPurchase.Add(purchase);
                        UnitOfWork.Save();
                    }

                    result = Mapper.Map<ComponentCreateDTO>(UnitOfWork.TblComp.Get(entity.id));
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                result = null;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult Update(int id, ComponentDTO dto)
        {
            bool result = false;

            try
            {
                var entity = UnitOfWork.TblComp.Get(dto.id);

                if (entity != null)
                {
                    entity.comp_vend_id = dto.comp_vend_id;
                    entity.comp_mfgr_id = dto.comp_mfgr_id;
                    entity.comp_vend_pn = dto.comp_vend_pn;
                    entity.comp_brand = dto.comp_brand;
                    entity.comp_desc_orig = dto.comp_desc_orig;
                    entity.comp_desc_noun = dto.comp_desc_noun;
                    entity.comp_desc_attrbt = dto.comp_desc_attrbt;
                    entity.comp_desc_adj = dto.comp_desc_adj;
                    entity.comp_desc_alt = dto.comp_desc_alt;
                    entity.comp_desc_kywrd = dto.comp_desc_kywrd;
                    entity.comp_desc_color = dto.comp_desc_color;
                    entity.comp_desc_side = dto.comp_desc_side;
                    entity.comp_size_imp = dto.comp_size_imp;
                    entity.comp_size_met = dto.comp_size_met;
                    entity.comp_coo_id = dto.comp_coo_id;
                    entity.comp_strlty = dto.comp_strlty;
                    entity.comp_status_id = dto.comp_status_id;
                    entity.comp_HS_code = dto.comp_HS_code;
                    entity.comp_moq = dto.comp_moq;
                    entity.comp_ERP_PN = dto.comp_ERP_PN;
                    entity.comp_npe = dto.comp_npe;
                    entity.comp_pm = dto.comp_pm;
                    entity.comp_source = dto.comp_source;
                    entity.x = dto.x;
                    //entity.comp_is_assembly = dto.comp_is_assembly;
                    entity.comp_pub_desc = dto.comp_pub_desc;
                    entity.comp_comments = dto.comp_comments;
                    entity.comp_temp_item = dto.comp_temp_item;
                    if (User.IsInRole("ACL Approver"))
                    {
                        entity.comp_acl = dto.comp_acl;
                    }
                    entity.comp_latex = dto.comp_latex;
                    entity.comp_deleted = dto.comp_deleted;
                    entity.comp_ship_size_uom = dto.comp_ship_size_uom;
                    entity.comp_ship_weight_uom = dto.comp_ship_weight_uom;
                    if (User.IsInRole("Administrator"))
                    {
                        entity.comp_use_vendor_contract = dto.comp_use_vendor_contract;
                    }
                    UnitOfWork.Save();

                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                result = false;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult Delete(int id)
        {
            bool result = false;

            try
            {
                var entity = UnitOfWork.TblComp.Get(id);

                if (entity != null)
                {
                    entity.comp_deleted = true;
                    UnitOfWork.Save();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                result = false;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Components(int pageSize, int pageNumber,
            string sortBy, string sortDir)
        {
            var data = UnitOfWork.TblComp.List(pageSize, pageNumber, sortBy, sortDir);
            var dto = Mapper.Map<PageListDTO<ICollection<ComponentDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Countries()
        {
            var data = UnitOfWork.TblCoo.GetAll()
                .OrderBy(t => t.coo_desc)
                .ToList();
            var dto = Mapper.Map<ICollection<CountryDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Sterilities()
        {
            var data = UnitOfWork.TblSterility.GetAll()
                .OrderBy(t => t.strlty_desc)
                .ToList();
            var dto = Mapper.Map<ICollection<SterilityDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Stats()
        {
            var data = UnitOfWork.TblStatus.GetAll()
                .Where(t => !t.stat_deleted)
                .OrderBy(t => t.stat_desc)
                .ToList();
            var dto = Mapper.Map<ICollection<StatDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ProdMgrs()
        {
            var data = UnitOfWork.TblProdMgr.GetAll()
                .OrderBy(t => t.prodmgr_Fname)
                .ThenBy(t => t.prodmgr_Lname)
                .Where(t => !t.IsDeleted)
                .ToList();
            var dto = Mapper.Map<ICollection<ProdMgrDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult CostTypes()
        {
            var data = UnitOfWork.TblCostType.GetAll()
                .Where(t => !t.cst_type_deleted)
                .OrderBy(t => t.cst_type_desc)
                .ToList();
            var dto = Mapper.Map<ICollection<CostTypeDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Uoms()
        {
            var data = UnitOfWork.TblUOM.GetAll()
                .OrderBy(t => t.uom_desc)
                .ToList();
            var dto = Mapper.Map<ICollection<UomDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult LifeCycles()
        {
            var data = UnitOfWork.TblLifeCycle.GetAll()
                .OrderBy(t => t.life_cycle_order)
                .ToList();
            var dto = Mapper.Map<ICollection<LifeCycleDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Traits()
        {
            var data = UnitOfWork.TblTrait.GetAll()
                .OrderBy(t => t.trait_desc)
                .ToList();
            var dto = Mapper.Map<ICollection<TraitDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Materials()
        {
            var data = UnitOfWork.TblMaterial.GetAll()
                .OrderBy(t => t.material_desc)
                .ToList();
            var dto = Mapper.Map<ICollection<MaterialDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Specialties()
        {
            var data = UnitOfWork.TblSpecialty.GetAll()
                .OrderBy(t => t.spclty_name)
                .ToList();
            var dto = Mapper.Map<ICollection<SpecialtyDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ComponentSources()
        {
            var data = new string[] { "", "Purchasing", "Product Managers" };
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Assemblies()
        {
            var data = UnitOfWork.TblComp.GetAssemblies();
            var dto = Mapper.Map<ICollection<ComponentDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DuplicatePurchase(PurchaseDTO dto)
        {
            PurchaseDTO result = null;

            try
            {
                var entity = Mapper.Map<tbl_purch>(dto);
                entity.id = 0;
                entity.tbl_comp = null;
                entity.tbl_cst_type = null;
                entity.tbl_currncy = null;
                entity.tbl_plant = null;

                UnitOfWork.TblPurchase.Add(entity);
                UnitOfWork.Save();
                result = Mapper.Map<PurchaseDTO>(entity);
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddPurchase(PurchaseDTO dto)
        {
            PurchaseDTO result = null;

            try
            {
                var entity = Mapper.Map<tbl_purch>(dto);

                if (entity != null)
                {
                    entity.purch_date_create = DateTime.Now;
                    UnitOfWork.TblPurchase.Add(entity);
                    UnitOfWork.Save();
                    result = Mapper.Map<PurchaseDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                result = null;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult UpdatePurchase(PurchaseDTO dto)
        {
            PurchaseDTO result = null;

            try
            {
                var entity = UnitOfWork.TblPurchase.Get(dto.id);

                if (entity != null)
                {
                    entity.purch_plant_id = dto.purch_plant_id;
                    entity.purch_aqsn_cost = dto.purch_aqsn_cost;
                    entity.purch_currncy_id = dto.purch_currncy_id;
                    entity.purch_puom = dto.purch_puom;
                    entity.purch_suom = dto.purch_suom;
                    entity.purch_uuom = dto.purch_uuom;
                    entity.purch_puom_qty = dto.purch_puom_qty;
                    entity.purch_suom_qty = dto.purch_suom_qty;
                    entity.purch_uuom_qty = dto.purch_uuom_qty;
                    entity.purch_VAT_refund = dto.purch_VAT_refund;
                    entity.purch_inbnd_fgt = dto.purch_inbnd_fgt;
                    entity.purch_import_duty = dto.purch_import_duty;
                    entity.purch_cost_type_id = dto.purch_cost_type_id;
                    entity.purch_eoq_min = dto.purch_eoq_min;
                    entity.purch_eoq_max = dto.purch_eoq_max;
                    entity.purch_cartn_lgt = dto.purch_cartn_lgt;
                    entity.purch_cartn_wdt = dto.purch_cartn_wdt;
                    entity.purch_cartn_hgt = dto.purch_cartn_hgt;
                    entity.purch_cartn_wgt = dto.purch_cartn_wgt;
                    entity.purch_lead_time = dto.purch_lead_time;
                    entity.purch_scrap = dto.purch_scrap;
                    entity.purch_expry = dto.purch_expry;
                    entity.purch_date_expry = dto.purch_date_expry;

                    UnitOfWork.Save();
                    result = Mapper.Map<PurchaseDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                result = null;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult RemovePurchase(int id)
        {
            bool result = false;
            try
            {
                var entity = UnitOfWork.TblPurchase.Get(id);

                if (entity != null)
                {
                    UnitOfWork.TblPurchase.Remove(entity);
                    UnitOfWork.Save();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddCrossRef(ComponentCrossRefDTO dto)
        {
            ComponentCrossRefDTO result = null;
            try
            {
                var entity = Mapper.Map<tbl_X_ref>(dto);

                if (entity != null
                    && entity.xref_comp_id != entity.xref_equiv_compid) // avoid self-ref
                {
                    entity.tbl_comp = null;
                    entity.tbl_comp_equiv = null;
                    entity.tbl_life_cycle = null;

                    UnitOfWork.TblXRef.Add(entity);
                    UnitOfWork.Save();
                    result = Mapper.Map<ComponentCrossRefDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult UpdateCrossRef(ComponentCrossRefDTO dto)
        {
            ComponentCrossRefDTO result = null;
            try
            {
                var entity = UnitOfWork.TblXRef.Get(dto.ID);

                if (entity != null)
                {
                    //entity.xref_comp_id = dto.xref_comp_id;
                    //entity.xref_equiv_compid = dto.xref_equiv_compid;
                    entity.xref_FE_priority = dto.xref_FE_priority;
                    entity.xref_exact = dto.xref_exact;
                    entity.xref_life_cycle_id = dto.xref_life_cycle_id;
                    entity.xref_notes = dto.xref_notes;

                    entity.tbl_comp = null;
                    entity.tbl_comp_equiv = null;
                    entity.tbl_life_cycle = null;

                    UnitOfWork.Save();
                    result = Mapper.Map<ComponentCrossRefDTO>(UnitOfWork.TblXRef.Get(dto.ID));
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult RemoveCrossRef(int id)
        {
            bool result = false;
            try
            {
                var entity = UnitOfWork.TblXRef.Get(id);

                if (entity != null)
                {
                    UnitOfWork.TblXRef.Remove(entity);
                    UnitOfWork.Save();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddCategory(ComponentCategoryDTO dto)
        {
            ComponentCategoryDTO result = null;
            try
            {
                var entity = Mapper.Map<tbl_X_cat>(dto);

                if (entity != null)
                {
                    entity.tbl_cat1 = null;
                    entity.tbl_cat2 = null;
                    entity.tbl_comp = null;

                    if (entity.cat_cat2_id == 0)
                    {
                        var cat2 = UnitOfWork.TblCategory2
                            .Find(t => t.cat1_id == entity.cat_cat1_id)
                            .FirstOrDefault();

                        if (cat2 != null)
                            entity.cat_cat2_id = cat2.id;
                    }

                    UnitOfWork.TblXCat.Add(entity);
                    UnitOfWork.Save();

                    result = Mapper.Map<ComponentCategoryDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult UpdateCategory(ComponentCategoryDTO dto)
        {
            ComponentCategoryDTO result = null;
            try
            {
                var entity = UnitOfWork.TblXCat.Get(dto.ID);

                if (entity != null)
                {
                    entity.cat_comp_id = dto.cat_comp_id;
                    entity.cat_cat1_id = dto.cat_cat1_id;
                    entity.cat_cat2_id = dto.cat_cat2_id;

                    entity.tbl_cat1 = null;
                    entity.tbl_cat2 = null;
                    entity.tbl_comp = null;

                    UnitOfWork.Save();

                    result = Mapper.Map<ComponentCategoryDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult RemoveCategory(int id)
        {
            bool result = false;
            try
            {
                var entity = UnitOfWork.TblXCat.Get(id);

                if (entity != null)
                {
                    UnitOfWork.TblXCat.Remove(entity);
                    UnitOfWork.Save();

                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddTrait(ComponentTraitDTO dto)
        {
            ComponentTraitDTO result = null;
            try
            {
                var entity = Mapper.Map<tbl_X_trait>(dto);

                if (entity != null)
                {
                    entity.tbl_trait = null;
                    entity.tbl_comp = null;

                    UnitOfWork.TblXTrait.Add(entity);
                    UnitOfWork.Save();

                    result = Mapper.Map<ComponentTraitDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult UpdateTrait(ComponentTraitDTO dto)
        {
            ComponentTraitDTO result = null;
            try
            {
                var entity = UnitOfWork.TblXTrait.Get(dto.ID);

                if (entity != null)
                {
                    entity.trait_comp_id = dto.trait_comp_id;
                    entity.trait_trait_id = dto.trait_trait_id;

                    entity.tbl_trait = null;
                    entity.tbl_comp = null;

                    UnitOfWork.Save();

                    result = Mapper.Map<ComponentTraitDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult RemoveTrait(int id)
        {
            bool result = false;
            try
            {
                var entity = UnitOfWork.TblXTrait.Get(id);

                if (entity != null)
                {
                    UnitOfWork.TblXTrait.Remove(entity);
                    UnitOfWork.Save();

                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddMaterial(ComponentMaterialDTO dto)
        {
            ComponentMaterialDTO result = null;
            try
            {
                var entity = Mapper.Map<tbl_X_material>(dto);

                if (entity != null)
                {
                    entity.tbl_material = null;
                    entity.tbl_comp = null;

                    UnitOfWork.TblXMaterial.Add(entity);
                    UnitOfWork.Save();

                    result = Mapper.Map<ComponentMaterialDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult UpdateMaterial(ComponentMaterialDTO dto)
        {
            ComponentMaterialDTO result = null;
            try
            {
                var entity = UnitOfWork.TblXMaterial.Get(dto.ID);

                if (entity != null)
                {
                    entity.material_comp_id = dto.material_comp_id;
                    entity.material_material_id = dto.material_material_id;
                    entity.material_primary = dto.material_primary;

                    entity.tbl_material = null;
                    entity.tbl_comp = null;

                    UnitOfWork.Save();

                    result = Mapper.Map<ComponentMaterialDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult RemoveMaterial(int id)
        {
            bool result = false;
            try
            {
                var entity = UnitOfWork.TblXMaterial.Get(id);

                if (entity != null)
                {
                    UnitOfWork.TblXMaterial.Remove(entity);
                    UnitOfWork.Save();

                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddSpecialty(ComponentSpecialtyDTO dto)
        {
            ComponentSpecialtyDTO result = null;
            try
            {
                var entity = Mapper.Map<tbl_X_spclty>(dto);

                if (entity != null)
                {
                    entity.tbl_spclty = null;
                    entity.tbl_comp = null;

                    UnitOfWork.TblXSpecialty.Add(entity);
                    UnitOfWork.Save();

                    result = Mapper.Map<ComponentSpecialtyDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult UpdateSpecialty(ComponentSpecialtyDTO dto)
        {
            ComponentSpecialtyDTO result = null;
            try
            {
                var entity = UnitOfWork.TblXSpecialty.Get(dto.ID);

                if (entity != null)
                {
                    entity.spclty_comp_id = dto.spclty_comp_id;
                    entity.spclty_spclty_id = dto.spclty_spclty_id;

                    entity.tbl_spclty = null;
                    entity.tbl_comp = null;

                    UnitOfWork.Save();

                    result = Mapper.Map<ComponentSpecialtyDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult RemoveSpecialty(int id)
        {
            bool result = false;
            try
            {
                var entity = UnitOfWork.TblXSpecialty.Get(id);

                if (entity != null)
                {
                    UnitOfWork.TblXSpecialty.Remove(entity);
                    UnitOfWork.Save();

                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddLabel(ComponentLabelDTO dto)
        {
            ComponentLabelDTO result = null;
            try
            {
                var entity = Mapper.Map<tbl_lbl>(dto);

                if (entity != null)
                {
                    entity.tbl_lang = null;
                    entity.tbl_comp = null;

                    UnitOfWork.TblLabel.Add(entity);
                    UnitOfWork.Save();

                    result = Mapper.Map<ComponentLabelDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult UpdateLabel(ComponentLabelDTO dto)
        {
            ComponentLabelDTO result = null;
            try
            {
                var entity = UnitOfWork.TblLabel.Get(dto.id);

                if (entity != null)
                {
                    entity.lbl_comp_id = dto.lbl_comp_id;
                    entity.lbl_lang_id = dto.lbl_lang_id;
                    entity.lbl_desc = dto.lbl_desc;

                    entity.tbl_lang = null;
                    entity.tbl_comp = null;

                    UnitOfWork.Save();

                    result = Mapper.Map<ComponentLabelDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult RemoveLabel(int id)
        {
            bool result = false;
            try
            {
                var entity = UnitOfWork.TblLabel.Get(id);

                if (entity != null)
                {
                    UnitOfWork.TblLabel.Remove(entity);
                    UnitOfWork.Save();

                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //[HttpPost]
        //public JsonResult AddPix(ComponentPixDTO dto)
        //{
        //    ComponentPixDTO result = null;
        //    try
        //    {
        //        var entity = Mapper.Map<tbl_pix>(dto);

        //        if (entity != null)
        //        {                    
        //            UnitOfWork.TblPix.Add(entity);
        //            UnitOfWork.Save();

        //            result = Mapper.Map<ComponentPixDTO>(entity);
        //        }
        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //    return Json(result, JsonRequestBehavior.AllowGet);
        //}

        //[HttpPut]
        //public JsonResult UpdatePix(ComponentPixDTO dto)
        //{
        //    ComponentPixDTO result = null;
        //    try
        //    {
        //        var entity = UnitOfWork.TblPix.Get(dto.id);

        //        if (entity != null)
        //        {                    
        //            entity.pix_desc = dto.pix_desc;                    
        //            UnitOfWork.Save();

        //            result = Mapper.Map<ComponentPixDTO>(entity);
        //        }
        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //    return Json(result, JsonRequestBehavior.AllowGet);
        //}

        [HttpPost]
        public JsonResult UploadPix(HttpPostedFileBase file, ComponentPixDTO dto)
        {
            ComponentPixDTO result = null;

            try
            {
                var extension = file != null ? Path.GetExtension(file.FileName) : "";
                string path = System.Web.HttpContext.Current.Server.MapPath("~/Content/componentPix");

                var entity = UnitOfWork.TblPix.Get(dto.id);

                if (entity == null)
                {
                    entity = Mapper.Map<tbl_pix>(dto);
                    entity.id = 0;
                }

                if (file != null && file.ContentLength > 0 && entity.id == 0)
                {
                    // create
                    entity.pix_pix = extension;
                    UnitOfWork.TblPix.Add(entity);
                    UnitOfWork.Save();

                    result = Mapper.Map<ComponentPixDTO>(entity);
                    string filename = Path.Combine(path, string.Format("{0}{1}", entity.id, extension));
                    file.SaveAs(filename);
                }
                else if (entity.id > 0)
                {
                    // update
                    entity.pix_desc = dto.pix_desc;

                    if (file != null && file.ContentLength > 0)
                    {
                        entity.pix_pix = extension;

                        // delete existing
                        if (System.IO.File.Exists(Path.Combine(path, string.Format("{0}{1}", dto.id, dto.pix_pix))))
                            System.IO.File.Delete(Path.Combine(path, string.Format("{0}{1}", dto.id, dto.pix_pix)));

                        string filename = Path.Combine(path, string.Format("{0}{1}", entity.id, extension));
                        file.SaveAs(filename);
                    }

                    UnitOfWork.Save();
                    result = Mapper.Map<ComponentPixDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                result = null;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult RemovePix(int id)
        {
            bool result = false;
            try
            {
                var entity = UnitOfWork.TblPix.Get(id);

                if (entity != null)
                {
                    UnitOfWork.TblPix.Remove(entity);
                    UnitOfWork.Save();

                    // delete existing
                    string path = System.Web.HttpContext.Current.Server.MapPath("~/Content/componentPix");

                    if (System.IO.File.Exists(Path.Combine(path, string.Format("{0}{1}", id, entity.pix_pix))))
                        System.IO.File.Delete(Path.Combine(path, string.Format("{0}{1}", id, entity.pix_pix)));

                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetByCatgoryId(int id)
        {
            var data = UnitOfWork.TblComp.GetByCategoryId(id);
            var dto = Mapper.Map<ICollection<ComponentDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetExchRate()
        {
            var data = UnitOfWork.TblExchRatesUSD.GetRates().First();
            var dto = Mapper.Map<ExchRatesDTO>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SetCategoryId(ComponentDTO data)
        {
            bool result = false;

            try
            {
                var entity = UnitOfWork.TblComp.Get(data.id);

                if (entity != null)
                {
                    if (entity.comp_cat_id != data.comp_cat_id)
                    {
                        var equiv = UnitOfWork.TblXRef.GetAllEquivByCompId(data.id);
                        if (equiv != null && equiv.Count() > 0)
                        {
                            UnitOfWork.TblXRef.RemoveRange(equiv);
                            UnitOfWork.Save();
                        }
                        entity.comp_cat_id = data.comp_cat_id;
                        UnitOfWork.Save();
                    }
                    result = true;
                }
            }
            catch (Exception ex)
            {
                result = false;
                _logger.Error(ex);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SetCrossRef(ComponentCrossRefDTO dto)
        {
            ComponentCrossRefDTO result = null;

            try
            {
                var entity = UnitOfWork.TblXRef.Get(dto.ID);

                if (entity == null)
                {
                    // create
                    entity = Mapper.Map<tbl_X_ref>(dto);
                    entity.tbl_comp = null;
                    entity.tbl_comp_equiv = null;
                    entity.tbl_life_cycle = null;
                    UnitOfWork.TblXRef.Add(entity);
                    UnitOfWork.Save();
                    result = Mapper.Map<ComponentCrossRefDTO>(entity);
                    result.tbl_comp_equiv = Mapper.Map<ComponentDTO>(UnitOfWork.TblComp.Get(entity.xref_equiv_compid));
                }
                else
                {
                    // update
                    entity.xref_exact = dto.xref_exact;
                    entity.xref_life_cycle_id = dto.xref_life_cycle_id;
                    entity.xref_FE_priority = dto.xref_FE_priority;
                    entity.xref_notes = dto.xref_notes;
                    UnitOfWork.Save();
                    result = Mapper.Map<ComponentCrossRefDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                result = null;
                _logger.Error(ex);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult IsExist(ComponentCheckExistDTO dto)
        {
            bool result = false;

            try
            {
                result = UnitOfWork.TblComp.
                    IsExist(dto.comp_vend_id, dto.comp_vend_pn, dto.id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult RequestNewItem(ComponentCreateDTO dto)
        {
            ComponentCreateDTO result = null;

            try
            {
                var entity = Mapper.Map<tbl_comp>(dto);

                if (entity != null)
                {
                    entity.comp_temp_item = true;
                    entity.tbl_vend = null;
                    entity.tbl_X_ref = null;
                    entity.tbl_X_ref_equiv = null;
                    entity.tbl_X_trait = null;
                    entity.tbl_X_material = null;
                    entity.tbl_X_spclty = null;
                    entity.tbl_lbl = null;
                    entity.tbl_pix = null;

                    UnitOfWork.TblComp.Add(entity);
                    UnitOfWork.Save();

                    if (dto.tbl_purch == null || dto.tbl_purch.Count == 0)
                    {
                        var purchase = new tbl_purch();
                        purchase.purch_comp_id = entity.id;
                        purchase.purch_date_create = DateTime.Now;
                        var usd = UnitOfWork.TblCurrency.Find(t => t.currncy_code == "USD").FirstOrDefault();
                        if (usd != null)
                            purchase.purch_currncy_id = usd.id;
                        UnitOfWork.TblPurchase.Add(purchase);
                        UnitOfWork.Save();
                    }

                    result = Mapper.Map<ComponentCreateDTO>(UnitOfWork.TblComp.Get(entity.id));
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                result = null;
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
        [HttpPost]
        public JsonResult RequestACLApproval(string quoteQN, string quoteID, string requestReason, ComponentCreateDTO modal)
        {
            ComponentCreateDTO result = null;
            var requestUser = User.Identity.Name;

            var emailDTO = new { compDTO = modal, requestUser = requestUser, quoteQN = quoteQN, quoteID = quoteID, requestReason = requestReason };
            string aclApproverList = GetUsersInRole("9");

            try
            {
                try
                {
                    var email = new EmailController();
                    var message = new EmailModels();
                    message.To = aclApproverList;
                    message.Subject = string.Format("ACL Approval Request Component {0}", modal.id);
                    Task.Run(() => email.Send(message, null, emailDTO, "componentACLApprovalRequest.html"));
                }
                catch (Exception ex)
                {
                    _logger.Error(string.Format("Email Send Error: {0}", ex.ToString()));
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                result = null;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        private string GetUsersInRole(string roleID)
        {
            var query = UserManager.Users.AsQueryable();
            query = query.Where(u => u.Roles.Select(r => r.RoleId).Contains(roleID));

            int total = query.Count();

            var data = query
                .Select(t => new UserLiteDTO
                {
                    Id = t.Id,
                    Email = t.Email
                }).ToList();

            string userlist = "";
            foreach (UserLiteDTO user in data)
            {
                userlist += user.Email + ";";
            }

            return userlist;
        }
        [HttpPost]
        public JsonResult SendACLApprovalNotification(string compID, string requester, string quoteQN, string quoteID)
        {
            string result = null;
            ComponentFindDTO param = new ComponentFindDTO();
            param.id = Convert.ToInt32(compID);
            var comp_data = UnitOfWork.TblComp.Get(Convert.ToInt32(compID));

            var emailDTO = new { compID = compID, comp_data = comp_data, quoteQN = quoteQN, quoteID = quoteID };
            string aclApproverList = GetUsersInRole("9");
            try
            {
                try
                {
                    var email = new EmailController();
                    var message = new EmailModels();
                    message.To = requester;
                    message.CC = aclApproverList;
                    message.Subject = string.Format("ACL request approved for Vendor Part Number {0}", comp_data.comp_vend_pn);
                    Task.Run(() => email.Send(message, null, emailDTO, "componentACLApprovalNotification.html"));
                }
                catch (Exception ex)
                {
                    _logger.Error(string.Format("Email Send Error: {0}", ex.ToString()));
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                result = null;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SendACLRejectionNotification(string compID, string requester, string quoteQN, string quoteID, string rejectReason)
        {
            string result = null;
            ComponentFindDTO param = new ComponentFindDTO();
            param.id = Convert.ToInt32(compID);
            var comp_data = UnitOfWork.TblComp.Get(Convert.ToInt32(compID));
            var formattedRejectReason = rejectReason.Replace("\n", Environment.NewLine);
            var emailDTO = new { compID = compID, comp_data = comp_data, quoteQN = quoteQN, quoteID = quoteID, rejectReason = formattedRejectReason };
            string aclApproverList = GetUsersInRole("9");
            try
            {
                try
                {
                    var email = new EmailController();
                    var message = new EmailModels();
                    message.To = requester;
                    message.CC = aclApproverList;
                    message.Subject = string.Format("ACL request rejected for Vendor Part Number {0}", comp_data.comp_vend_pn);
                    Task.Run(() => email.Send(message, null, emailDTO, "componentACLRejectionNotification.html"));
                }
                catch (Exception ex)
                {
                    _logger.Error(string.Format("Email Send Error: {0}", ex.ToString()));
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                result = null;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetACLExceptions(int id)
        {
            var data = UnitOfWork.TblACLAccountExceptions.GetAccountsWithExceptionsByCompID(id);
            var dto = Mapper.Map<ICollection<ComponentACLExceptionDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult AddACLExceptions(ICollection<ComponentACLExceptionDTO> model)
        {
            ComponentACLExceptionDTO result = new ComponentACLExceptionDTO();
            foreach(ComponentACLExceptionDTO row in model)
            {
                try
                {
                    var entity = Mapper.Map<tbl_ACLAccountExceptions>(result);

                    entity.comp_id = row.comp_id;
                    entity.account_id = row.account_id;
                    if (entity.expiration_date != null)
                    {
                        entity.expiration_date = Convert.ToDateTime(row.expiration_date);
                    }
                    else
                    {
                        entity.expiration_date = System.DateTime.Now;
                    }
                    UnitOfWork.TblACLAccountExceptions.Add(entity);
                    UnitOfWork.Save();
                    result = Mapper.Map<ComponentACLExceptionDTO>(entity);

                }
                catch (Exception ex)
                {
                    _logger.Error(ex);
                    result = null;
                }
            }            
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult RemoveACLExceptions(int id)
        {
            bool result = false;
            try
            {
                var entity = UnitOfWork.TblACLAccountExceptions.Get(id);

                if (entity != null)
                {
                    entity.deleted = true;
                    UnitOfWork.Save();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                result = false;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UpdateACLExceptions(ComponentACLExceptionDTO dto)
        {
            bool result = false;
            try
            {
                var entity = UnitOfWork.TblACLAccountExceptions.Get(dto.id);

                if (entity != null)
                {
                    entity.expiration_date = Convert.ToDateTime(dto.expiration_date);
                    UnitOfWork.Save();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                result = false;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
