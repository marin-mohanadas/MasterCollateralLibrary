using AutoMapper;
using ClosedXML.Excel;
using MasterCollateralLibrary.Extensions;
using MasterCollateralLibrary.Models;
using MCL.DTOs;
using MCL.DTOs.Quote;
using MCL.EF;
using MCL.EF.DAL;
using MCL.EF.DAL.Interfaces;
using MCL.EF.Model;
using MCL.Services;
using MCL.Services.Extensions;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace MasterCollateralLibrary.Controllers
{
    [CustomAuthorizeAttr]
    public class QuoteMasterController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;
        protected readonly IQuoteService QuoteService;

        private static Logger _logger = LogManager.GetCurrentClassLogger();

        private ApplicationUserManager _userManager;
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

        public QuoteMasterController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
            QuoteService = new QuoteService(UnitOfWork);
        }

        // GET: QuoteMaster
        public ActionResult Index()
        {
            return View();
        }

        // GET: QuoteMaster/Create
        public ActionResult Create()
        {
            return View();
        }

        public ActionResult Edit(int id)
        {

            return View();
        }



        [HttpPost]
        public JsonResult Find(QuoteFindDTO param)
        {
            int? repId = null;

            if (User.Identity.IsAuthenticated && User.IsInRole("SalesRep"))
            {
                var claims = UserManager.GetClaims(User.Identity.GetUserId());

                if (claims != null && claims.Count > 0)
                {
                    var rep = claims.FirstOrDefault(t => t.Type == "salesrep_id");
                    if (rep != null) 
                    {
                        var num = 0;
                        if (int.TryParse(rep.Value, out num))                        
                            repId = num;
                    }
                }
            }

            var data = UnitOfWork.TblQtHdr.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir, param.name, param.acct_name, param.rev, 
                param.includeDeleted, param.WildcardSearch, param.rep, param.acct_id, 
                param.tray_no, param.id, param.qn_basis, null, param.fg_num, false, repId, param.qtstatus_desc);

            var dto = Mapper.Map<PageListDTO<ICollection<QuoteHdrDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult FindApprovalQuotes(QuoteFindDTO param)
        {
            var data = UnitOfWork.TblQtHdr.Find(param.PageSize, param.PageNumber,
                param.SortBy, param.SortDir, param.name, param.acct_name, param.rev,
                param.includeDeleted, param.WildcardSearch, param.rep, param.acct_id, param.tray_no, param.id, null, param.qcApproval);
            var dto = Mapper.Map<PageListDTO<ICollection<QuoteHdrDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetQuoteEdit(int id)
        {
            int? repId = null;
            if (User.Identity.IsAuthenticated && User.IsInRole("SalesRep"))
                repId = UserManager.GetSalesRepIdByUserId(User.Identity.GetUserId());                            

            var data = UnitOfWork.TblQtHdr.Get(id);
            QuoteCreateDTO dto = null;
            if (repId == null || repId == data.qthdr_rep_id)
                dto = Mapper.Map<QuoteCreateDTO>(data);
            else
                _logger.Debug($"repId {repId} does not have permission to view quote {data.id}");
                        
            return Json(dto, JsonRequestBehavior.AllowGet);
        }
        
        

        [HttpPut]
        public JsonResult Update(int id, QuoteHdrDTO dto)
        {
            bool result = false;
            try
            {
                var entity = UnitOfWork.TblQtHdr.Get(dto.id);

                int? repId = null;
                if (User.Identity.IsAuthenticated && User.IsInRole("SalesRep"))
                    repId = UserManager.GetSalesRepIdByUserId(User.Identity.GetUserId());

                if (repId != null && entity != null && repId != entity.qthdr_rep_id)
                {
                    result = false;
                }
                else if (entity != null)
                {
                    double quoteExchangeRate = 1;
                    if (entity.qthdr_sell_crncy != dto.qthdr_sell_crncy && entity.qthdr_sell_crncy != null)
                    {
                        quoteExchangeRate = (double)(UnitOfWork.TblCurrency.Get(dto.qthdr_sell_crncy.Value).currncy_rate / UnitOfWork.TblCurrency.Get((int)entity.qthdr_sell_crncy).currncy_rate);
                        entity.qthdr_sell_price = dto.qthdr_sell_price / quoteExchangeRate;
                    }
                    else
                    {                        
                        entity.qthdr_sell_price = dto.qthdr_sell_price;
                    }

                    entity.qthdr_name = dto.qthdr_name;
                    //entity.qthdr_acct_id = dto.qthdr_acct_id;
                    //entity.qthdr_lang_id = dto.qthdr_lang_id;
                    entity.qthdr_amu = dto.qthdr_amu;
                    //entity.qthdr_memo = dto.qthdr_memo;
                    entity.qthdr_instr = dto.qthdr_instr;
                    entity.qthdr_rep_id = dto.qthdr_rep_id;
                    entity.qthdr_cs_qty = dto.qthdr_cs_qty;
                    //entity.qthdr_HS_code = dto.qthdr_HS_code;
                    entity.qthdr_plant_id = dto.qthdr_plant_id;
                    entity.qthdr_brand_id = dto.qthdr_brand_id;
                    entity.qthdr_formula_id = dto.qthdr_formula_id;
                    entity.qthdr_sterility = dto.qthdr_sterility;
                    entity.qthdr_sterility_mthd = dto.qthdr_sterility_mthd;
                    entity.qthdr_sell_crncy = dto.qthdr_sell_crncy;
                    entity.qthdr_box_id = dto.qthdr_box_id;
                    entity.qthdr_status_id = dto.qthdr_status_id;                    
                    entity.qthdr_fg_num = dto.qthdr_fg_num;
                   // entity.qthdr_newAwardFinalMfgCost = dto.qthdr_newAwardFinalMfgCost;
                    //entity.qthdr_lock = dto.qthdr_lock;
                    //entity.qthdr_mar = dto.qthdr_mar;
                    if (User.IsInRole("Administrator") || User.IsInRole("TrayEngineer"))
                    {
                        entity.qthdr_tray_no = dto.qthdr_tray_no;
                    }
                    
                    entity.qthdr_margin = dto.qthdr_margin;
                    entity.qthdr_qcApproval = dto.qthdr_qcApproval;

                    //01.18.2018 - Trinity - Added ability to update qthdr_date_update with today's date (individual component line edit sends here as well)
                    entity.qthdr_date_update = DateTime.Today;
                    if (dto.qthdr_status_id == 8)
                    {
                        try
                        {
                            var email = new EmailController();
                            var message = new EmailModels();
                            message.To = dto.tbl_rep.rep_email;

                            message.Subject = string.Format("Quote {0} has been confirmed", dto.qthdr_qn_basis + "-" + dto.qthdr_rev);
                           // message.Body = string.Format("{0}{1}<a href={2}>Please click this link to view</a>", message.Subject, Environment.NewLine, System.Configuration.ConfigurationManager.AppSettings["SiteURL"] + "/QuoteMaster/Edit/" + dto.id);

                            Task.Run(() => email.Send(message, null, dto, "quoteConfirmRepEmail.html"));
                            //Task.Run(() => email.Send(message));
                        }
                        catch(Exception ex)
                        {
                            _logger.Error(string.Format("Email Send Error: {0}", ex.ToString()));
                        }

                    }
                    UnitOfWork.Save();
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

        [HttpDelete]
        public JsonResult Delete(int id)
        {
            bool result = false;

            try
            {
                var entity = UnitOfWork.TblQtHdr.Get(id);

                int? repId = null;
                if (User.Identity.IsAuthenticated && User.IsInRole("SalesRep"))
                    repId = UserManager.GetSalesRepIdByUserId(User.Identity.GetUserId());

                if (repId != null && entity != null && repId != entity.qthdr_rep_id)
                {
                    result = false;
                }
                else if (entity != null)
                {
                    entity.qthdr_deleted = true;
                    UnitOfWork.Save();
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

        [HttpGet]
        public JsonResult Languages()
        {
            var data = UnitOfWork.TblLang.GetAll()
                .OrderBy(t => t.lang_desc_en)
                .ToList();
            var dto = Mapper.Map<ICollection<LangDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AllowAnonymous]
        public JsonResult MfgPlants()
        {
            var data = UnitOfWork.TblPlant.GetAll()
                .Where(t => !t.plant_deleted)
                .OrderBy(t => t.plant_name)
                .ToList();
            var dto = Mapper.Map<ICollection<PlantDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult HsCodes()
        {
            var data = UnitOfWork.TblHScode.GetAll()
                .OrderBy(t => t.HS_code)
                .ToList();
            var dto = Mapper.Map<ICollection<HScodeDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult SalesReps()
        {
            var data = UnitOfWork.TblRep.GetAll()
                .OrderBy(t => t.rep_fname)
                .ThenBy(t => t.rep_lname)
                .ToList();
            var dto = Mapper.Map<ICollection<RepDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetSalesRep(int id)
        {
            var data = UnitOfWork.TblRep.Get(id);
            var dto = Mapper.Map<RepDTO>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult SterilizationMethods()
        {
            var data = new string[] { "ETO", "Gamma", "E-Beam" };
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Formulas()
        {
            var data = UnitOfWork.TblFormula.GetAll()
                .Where(t => !t.formula_deleted)
                .OrderBy(t => t.formula_name)
                .ToList();
            var dto = Mapper.Map<ICollection<FormulaDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult FormulasByPlantId(int id)
        {
            var data = UnitOfWork.TblFormula.GetAll()
                .Where(t => !t.formula_deleted && t.formula_locn == id)
                .OrderBy(t => t.formula_name)
                .ToList();
            var dto = Mapper.Map<ICollection<FormulaDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Brands()
        {
            var data = UnitOfWork.TblBrand.GetAll()
                .Where(t => !t.brand_deleted)
                .OrderBy(t => t.brand_name)
                .ToList();
            var dto = Mapper.Map<ICollection<BrandFindDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }
        
        [HttpGet]
        [AllowAnonymous]
        public JsonResult SellCurrency()
        {
            var data = UnitOfWork.TblCurrency.GetAll()
                .Where(t => !t.currncy_deleted)
                .OrderBy(t => t.currncy_name)
                .ToList();
            var dto = Mapper.Map<ICollection<CurrencyDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Boxes()
        {
            var data = UnitOfWork.TblBox.GetAll()
                .OrderBy(t => t.box_desc)
                .ToList();
            var dto = Mapper.Map<ICollection<BoxDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult QuoteStatuses()
        {
            var data = UnitOfWork.TblQtStatus.GetAll()
                .OrderBy(t => t.qtstatus_order)
                .ToList();            
            var dto = Mapper.Map<ICollection<QuoteStatusDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetQuoteDetails(int id)
        {
            var data = UnitOfWork.TblQtDtl.GetByQtHdrIdWithComponent(id);
            var dto = Mapper.Map<ICollection<QuoteDetailDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Quotes(int pageSize, int pageNumber,
            string sortBy, string sortDir)
        {
            var data = UnitOfWork.TblQtHdr.List(pageSize, pageNumber, sortBy, sortDir);
            var dto = Mapper.Map<PageListDTO<ICollection<QuoteHdrDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetOriginalQuotesByAccountId(int id)
        {
            var data = UnitOfWork.TblQtHdr
                .GetOriginalsByAccountId(id);
            var dto = Mapper.Map<ICollection<QuoteHdrDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetRevQuotesByParentId(int id)
        {
            var data = UnitOfWork.TblQtHdr
                .GetRevsByParentId(id);
            var dto = Mapper.Map<ICollection<QuoteHdrDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetTempQuotesByAccountId(int id)
        {
            var data = UnitOfWork.TblQtHdr
                .GetTempsByAccountId(id);
            var dto = Mapper.Map<ICollection<QuoteHdrDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetNonTempRevQuotesByParentId(int id)
        {
            var data = UnitOfWork.TblQtHdr
                .GetNonTempRevsByParentId(id);
            var dto = Mapper.Map<ICollection<QuoteHdrDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }        

        [HttpPost]
        public JsonResult CreateQuote(QuoteCreateDTO dto)
        {
            try
            {
                var model = Mapper.Map<tbl_qthdr>(dto);
                model.qthdr_rev = "A";
                dto.id = QuoteService.Add(model);                
                return Json(dto, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.ToString());
                _logger.Error(JsonConvert.SerializeObject(dto, Formatting.Indented));
            }
            return Json(null, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateQuoteFromExistingDetails(int id, QuoteCreateDTO dto)
        {
            try
            {
                //var details = UnitOfWork.TblQtDtl
                //    .Find(t => t.qtdtl_qthdr_qn == id).ToList();
                //dto.tbl_qtdtl = Mapper.Map<ICollection<QuoteDetailDTO>>(details);

                //var model = Mapper.Map<tbl_qthdr>(dto);
                //model.qthdr_rev = "A";
                //dto.id = QuoteService.Add(model);

                var org = UnitOfWork.TblQtHdr.Get(id);

                if (org != null)
                {
                    dto.id = QuoteService.CopyQuote(org, "A", null, "", null);
                    var newQuote = UnitOfWork.TblQtHdr.Get(dto.id);

                    if (newQuote != null)
                    {
                        // update
                        newQuote.qthdr_acct_id = dto.qthdr_acct_id;
                        newQuote.qthdr_name = dto.qthdr_name;
                        newQuote.qthdr_tray_no = dto.qthdr_tray_no;
                        newQuote.qthdr_rep_id = dto.qthdr_rep_id;
                        newQuote.qthdr_amu = dto.qthdr_amu;
                        newQuote.qthdr_template = false;
                        UnitOfWork.Save();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult DeleteQuote(int id)
        {
            bool succeeded = false;

            try
            {
                //var model = Mapper.Map<tbl_qthdr>(dto);
                var model = UnitOfWork.TblQtHdr.Get(id);

                if (model != null)
                {
                    UnitOfWork.TblQtHdr.Remove(model);
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
        public JsonResult AddLine(QuoteDetailDTO dto)
        {
            QuoteDetailDTO succeeded = null;

            try
            {
                var model = Mapper.Map<tbl_qtdtl>(dto);
                
                if (model != null)
                {
                    model.tbl_comp = null;
                    model.tbl_qthdr = null;

                    UnitOfWork.TblQtDtl.Add(model);
                    UnitOfWork.Save();

                    model = UnitOfWork.TblQtDtl
                        .Find(t => t.id == model.id)
                        .FirstOrDefault();

                    succeeded = Mapper.Map<QuoteDetailDTO>(model);
                }
            }
            catch (Exception ex)
            {
                succeeded = null;
                _logger.Error(ex);
            }
            return Json(succeeded, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddLines(ICollection<QuoteDetailDTO> dtos)
        {            
            var succeeded = new List<QuoteDetailDTO>();

            if (dtos == null || dtos.Count == 0)
                return Json(succeeded, JsonRequestBehavior.AllowGet);

            int qn = dtos.First().qtdtl_qthdr_qn;
            //var compIds = dtos.Select(t => t.qtdtl_comp_id).ToList();

            try
            {
                var models = Mapper.Map<ICollection<tbl_qtdtl>>(dtos);
                
                if (models != null)
                {
                    // avoid ef create new data
                    foreach (var model in models)
                    {
                        model.tbl_comp = null;
                        model.tbl_qthdr = null;
                    }

                    UnitOfWork.TblQtDtl.AddRange(models);
                    UnitOfWork.Save();
                    
                    foreach (var model in models)
                    {                        
                        var m = UnitOfWork.TblQtDtl
                            .Find(t => t.id == model.id)
                            .FirstOrDefault();

                        if (m != null)
                        {
                            var dto = Mapper.Map<QuoteDetailDTO>(m);
                            dto.tbl_comp = Mapper.Map<ComponentDTO>(UnitOfWork.TblComp.Get(dto.qtdtl_comp_id));
                                //dtos.First(t => t.qtdtl_comp_id == m.qtdtl_comp_id).tbl_comp;
                            succeeded.Add(dto);
                        }
                    }
                }                
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(succeeded, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult UpdateLine(QuoteDetailDTO dto)
        {
            bool succeeded = false;
            try
            {                
                var model = UnitOfWork.TblQtDtl.Find(t => t.id == dto.id)
                    .FirstOrDefault();

                if (model != null)
                {
                    model.qtdtl_comp_qty = dto.qtdtl_comp_qty;
                    model.qtdtl_comp_case = dto.qtdtl_comp_case;
                    //Trinity - sprint 2 - add ACL, Latex, Sterility, Monthly Usage
                    model.tbl_comp.comp_acl = dto.tbl_comp.comp_acl;
                    //int convert_comp_strlty = Convert.ToBoolean(dto.tbl_comp.comp_strlty) ? 1 : 0;
                    model.tbl_comp.comp_strlty = dto.tbl_comp.comp_strlty;
                    //model.tbl_comp.comp_strlty = convert_comp_strlty;  //int instead of bool
                    model.tbl_comp.comp_latex = dto.tbl_comp.comp_latex;
                    //qthdr_amu - just a display not editable
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

        [HttpDelete]
        public JsonResult DeleteLine(int id)
        {
            bool succeeded = false;
            try
            {                
                var model = UnitOfWork.TblQtDtl.Find(t => t.id == id)
                    .FirstOrDefault();

                if (model != null)
                {
                    // disassemble components
                    var children = UnitOfWork.TblQtDtl
                        .Find(t => t.qtdtl_parent_id == model.id)
                        .ToList();

                    if (children.Count > 0)
                    {
                        foreach (var child in children)
                        {
                            child.qtdtl_parent_id = null;
                            UnitOfWork.Save();
                        }
                    }

                    // delete
                    UnitOfWork.TblQtDtl.Remove(model);
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
        public JsonResult SwitchComponent(QuoteDetailDTO dto, ComponentDTO component)
        {
            bool succeeded = false;

            try
            {
                var old = UnitOfWork.TblQtDtl
                    .Find(t => t.id == dto.id)
                    .FirstOrDefault();

                if (old != null)
                {
                    old.qtdtl_comp_id = component.id;
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
        public JsonResult UploadFile(HttpPostedFileBase file, int qn)
        {
            var succeeded = false;
            
            try
            {
                if (file.ContentLength > 0)
                {                    
                    XLWorkbook workBook = new XLWorkbook(file.InputStream);
                    IXLWorksheet workSheet = workBook.Worksheets.FirstOrDefault();

                    if (workSheet != null)
                    {
                        int count = 0;
                        foreach (IXLRow row in workSheet.Rows())
                        {
                            count++;
                            if (count == 1) continue;

                            var supplierPn = row.Cell(1).Value.ToString();
                            var qty = row.Cell(2).Value.CastTo<int>();
                            var level = row.Cell(3).Value.ToString();

                            var found = UnitOfWork.TblComp.Find(t => t.comp_vend_pn == supplierPn)
                                .FirstOrDefault();

                            if (found != null)
                            {
                                var dtl = new tbl_qtdtl();
                                dtl.qtdtl_qthdr_qn = qn;
                                dtl.qtdtl_comp_id = found.id;
                                dtl.qtdtl_comp_qty = qty;
                                dtl.qtdtl_comp_case = level;
                                dtl.qtdtl_sub = true;

                                UnitOfWork.TblQtDtl.Add(dtl);
                                UnitOfWork.Save();
                            }
                        }
                        //UnitOfWork.Save(); // does not work here
                        succeeded = true;
                    }                    
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
        public JsonResult IsTrayExist(int acctId, string trayNo)
        {
            var result = false;

            try
            {
                result = UnitOfWork.TblQtHdr.IsExistTrayNumber(acctId, trayNo);
            }
            catch (Exception ex)
            {

            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult AssemblyTypes()
        {
            var data = new string[] { "First Fold", "Piggyback", "Inside Pack" };
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult AssemblyBuilds()
        {
            var data = new string[] { "On the line", "Prior to build" };
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult AssemblyComponents(int id)
        {
            var data = UnitOfWork.TblQtDtl.GetAssemblyComponents(id);
            var dto = Mapper.Map<ICollection<QuoteDetailDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult TopLevelItems(int id)
        {
            var data = UnitOfWork.TblQtDtl.GetTopLevelByQtHdrIdWithComponent(id);
            var dto = Mapper.Map<ICollection<QuoteDetailDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult FindTopLevelItems(QuoteDetailFindDTO param)
        {
            if (param.compAcl.HasValue && !param.compAcl.Value) param.compAcl = null;
            if (param.compLatex.HasValue && !param.compLatex.Value) param.compLatex = null;

            var data = UnitOfWork.TblQtDtl.FindTopLevelByQtHdrIdWithComponent(
                param.quoteHdrId, param.PageSize, param.PageNumber, param.SortBy, param.SortDir,
                param.compDescOrg, param.compVendor, param.compVendorPart, param.compDesc,
                param.compMfg, param.compSterility, param.compId, param.compAcl, param.compLatex);
            var dto = Mapper.Map<PageListDTO<IEnumerable<QuoteDetailDTO>>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddAssemblyLine(QuoteSubAssemblyDTO param)
        {
            var result = new KeyValuePair<QuoteDetailDTO, IEnumerable<QuoteSubComponentDTO>>();

            try
            {
                // subassembly
                var dtl = Mapper.Map<tbl_qtdtl>(param);                
                UnitOfWork.TblQtDtl.Add(dtl);
                UnitOfWork.Save();

                var key = Mapper.Map<QuoteDetailDTO>(dtl);
                //key.tbl_comp = Mapper.Map<ComponentVendorDTO>(UnitOfWork.TblComp.Get(key.qtdtl_comp_id));
                var values = new List<QuoteSubComponentDTO>();

                foreach (var subcomp in param.SubComponents)
                {
                    var qtdtl = UnitOfWork.TblQtDtl.Get(subcomp.id);
                    if (qtdtl == null) continue;

                    if (subcomp.original_qty == subcomp.new_qty)
                    {                                                        
                        qtdtl.qtdtl_parent_id = dtl.id;
                        UnitOfWork.Save();
                    } 
                    else
                    {
                        // reduce qty                        
                        qtdtl.qtdtl_comp_qty = subcomp.original_qty - subcomp.new_qty;
                        UnitOfWork.Save();

                        // add new
                        var new_comp = qtdtl.CloneObject() as tbl_qtdtl;
                        if (new_comp == null) continue;
                        new_comp.qtdtl_comp_qty = subcomp.new_qty;
                        new_comp.qtdtl_parent_id = dtl.id;
                        UnitOfWork.TblQtDtl.Add(new_comp);
                        UnitOfWork.Save();
                    }
                    values.Add(subcomp);
                }
                
                result = new KeyValuePair<QuoteDetailDTO, IEnumerable<QuoteSubComponentDTO>>(key, values);
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult UpdateAssemblyLine(QuoteDetailDTO assembly, IEnumerable<QuoteDetailDTO> components)
        {            
            try
            {                
                var dtl = UnitOfWork.TblQtDtl.Get(assembly.id);

                if (dtl != null)
                {
                    dtl.qtdtl_assembly_name = assembly.qtdtl_assembly_name;
                    dtl.qtdtl_assembly_build = assembly.qtdtl_assembly_build;
                    dtl.qtdtl_assembly_type = assembly.qtdtl_assembly_type;
                    UnitOfWork.Save();
                    var key = Mapper.Map<QuoteDetailDTO>(dtl);
                    
                    var exists = UnitOfWork.TblQtDtl
                        .Find(t => t.qtdtl_qthdr_qn == dtl.qtdtl_qthdr_qn && t.qtdtl_parent_id == dtl.id)
                        .ToList();

                    // remove
                    var removes = new List<QuoteDetailDTO>();
                    foreach (var exist in exists)
                    {
                        bool toRemove = false;
                        if (components == null || !components.Any())
                            toRemove = true;
                        else
                            toRemove = !components.Any(t => t.id == exist.id);

                        if (toRemove)
                        {
                            exist.qtdtl_parent_id = null;
                            UnitOfWork.Save();
                            removes.Add(Mapper.Map<QuoteDetailDTO>(exist));
                        }
                    }

                    var adds = new List<QuoteDetailDTO>();
                    // add
                    if (components != null)
                    {
                        foreach (var component in components)
                        {
                            var found = exists.Any(t => t.id == component.id);
                            if (!found)
                            {
                                var entity = UnitOfWork.TblQtDtl.Get(component.id);
                                if (entity != null)
                                {
                                    entity.qtdtl_parent_id = dtl.id;
                                    UnitOfWork.Save();
                                    adds.Add(Mapper.Map<QuoteDetailDTO>(entity));
                                }
                            }
                        }
                    }                   
                    return Json(new { key, removes, adds }, JsonRequestBehavior.AllowGet);
                }                
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(null, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetPackQuoteReport(int id)
        {
            ActionResult<PackQuoteReport> actionResult = null;

            try
            {
                var errors = QuoteService.ValidateQuoteExport(id);

                if (errors.Count() > 0)
                {
                    var d = new ActionResult<PackQuoteReport>();
                    foreach (var e in errors)
                        d.Errors.Add(e);
                    return Json(d, JsonRequestBehavior.AllowGet);
                }

                actionResult = QuoteService.GetPackQuoteReport(id);

                var job = new Jobs.QuoteHistory();
                job.InsertToSQL(actionResult, id);

                if (actionResult.Debugs != null)
                {
                    _logger.Debug($"Quote {id} debug:");
                    foreach (var d in actionResult.Debugs)
                        _logger.Debug(d);
                }

                
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(actionResult, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Proposal()
        {
            return View();
        }

        public ActionResult Approval()
        {
            return View();
        }
        public ActionResult ExportCostedExcel(int id)
        {
            var quote = UnitOfWork.TblQtHdr.Get(id);
            string quoteId = $"{id}";
            string sheetName = $"{id}";
            if (quote != null)
            {
                quoteId = $"{quote.qthdr_qn_basis}-{quote.qthdr_rev}";
                sheetName = GetNameForExcelExport(quote);
            }

            var wb = new XLWorkbook();           
            var ws = wb.Worksheets.Add(sheetName);
            
            ExportCostedBOM(ws, id);            
            
            var stream = new MemoryStream();            
            wb.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);                                
            var result = new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            
            result.FileDownloadName = $"Costed_BOM_{quoteId}.xlsx";
            return result;                        
        }

        public ActionResult ExportCustomerExcel(int id)
        {
            var quote = UnitOfWork.TblQtHdr.Get(id);
            string quoteId = $"{id}";
            string sheetName = $"{id}";
            if (quote != null)
            {
                quoteId = $"{quote.qthdr_qn_basis}-{quote.qthdr_rev}";
                sheetName = GetNameForExcelExport(quote);
            }
            var wb = new XLWorkbook();                        
            var ws = wb.Worksheets.Add(sheetName);
            ExportCustomerBOM(ws, id);

            var stream = new MemoryStream();
            wb.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);
            var result = new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            
            result.FileDownloadName = $"Customer_BOM_{quoteId}.xlsx";
            return result;
        }

        public ActionResult ExportProposal(string id, bool external)
        {
            string[] temp = id.Split(',');
            var wb = new XLWorkbook();

            var sumSheet = wb.Worksheets.Add("Summary");
            var reports = new List<KeyValuePair<tbl_qthdr, PackQuoteReport>>();

            var errors = new List<KeyValuePair<tbl_qthdr, ActionResult<PackQuoteReport>>>();

            foreach (var t in temp)
            {
                int qid = 0;
                if (int.TryParse(t, out qid))
                {
                    var data = UnitOfWork.TblQtHdr.Get(qid);

                    if (data != null)
                    {
                        string name = GetNameForExcelExport(data);                        
                        var ws = wb.Worksheets.Add(name);
                        ActionResult<PackQuoteReport> report = null;
                        if (external)
                            report = ExportCustomerBOM(ws, data.id);
                        else
                            report = ExportCostedBOM(ws, data.id);

                        if (report != null && report.Result != null)
                            reports.Add(new KeyValuePair<tbl_qthdr, PackQuoteReport>(data, report.Result));
                        if (report != null && report.Errors != null && report.Errors.Any())
                            errors.Add(new KeyValuePair<tbl_qthdr, ActionResult<PackQuoteReport>>(data, report));
                    }
                }                
            }
            
            if (reports.Any())
            {
                int row = 4;
                int col = 2;
                sumSheet.Cell(row, col++).Value = "Finished Good";
                sumSheet.Cell(row, col++).Value = "Quote Number";
                sumSheet.Cell(row, col++).Value = "Tray Name";
                sumSheet.Cell(row, col++).Value = "Case Quantity";
                sumSheet.Cell(row, col++).Value = "Monthly Usage";
                if (!external) sumSheet.Cell(row, col++).Value = "Unit Cost";
                sumSheet.Cell(row, col++).Value = "Unit Sell Price";

                if (!external)
                {
                    sumSheet.Cell(row, col++).Value = "Annual Cost";
                    sumSheet.Cell(row, col++).Value = "Annual Sell";
                    sumSheet.Cell(row, col++).Value = "Margin by Tray";
                }
                
                foreach (var vkp in reports)
                {
                    row++;
                    col = 2;
                    sumSheet.Cell(row, col++).Value = vkp.Key.qthdr_fg_num;
                    sumSheet.Cell(row, col++).Value = string.Format("{0}-{1}",vkp.Key.qthdr_qn_basis,vkp.Key.qthdr_rev);
                    sumSheet.Cell(row, col++).Value = vkp.Key.qthdr_name;
                    sumSheet.Cell(row, col++).Value = vkp.Value.CaseQty;
                    sumSheet.Cell(row, col).Style.NumberFormat.Format = "0.00";
                    sumSheet.Cell(row, col++).Value = vkp.Value.MonthlyUsage;
                    sumSheet.Cell(row, col).Style.NumberFormat.Format = "0.00";

                    if (!external)
                    {
                        sumSheet.Cell(row, col++).Value = vkp.Value.FinalMfgCost;
                        sumSheet.Cell(row, col).Style.NumberFormat.Format = "$0.00";
                    }

                    sumSheet.Cell(row, col++).Value = vkp.Value.FinalPrice;
                    sumSheet.Cell(row, col).Style.NumberFormat.Format = "$0.00";

                    if (!external)
                    {
                        // annual cost
                        sumSheet.Cell(row, col++).FormulaA1 = $"F{row}*G{row}*12";
                        sumSheet.Cell(row, col).Style.NumberFormat.Format = "$0.00";
                        // annual sell
                        sumSheet.Cell(row, col++).FormulaA1 = $"=F{row}*H{row}*12";
                        sumSheet.Cell(row, col).Style.NumberFormat.Format = "$0.00";
                        // margin by tray
                        sumSheet.Cell(row, col++).FormulaA1 = $"=((J{row}-I{row})/J{row})";
                        //sumSheet.Cell(row, col).Style.NumberFormat.Format = "0.0000%";
                    }
                }
                if (!external)
                {
                    sumSheet.Range(5, 11, row, 11).Style.NumberFormat.Format = "0.0000%";
                }
                sumSheet.Columns().AdjustToContents();
                sumSheet.PageSetup.FitToPages(1, 1);
            }

            if (errors.Any())
            {
                var errSheet = wb.Worksheets.Add("Errors");
                int row = 1;
                int col = 1;
                foreach (var kvp in errors)
                {
                    errSheet.Cell(row++, col).Value = $"Quote: {kvp.Key.qthdr_qn_basis}-{kvp.Key.qthdr_rev}";                    
                    foreach (var err in kvp.Value.Errors)
                    {
                        errSheet.Cell(row++, col).Value = err;                        
                    }                    
                }                

                errSheet.Columns().AdjustToContents();
                errSheet.PageSetup.FitToPages(1, 1);
            }

            var stream = new MemoryStream();
            wb.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);
            var result = new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            result.FileDownloadName = string.Format("{0}_proposal.xlsx", external ? "external" : "internal");
            return result;
        }

        private ActionResult<PackQuoteReport> ExportCostedBOM(IXLWorksheet ws, int id)
        {
            var errors = QuoteService.ValidateQuoteExport(id);

            if (errors.Count() > 0)
            {
                int r = 1;
                foreach (var error in errors)
                {
                    r++;
                    ws.Cell(r, 1).Value = error;
                }
                return null;
            }

            var actionResult = QuoteService.GetPackQuoteReport(id);
            var report = actionResult.Result;
            var currencySymb = QuoteService.GetQuoteCurrencySymbol(id);

            ws.Cell("A1").SetValue("Customer");
            ws.Cell("B1").SetValue(report.Customer);
            ws.Cell("A2").SetValue("Quote #");
            ws.Cell("B2").Value = "'" + report.QuoteNoAndRev;
            ws.Cell("A3").SetValue("Tray Name");
            ws.Cell("B3").SetValue(report.Desc);
            ws.Cell("A4").SetValue("Print Date");
            ws.Cell("B4").SetValue(report.PrintDate).Style.DateFormat.SetFormat("MM/dd/yyyy");
            ws.Cell("A5").SetValue("Account ID");
            ws.Cell("B5").Value = "'" + report.AccountId;
            ws.Cell("A6").SetValue("Monthly Usage (Pack)");
            ws.Cell("B6").SetValue(report.MonthlyUsage);
            ws.Cell("A7").SetValue("Case Quantity");
            ws.Cell("B7").SetValue(report.CaseQty);
            ws.Cell("A8").SetValue("Manufacturing Each Cost");
            ws.Cell("B8").SetValue(report.FinalMfgCost).Style.NumberFormat.SetFormat(currencySymb + "0.000");
            ws.Cell("A9").SetValue("Manufacturing Case Cost");
            ws.Cell("B9").SetValue(report.FinalMfgCostCS).Style.NumberFormat.SetFormat(currencySymb + "0.000");

            ws.Cell("A10").SetValue("Fees");
            ws.Cell("B10").SetValue(report.Fees).Style.NumberFormat.SetFormat(currencySymb + "0.000");
            ws.Cell("A11").SetValue("Fees Case");
            ws.Cell("B11").SetValue(report.FeesCS).Style.NumberFormat.SetFormat(currencySymb + "0.000");

            ws.Cell("A12").SetValue("Manufacturing Each Cost And Fees");
            ws.Cell("B12").SetValue(report.FinalMfgCostAndFees).Style.NumberFormat.SetFormat(currencySymb + "0.000");
            ws.Cell("A13").SetValue("Manufacturing Case Cost And Fees");
            ws.Cell("B13").SetValue(report.FinalMfgCostAndFeesCS).Style.NumberFormat.SetFormat(currencySymb + "0.000");

            ws.Range("A1:A13").Style.Font.SetBold();
            ws.Range("A1:A13").Style.Fill.BackgroundColor = XLColor.LightBlue;
            ws.Range("B1:B13").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            ws.Range("A1:B13").Style.Border.SetInsideBorder(XLBorderStyleValues.Thin);
            ws.Range("A1:B13").Style.Border.SetOutsideBorder(XLBorderStyleValues.Thin);

            // logo
            string brandLogo = QuoteService.GetQuoteBrandLogo(id);
            if (string.IsNullOrEmpty(brandLogo)) brandLogo = "invenio_logo.jpg";
            string imgPath = Server.MapPath(Url.Content($"~/Resources/{brandLogo}"));
            if (System.IO.File.Exists(imgPath))
            {
                var img = ws.AddPicture(imgPath);
                img.MoveTo(ws.Cell(3, 4).Address);
                img.Scale(.4);
            }

            //table
            ws.Cell("A15").SetValue("MFG");
            ws.Cell("B15").SetValue("MFG PART NO.");
            ws.Cell("C15").SetValue("MCL NO.");
            ws.Cell("D15").SetValue("DESCRIPTION");
            ws.Cell("E15").SetValue("QTY").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
            ws.Cell("F15").SetValue("UM").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
            ws.Cell("G15").SetValue("Cost");
            ws.Cell("H15").SetValue("Ext. Cost");
            ws.Cell("I15").SetValue("Rebate EA");
            ws.Range("A15:I15").Style.Font.SetBold();
            ws.Range("A15:I15").Style.Fill.BackgroundColor = XLColor.LightBlue;

            int rowTableStart = 15;
            int row = rowTableStart;
            Dictionary<int, int> groups = new Dictionary<int, int>();
            int lastAssemblyRow = -1;
            int count = 0;
            foreach (var line in report.Lines.OrderBy(t => t.Desc))
            {
                count++;
                row++;
                ws.Cell(row, 1).SetValue(line.Mfg ?? "");
                ws.Cell(row, 2).Value = "'" + line.MfgPartNo ?? "";
                ws.Cell(row, 3).Value = "'" + line.MclNo;
                ws.Cell(row, 4).SetValue(line.Desc ?? "");
                ws.Cell(row, 5).SetValue(line.Qty);
                ws.Cell(row, 6).SetValue(line.Uom ?? "");
                ws.Cell(row, 7).SetValue(line.Cost);
                ws.Cell(row, 8).SetValue(line.ExtCost);
                ws.Cell(row, 9).SetValue(line.RebateAmount);

                if (line.IsAssembly)
                    lastAssemblyRow = row;
                else if (lastAssemblyRow > 0 && (line.ParentId == null || line.ParentId <= 0 || count == report.Lines.Count()))
                {
                    groups.Add(lastAssemblyRow, (count == report.Lines.Count() ? row : row - 1));
                    lastAssemblyRow = -1;
                }
            }
            int rowTableEnd = row;
            ws.Range(rowTableStart, 5, rowTableEnd, 5).Style.NumberFormat.Format = "0.00";
            ws.Range(rowTableStart, 7, rowTableEnd, 9).Style.NumberFormat.Format = currencySymb + "0.000";

            foreach (var kvp in groups)
            {
                ws.Rows(kvp.Key + 1, kvp.Value).Group();
                ws.Rows(kvp.Key + 1, kvp.Value).Collapse();
            }

            ws.Range(rowTableStart, 5, rowTableEnd, 5).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
            ws.Range(rowTableStart, 1, rowTableEnd, 9).Style.Border.SetInsideBorder(XLBorderStyleValues.Thin);
            ws.Range(rowTableStart, 1, rowTableEnd, 9).Style.Border.SetOutsideBorder(XLBorderStyleValues.Thin);

            row++;
            ws.Cell(++row, 1).SetValue("1. Total Materials").Style.Font.SetBold();
            ws.Cell(row, 2).SetValue(report.TotalMaterialCost).Style.Font.SetBold();
            //ws.Cell(row, 2).SetValue("EACH").Style.Font.SetBold();
            //ws.Cell(row, 3).SetValue("CASE").Style.Font.SetBold();
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Cell(++row, 1).SetValue("Material Cost").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.MaterialCost);
            //ws.Cell(row, 3).SetValue(report.MaterialCostCS);
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Cell(++row, 1).SetValue("Component Shipping Cost").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.ComponentShippingCost);
            //ws.Cell(row, 3).SetValue(report.ComponentShippingCostCS);
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            //ws.Cell(++row, 1).SetValue("Total Material Cost");            
            //ws.Cell(row, 2).SetValue(report.TotalMaterialCost);
            //ws.Cell(row, 3).SetValue(report.TotalMaterialCostCS);
            //ws.Range(row, 2, row, 3).Style.NumberFormat.Format = "$0.00";

            row++;
            ws.Cell(++row, 1).SetValue("2. Labor Cost").Style.Font.SetBold();
            ws.Cell(row, 2).SetValue(report.LaborCost).Style.Font.SetBold();
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Cell(++row, 1).SetValue("Component Count").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.ComponentCount);

            ws.Cell(++row, 1).SetValue("Labor Time (Seconds)").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue((int)report.LaborTimeInSeconds);

            ws.Cell(++row, 1).SetValue("Labor Rate").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.LaborRate);

            ws.Cell(++row, 1).SetValue("Labor Factor").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.LaborFactor);

            //ws.Cell(++row, 1).SetValue("Labor Cost");            
            //ws.Cell(row, 2).SetValue(report.LaborCost);
            //ws.Cell(row, 3).SetValue(report.LaborCostCS);
            //ws.Range(row, 2, row, 3).Style.NumberFormat.Format = "$0.00";

            row++;
            ws.Cell(++row, 1).SetValue("3. Sterilization Cost").Style.Font.SetBold();
            ws.Cell(row, 2).SetValue(report.SterilizationCost).Style.Font.SetBold();

            //ws.Cell(++row, 1).SetValue("Sterilization Cost");            
            //ws.Cell(row, 2).SetValue(report.SterilizationCost);
            //ws.Cell(row, 3).SetValue(report.SterilizationCostCS);
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            //row++;
            //ws.Cell(++row, 1).SetValue("Subtotal (Materials, Labor & Sterilization)").Style.Font.SetBold();
            //ws.Cell(++row, 1).SetValue("Direct Cost");            
            //ws.Cell(row, 2).SetValue(report.DirectCost);
            //ws.Cell(row, 3).SetValue(report.DirectCostCS);
            //ws.Range(row, 2, row, 3).Style.NumberFormat.Format = "$0.00";

            row++;
            ws.Cell(++row, 1).SetValue("4. General (Indirect)").Style.Font.SetBold();
            ws.Cell(row, 2).SetValue(report.IndirectCost).Style.Font.SetBold();
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Cell(++row, 1).SetValue("Overhead").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.OverheadCost);
            //ws.Cell(row, 3).SetValue(report.OverheadCostCS);
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Cell(++row, 1).SetValue("Inland Freight").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.InlandFreightCost);
            //ws.Cell(row, 3).SetValue(report.InlandFreightCostCS);
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Cell(++row, 1).SetValue("G&A").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.GACost);
            //ws.Cell(row, 3).SetValue(report.GACostCS);
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Cell(++row, 1).SetValue("Finance Cost").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.FinanceCost);
            //ws.Cell(row, 3).SetValue(report.FinanceCostCS);
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Cell(++row, 1).SetValue("Warehouse Cost").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.WarehouseCost);
            //ws.Cell(row, 3).SetValue(report.WarehouseCostCS);
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            row++;
            ws.Cell(++row, 1).SetValue("Standard Cost (Total of 1-4)").Style.Font.SetBold();
            ws.Cell(row, 2).SetValue(report.StandardCost).Style.Font.SetBold();
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";
            ws.Range(row, 1, row, 3).Style.Font.SetItalic();

            //ws.Cell(++row, 1).SetValue("Standard Cost");            
            //ws.Cell(row, 2).SetValue(report.StandardCost);
            //ws.Cell(row, 3).SetValue(report.StandardCostCS);
            //ws.Range(row, 2, row, 3).Style.NumberFormat.Format = "$0.00";

            row++;
            ws.Cell(row, 1).SetValue("Pre-Import Selling Price").Style.Font.SetBold();
            ws.Cell(row, 2).SetValue(report.PreImportSellingPrice);
            //ws.Cell(row, 3).SetValue(report.PreImportSellingPriceCS);
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";
            ws.Range(row, 1, row, 3).Style.Font.SetItalic();

            row++;
            ws.Cell(++row, 1).SetValue("5. Import Cost").Style.Font.SetBold();
            ws.Cell(row, 2).SetValue(report.TotalImportCost).Style.Font.SetBold();
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Cell(++row, 1).SetValue("Ocean freight").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.OceanFreightCost);
            //ws.Cell(row, 3).SetValue(report.OceanFreightCostCS);
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Cell(++row, 1).SetValue("Import Duty").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.ImportDuty);
            //ws.Cell(row, 3).SetValue(report.ImportDutyCS);
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Cell(++row, 1).SetValue("Excise Tax").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
            ws.Cell(row, 2).SetValue(report.ExciseTax);
            //ws.Cell(row, 3).SetValue(report.ExciseTaxCS);
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            //ws.Cell(++row, 1).SetValue("Total Import Costs");            
            //ws.Cell(row, 2).SetValue(report.TotalImportCost);
            //ws.Cell(row, 3).SetValue(report.TotalImportCostCS);
            //ws.Range(row, 2, row, 3).Style.NumberFormat.Format = "$0.00";

            //row++;
            //ws.Cell(++row, 1).SetValue("Manufacturing Cost");            
            //ws.Cell(row, 2).SetValue(report.FinalMfgCost);
            //ws.Cell(row, 3).SetValue(report.FinalMfgCostCS);
            //ws.Range(row, 2, row, 3).Style.NumberFormat.Format = "$0.00";

            row++;
            ws.Cell(++row, 1).SetValue("Manufacturing Cost").Style.Font.SetBold();
            ws.Cell(row, 2).SetValue(report.FinalMfgCost).Style.Font.SetBold();
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Cell(++row, 1).SetValue("Fees").Style.Font.SetBold();
            ws.Cell(row, 2).SetValue(report.Fees).Style.Font.SetBold();
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            if (report.Fees_acct_admin != 0)
            {
                ws.Cell(++row, 1).SetValue("Admin Fee").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                ws.Cell(row, 2).SetValue(report.Fees_acct_admin);
                ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";
            }

            if (report.Fees_acct_whrhs != 0)
            {
                ws.Cell(++row, 1).SetValue("Warehouse Fee").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                ws.Cell(row, 2).SetValue(report.Fees_acct_whrhs);
                ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";
            }

            if (report.Fees_acct_frght != 0)
            {
                ws.Cell(++row, 1).SetValue("Freight Fee").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                ws.Cell(row, 2).SetValue(report.Fees_acct_frght);
                ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";
            }

            if (report.Fees_acct_misc != 0)
            {
                ws.Cell(++row, 1).SetValue("Misc Fee").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                ws.Cell(row, 2).SetValue(report.Fees_acct_misc);
                ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";
            }

            if (report.Fees_acct_logstcs != 0)
            {
                ws.Cell(++row, 1).SetValue("Logistic Fee").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                ws.Cell(row, 2).SetValue(report.Fees_acct_logstcs);
                ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";
            }

            if (report.Fees_acct_spif_percent_fee != 0)
            {
                ws.Cell(++row, 1).SetValue("SPIF Fee").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                ws.Cell(row, 2).SetValue(report.Fees_acct_spif_percent_fee);
                ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";
            }

            if (report.Fees_acct_gpo_percent_fee != 0)
            {
                ws.Cell(++row, 1).SetValue("GPO Fee").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                ws.Cell(row, 2).SetValue(report.Fees_acct_gpo_percent_fee);
                ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";
            }

            if (report.Fees_acct_marketing_percent_fee != 0)
            {
                ws.Cell(++row, 1).SetValue("Marketing Fee").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                ws.Cell(row, 2).SetValue(report.Fees_acct_marketing_percent_fee);
                ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";
            }
            ws.Cell(++row, 1).SetValue("Final Manufacturing Cost And Fees").Style.Font.SetBold();
            ws.Cell(row, 2).SetValue(report.FinalMfgCostAndFees).Style.Font.SetBold();
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            if (report.Rebates != 0)
            {
                ws.Cell(++row, 1).SetValue("Rebates").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right);
                ws.Cell(row, 2).SetValue(report.Rebates);
                ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";
            }

            if (report.Rebates != 0)
            {
                ws.Cell(++row, 1).SetValue("Final Rebated Manufacturing Cost And Fees").Style.Font.SetBold();
                ws.Cell(row, 2).SetValue(report.FinalRebatedMfgCostAndFees).Style.Font.SetBold();
                ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";
            }

            ws.Cell(++row, 1).SetValue("Final Selling Price").Style.Font.SetBold();
            ws.Cell(row, 2).SetValue(report.FinalPrice).Style.Font.SetBold();
            ws.Range(row, 2, row, 3).Style.NumberFormat.Format = currencySymb + "0.000";

            ws.Column(1).Width = 26;
            ws.Column(2).Width = 21;
            ws.Column(3).Width = 15;
            ws.Column(4).Width = 18;
            ws.Column(5).Width = 9;
            ws.Column(6).Width = 47;
            ws.Column(7).Width = 9;
            ws.Column(8).Width = 9;

            ws.Columns().AdjustToContents();
            ws.PageSetup.FitToPages(1, 1);

            return actionResult;
        }

        private ActionResult<PackQuoteReport> ExportCustomerBOM(IXLWorksheet ws, int id)
        {
            var errors = QuoteService.ValidateQuoteExport(id);

            if (errors.Count() > 0)
            {
                int r = 1;
                foreach (var error in errors)
                {
                    r++;
                    ws.Cell(r, 1).Value = error;
                }
                return null;
            }

            var actionResult = QuoteService.GetPackQuoteReport(id);
            var report = actionResult.Result;
            var currencySymb = QuoteService.GetQuoteCurrencySymbol(id);
            ws.Cell("A1").SetValue("Customer");
            ws.Cell("B1").SetValue(report.Customer);
            ws.Cell("A2").SetValue("Quote #");
            ws.Cell("B2").Value = "'" + report.QuoteNoAndRev;
            ws.Cell("A3").SetValue("Tray Name");
            ws.Cell("B3").SetValue(report.Desc);            
            ws.Cell("A4").SetValue("Print Date");
            ws.Cell("B4").SetValue(report.PrintDate);
            ws.Cell("B5").Style.DateFormat.Format = "MM/dd/yyyy";
            ws.Cell("A5").SetValue("Account ID");
            ws.Cell("B5").Value = "'" + report.AccountId;
            ws.Cell("A6").SetValue("Monthly Usage (Pack)");
            ws.Cell("B6").SetValue(report.MonthlyUsage);            
            ws.Cell("A7").SetValue("Case Quantity");
            ws.Cell("B7").SetValue(report.CaseQty);
            ws.Cell("A8").SetValue("Unit " + currencySymb);
            ws.Cell("B8").SetValue(report.FinalPrice).Style.NumberFormat.SetFormat(currencySymb + "0.00");
            ws.Cell("A9").SetValue("Case " + currencySymb);
            ws.Cell("B9").SetValue(report.FinalPriceCS).Style.NumberFormat.SetFormat(currencySymb + "0.00");
            
            ws.Range("A1:A9").Style.Font.SetBold();
            ws.Range("A1:A9").Style.Fill.BackgroundColor = XLColor.LightBlue;
            ws.Range("B1:B9").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            ws.Range(1, 1, 9, 2).Style.Border.SetInsideBorder(XLBorderStyleValues.Thin);
            ws.Range(1, 1, 9, 2).Style.Border.SetOutsideBorder(XLBorderStyleValues.Thin);

            // logo
            string brandLogo = QuoteService.GetQuoteBrandLogo(id);
            if (string.IsNullOrEmpty(brandLogo)) brandLogo = "invenio_logo.jpg";
            string imgPath = Server.MapPath(Url.Content($"~/Resources/{brandLogo}"));
            if (System.IO.File.Exists(imgPath))
            {
                var img = ws.AddPicture(imgPath);
                img.MoveTo(ws.Cell(3, 4).Address);
                img.Scale(.4);
            }
            
            //table
            ws.Cell("A11").SetValue("MFG").Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
            ws.Cell("B11").SetValue("MFG PART NO.");
            ws.Cell("C11").SetValue("MCL NO.");            
            ws.Cell("D11").SetValue("DESCRIPTION");
            ws.Cell("E11").SetValue("QTY");
            ws.Cell("F11").SetValue("UM");            
            ws.Range("A11:F11").Style.Font.SetBold();
            ws.Range("A11:F11").Style.Fill.BackgroundColor = XLColor.LightBlue;

            int lineStartRow = 11;
            int row = lineStartRow;
            Dictionary<int, int> groups = new Dictionary<int, int>();
            int lastAssemblyRow = -1;
            int count = 0;
            foreach (var line in report.Lines.OrderBy(t => t.Desc))
            {
                count++;
                row++;
                string mfg = line.IsInternationMfg ? "GRI Select" : (line.Mfg ?? "");
                ws.Cell(row, 1).SetValue(mfg);
                ws.Cell(row, 2).Value = "'" + line.MfgPartNo ?? "";
                ws.Cell(row, 3).Value = "'" + line.MclNo;
                ws.Cell(row, 4).SetValue(line.Desc ?? "");
                ws.Cell(row, 5).SetValue(line.Qty).Style.NumberFormat.SetFormat("0.00");
                ws.Cell(row, 6).SetValue(line.Uom ?? "");

                if (line.IsAssembly)
                    lastAssemblyRow = row;
                else if (lastAssemblyRow > 0 && (line.ParentId == null || line.ParentId <= 0 || count == report.Lines.Count()))
                {
                    groups.Add(lastAssemblyRow, (count == report.Lines.Count() ? row : row - 1));
                    lastAssemblyRow = -1;
                }
            }
                        
            foreach (var kvp in groups)
            {
                ws.Rows(kvp.Key + 1, kvp.Value).Group();
                ws.Rows(kvp.Key + 1, kvp.Value).Collapse();
            }

            int lineEndRow = row;

            ws.Range(11, 1, lineEndRow, 6).Style.Border.SetInsideBorder(XLBorderStyleValues.Thin);
            ws.Range(11, 1, lineEndRow, 6).Style.Border.SetOutsideBorder(XLBorderStyleValues.Thin);

            row += 4;
            //ws.Cell(++row, 2).SetValue("Each Price");
            //ws.Cell(row, 3).SetValue("Case Price");
            //ws.Range(row, 2, row, 3).Style.Font.SetBold();
            //ws.Range(row, 2, row, 3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            //ws.Cell(++row, 1).SetValue("Customer Price:");
            //ws.Cell(row, 2).SetValue(report.FinalPrice).Style.DateFormat.SetFormat("$0.00");
            //ws.Cell(row, 3).SetValue(report.FinalPriceCS).Style.DateFormat.SetFormat("$0.00");
            //ws.Range(row, 2, row, 3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            //row += 3;

            ws.Range(row, 1, row, 2).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
            ws.Cell(++row, 1).SetValue("Signature");

            ws.Column(1).Width = 32;
            ws.Column(2).Width = 18;
            ws.Column(3).Width = 15;
            ws.Column(4).Width = 38;
            ws.Column(5).Width = 9;
            ws.Column(6).Width = 4;

            ws.Range(lineStartRow, 3, lineEndRow, 3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            ws.Range(lineStartRow, 5, lineEndRow, 5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            ws.Range(lineStartRow, 6, lineEndRow, 6).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            ws.PageSetup.SetPageOrientation(XLPageOrientation.Landscape);
            ws.Columns().AdjustToContents();
            ws.PageSetup.FitToPages(1, 1);
            
            
            return actionResult;
        }

        [HttpGet]
        public JsonResult CreateNewRevFromId(int id)
        {
            int result = -1;
            try
            {
                var quote = UnitOfWork.TblQtHdr.Get(id);

                if (quote == null)
                {
                    _logger.Error($"quote id {id} not found");
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                                
                var root = QuoteService.GetRoot(quote.id);

                if (root == null)
                {
                    _logger.Error($"unable to find root of quote id {id}");
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                                
                string maxRev = QuoteService.GetMaxRev(true, root.id);
                               
                if (string.IsNullOrEmpty(maxRev))
                {                    
                    int num = 0;
                    if (int.TryParse(quote.qthdr_rev, out num))
                    {
                        // cases where quote rev is numeric and no previous alpha rev
                        _logger.Debug($"unable to find max quote rev of quote id {id}");
                        var map = QuoteService.GetRevMap(quote.qthdr_rev);
                        maxRev = map.Key;
                    }
                    
                    if (string.IsNullOrEmpty(maxRev))
                    {
                        _logger.Error($"unable to find max quote rev of quote id {id}");
                        return Json(result, JsonRequestBehavior.AllowGet);
                    }
                }

                string newRev = QuoteService.GetNextRev(maxRev);

                if (!string.IsNullOrEmpty(newRev))
                {
                    // quote status = in process
                    result = QuoteService.CopyQuote(quote, newRev, root.id, null, 1);                    
                }
                else
                    _logger.Error($"unable to get next rev from quote id {id}");
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateNewAwardFromId(QuoteNewAwardDTO param)
        {            
            int result = -1;
            
            try
            {
                // check dup fg #
                var fgExists = UnitOfWork.TblQtHdr.Find(t => t.qthdr_fg_num == param.qthdr_fg_num).Any();
                if (fgExists)
                {
                    _logger.Error($"fg {param.qthdr_fg_num} already exists");
                    return Json(result, JsonRequestBehavior.AllowGet);
                }

                var quote = UnitOfWork.TblQtHdr.Get(param.id);

                if (quote == null)
                {
                    _logger.Error($"quote id {param.id} not found");
                    return Json(result, JsonRequestBehavior.AllowGet);
                }

                var root = QuoteService.GetRoot(quote.id);

                if (root == null)
                {
                    _logger.Error($"unable to find root of quote id {param.id}");
                    return Json(result, JsonRequestBehavior.AllowGet);
                }

                string maxRev = QuoteService.GetMaxRev(false, root.id);
                string newRev = "";

                if (string.IsNullOrEmpty(maxRev))
                    newRev = "1";
                else
                    newRev = QuoteService.GetNextRev(maxRev);

                // quote status = new award
                result = QuoteService.CopyQuote(quote, newRev, root.id, param.qthdr_fg_num, 6, param.qthdr_finalMfgCost);

                quote.qthdr_status_id = 4; // Set to Rejected per Steve's request
                UnitOfWork.Save();
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateTemplateFromId(QuoteCreateTemplateDTO param)
        {
            int result = -1;
            try
            {
                var quote = UnitOfWork.TblQtHdr.Get(param.id);

                if (quote == null)
                {
                    _logger.Error($"quote id {param.id} not found");
                    return Json(result, JsonRequestBehavior.AllowGet);
                }

                // quote status = in process
                result = QuoteService.CopyQuote(quote, "A", null, null, 1);                
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult IsFinishedGoodExists(string finishedGood)
        {
            var result = false;

            try
            {
                result = UnitOfWork.TblQtHdr.Find(t => t.qthdr_fg_num == finishedGood).Any();
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

        [HttpPost]
        public JsonResult FindTrays(QuoteFindDTO param)
        {
            int? repId = null;

            if (User.Identity.IsAuthenticated && User.IsInRole("SalesRep"))
            {
                var claims = UserManager.GetClaims(User.Identity.GetUserId());

                if (claims != null && claims.Count > 0)
                {
                    var rep = claims.FirstOrDefault(t => t.Type == "salesrep_id");
                    if (rep != null)
                    {
                        var num = 0;
                        if (int.TryParse(rep.Value, out num))
                            repId = num;
                    }
                }
            }
            //var data = UnitOfWork.TblComp.GetCompTrays(param.PageSize, param.PageNumber, param.id);
            var data = UnitOfWork.TblComp.GetCompByQuote(param.PageSize, param.PageNumber, param.id, param.qthdr_status_id); 
            var dto = Mapper.Map<PageListDTO<ICollection<QuoteHdrDTO>>>(data); //status_id pulls into data fine
            return Json(dto, JsonRequestBehavior.AllowGet);  //console shows error in this method - The length of the string exceeds the value set on the maxJsonLength property.
        }

        [HttpPost]
        public JsonResult ValidateFinishedGood(string finishedGood, int quoteId, int accountId)
        {
            var result = new ActionResultDTO<IEnumerable<string>>();

            try
            {
                var data = QuoteService.ValidateFinishedGood(quoteId, accountId, finishedGood);
                result = Mapper.Map<ActionResultDTO<IEnumerable<string>>>(data);
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DisassembleFinishedGood(string finishedGood)
        {
            var result = new string[] { "", "", "" };

            try
            {
                result = QuoteService.DisassembleFinishedGood(finishedGood);
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        private string GetNameForExcelExport(tbl_qthdr quote)
        {
            string name = quote.qthdr_name;
            if (quote.qthdr_name.Length > 20)
                name = name.Substring(0, 17) + "...";
            name = name
                .Replace(@"\", "_")
                .Replace("/", "_")
                .Replace("*", "_")
                .Replace("[", "_")
                .Replace("]", "_")
                .Replace(":", "_")
                .Replace("?", "_");
            name += $"-{quote.qthdr_qn_basis}-{quote.qthdr_rev}";
            return name;
        }

        [HttpPost]
        public JsonResult GetQuoteHistory(QuoteHistoryFindDTO param)
        {
            var data = UnitOfWork.TblQuoteHistory.Get(param.PageSize, param.PageNumber, param.QuoteNo);
            var dto = Mapper.Map<PageListDTO<ICollection<QuoteHistoryDTO>>>(data); 
            return Json(dto);
        }
    }
}
