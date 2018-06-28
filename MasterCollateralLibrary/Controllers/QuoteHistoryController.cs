using AutoMapper;
using MCL.DTOs;
using MCL.EF;
using MCL.EF.DAL;
using MCL.EF.DAL.Interfaces;
using MCL.EF.Model;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MasterCollateralLibrary.Controllers
{
    [Authorize]
    public class QuoteHistoryController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public QuoteHistoryController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
        }

        // GET: QuoteHistory
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetQuoteHistory()
        {
            var data = UnitOfWork.TblQuoteHistory.GetAll()
                .OrderBy(t => t.QuoteNo)
                .ToList();

            var dto = Mapper.Map<IEnumerable<QuoteHistoryDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        //[HttpGet]
        //public PageListDTO<ICollection<QuoteHistoryDTO>> GetQuoteHistory(int id)
        //{
        //    var data = UnitOfWork.TblQuoteHistory.Get(id);
        //    var dto = Mapper.Map<PageListDTO<ICollection<QuoteHistoryDTO>>>(data);
        //    return dto;
        //}
        [HttpPost]
        public PageListDTO<ICollection<QuoteHistoryDTO>> Find(int QuoteNo, DateTime startdate, DateTime enddate)
        {
            var data = UnitOfWork.TblQuoteHistory.Find(QuoteNo,startdate,enddate);
            var dto = Mapper.Map<PageListDTO<ICollection<QuoteHistoryDTO>>>(data);
            //return Json(dto, JsonRequestBehavior.AllowGet);
            return dto;
        }

        //[HttpPost]
        //public JsonResult Find(QuoteHistoryFindDTO param)
        //{
        //    var data = UnitOfWork.TblQuoteHistory.Find(param.PageSize, param.PageNumber,
        //        param.SortBy, param.SortDir);
        //    var dto = Mapper.Map<PageListDTO<ICollection<QuoteHistoryDTO>>>(data);
        //    return Json(dto, JsonRequestBehavior.AllowGet);
        //}

        [HttpPut]
        public JsonResult Update(ActionResult<PackQuoteReport> dto, int id)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblQuoteHistory.GetUpdate(id).Data.ToList().FirstOrDefault();

                if (model != null)
                {
                    model.Date_Recorded = System.DateTime.Now;
                    model.Customer = dto.Result.Customer;
                    model.QuoteNo = dto.Result.QuoteNo;
                    model.QuoteNoAndRev = dto.Result.QuoteNoAndRev;
                    model.Tray = dto.Result.Tray;
                    model.Description = dto.Result.Desc;
                    model.PrintDate = dto.Result.PrintDate;
                    model.AccountId = dto.Result.AccountId;
                    model.MonthlyUsage = dto.Result.MonthlyUsage;
                    model.CaseQty = dto.Result.CaseQty;
                    model.MaterialCost = Convert.ToDecimal(dto.Result.MaterialCost);
                    model.MaterialCostCS = Convert.ToDecimal(dto.Result.MaterialCostCS);
                    model.ComponentShippingCost = Convert.ToDecimal(dto.Result.ComponentShippingCost);
                    model.ComponentShippingCostCS = Convert.ToDecimal(dto.Result.ComponentShippingCostCS);
                    model.TotalMaterialCost = Convert.ToDecimal(dto.Result.TotalMaterialCost);
                    model.TotalMaterialCostCS = Convert.ToDecimal(dto.Result.TotalMaterialCostCS);
                    model.ComponentCount = dto.Result.ComponentCount;
                    model.LaborTimeInSeconds = Convert.ToDecimal(dto.Result.LaborTimeInSeconds);
                    model.LaborRate = Convert.ToDecimal(dto.Result.LaborRate);
                    model.LaborFactor = Convert.ToDecimal(dto.Result.LaborFactor);
                    model.LaborCost = Convert.ToDecimal(dto.Result.LaborCost);
                    model.LaborCostCS = Convert.ToDecimal(dto.Result.LaborCostCS);
                    model.SterilizationCostCS = Convert.ToDecimal(dto.Result.SterilizationCostCS);
                    model.SterilizationCost = Convert.ToDecimal(dto.Result.SterilizationCost);
                    model.DirectCost = Convert.ToDecimal(dto.Result.DirectCost);
                    model.DirectCostCS = Convert.ToDecimal(dto.Result.DirectCostCS);
                    model.OverheadCost = Convert.ToDecimal(dto.Result.OverheadCost);
                    model.OverheadCostCS = Convert.ToDecimal(dto.Result.OverheadCostCS);
                    model.InlandFreightCost = Convert.ToDecimal(dto.Result.InlandFreightCost);
                    model.InlandFreightCostCS = Convert.ToDecimal(dto.Result.InlandFreightCostCS);
                    model.GACost = Convert.ToDecimal(dto.Result.GACost);
                    model.GACostCS = Convert.ToDecimal(dto.Result.GACostCS);
                    model.FinanceCost = Convert.ToDecimal(dto.Result.FinanceCost);
                    model.FinanceCostCS = Convert.ToDecimal(dto.Result.FinanceCostCS);
                    model.WarehouseCost = Convert.ToDecimal(dto.Result.WarehouseCost);
                    model.WarehouseCostCS = Convert.ToDecimal(dto.Result.WarehouseCostCS);
                    model.StandardCost = Convert.ToDecimal(dto.Result.StandardCost);
                    model.StandardCostCS = Convert.ToDecimal(dto.Result.StandardCostCS);
                    model.PreImportSellingPrice = Convert.ToDecimal(dto.Result.PreImportSellingPrice);
                    model.PreImportSellingPriceCS = Convert.ToDecimal(dto.Result.PreImportSellingPriceCS);
                    model.OceanFreightCost = Convert.ToDecimal(dto.Result.OceanFreightCost);
                    model.OceanFreightCostCS = Convert.ToDecimal(dto.Result.OceanFreightCostCS);
                    model.ImportDuty = Convert.ToDecimal(dto.Result.ImportDuty);
                    model.ImportDutyCS = Convert.ToDecimal(dto.Result.ImportDutyCS);
                    model.ExciseTax = Convert.ToDecimal(dto.Result.ExciseTax);
                    model.ExciseTaxCS = Convert.ToDecimal(dto.Result.ExciseTaxCS);
                    model.TotalImportCost = Convert.ToDecimal(dto.Result.TotalImportCost);
                    model.TotalImportCostCS = Convert.ToDecimal(dto.Result.TotalImportCostCS);
                    model.FinalMfgCost = Convert.ToDecimal(dto.Result.FinalMfgCost);
                    model.FinalMfgCostCS = Convert.ToDecimal(dto.Result.FinalMfgCostCS);

                    model.Fees = Convert.ToDecimal(dto.Result.Fees);
                    model.FeesCS = Convert.ToDecimal(dto.Result.FeesCS);

                    model.FinalMfgCostAndFees = Convert.ToDecimal(dto.Result.FinalMfgCostAndFees);
                    model.FinalMfgCostAndFeesCS = Convert.ToDecimal(dto.Result.FinalMfgCostAndFeesCS);
                    
                    model.Margin = Convert.ToDecimal(dto.Result.Margin);
                    model.FinalPrice = Convert.ToDecimal(dto.Result.FinalPrice);
                    model.FinalPriceCS = Convert.ToDecimal(dto.Result.FinalPriceCS);
                    model.PackTotal = Convert.ToDecimal(dto.Result.PackTotal);
                    model.SellPrice = Convert.ToDecimal(dto.Result.SellPrice);


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
        public JsonResult SaveNew(ActionResult<PackQuoteReport> dto)
        {
            bool succeeded = false;

            try
            {
                var model = new tbl_QuoteHistory();

                //model.id = dto.id;
                model.Date_Recorded = System.DateTime.Now;
                model.Customer = dto.Result.Customer;
                model.QuoteNo = dto.Result.QuoteNo;
                model.QuoteNoAndRev = dto.Result.QuoteNoAndRev;
                model.Tray = dto.Result.Tray;
                model.Description = dto.Result.Desc;
                model.PrintDate = dto.Result.PrintDate;
                model.AccountId = dto.Result.AccountId;
                model.MonthlyUsage = dto.Result.MonthlyUsage;
                model.CaseQty = dto.Result.CaseQty;
                model.MaterialCost = Convert.ToDecimal(dto.Result.MaterialCost);
                model.MaterialCostCS = Convert.ToDecimal(dto.Result.MaterialCostCS);
                model.ComponentShippingCost = Convert.ToDecimal(dto.Result.ComponentShippingCost);
                model.ComponentShippingCostCS = Convert.ToDecimal(dto.Result.ComponentShippingCostCS);
                model.TotalMaterialCost = Convert.ToDecimal(dto.Result.TotalMaterialCost);
                model.TotalMaterialCostCS = Convert.ToDecimal(dto.Result.TotalMaterialCostCS);
                model.ComponentCount = dto.Result.ComponentCount;
                model.LaborTimeInSeconds = Convert.ToDecimal(dto.Result.LaborTimeInSeconds);
                model.LaborRate = Convert.ToDecimal(dto.Result.LaborRate);
                model.LaborFactor = Convert.ToDecimal(dto.Result.LaborFactor);
                model.LaborCost = Convert.ToDecimal(dto.Result.LaborCost);
                model.LaborCostCS = Convert.ToDecimal(dto.Result.LaborCostCS);
                model.SterilizationCostCS = Convert.ToDecimal(dto.Result.SterilizationCostCS);
                model.SterilizationCost = Convert.ToDecimal(dto.Result.SterilizationCost);
                model.DirectCost = Convert.ToDecimal(dto.Result.DirectCost);
                model.DirectCostCS = Convert.ToDecimal(dto.Result.DirectCostCS);
                model.OverheadCost = Convert.ToDecimal(dto.Result.OverheadCost);
                model.OverheadCostCS = Convert.ToDecimal(dto.Result.OverheadCostCS);
                model.InlandFreightCost = Convert.ToDecimal(dto.Result.InlandFreightCost);
                model.InlandFreightCostCS = Convert.ToDecimal(dto.Result.InlandFreightCostCS);
                model.GACost = Convert.ToDecimal(dto.Result.GACost);
                model.GACostCS = Convert.ToDecimal(dto.Result.GACostCS);
                model.FinanceCost = Convert.ToDecimal(dto.Result.FinanceCost);
                model.FinanceCostCS = Convert.ToDecimal(dto.Result.FinanceCostCS);
                model.WarehouseCost = Convert.ToDecimal(dto.Result.WarehouseCost);
                model.WarehouseCostCS = Convert.ToDecimal(dto.Result.WarehouseCostCS);
                model.StandardCost = Convert.ToDecimal(dto.Result.StandardCost);
                model.StandardCostCS = Convert.ToDecimal(dto.Result.StandardCostCS);
                model.PreImportSellingPrice = Convert.ToDecimal(dto.Result.PreImportSellingPrice);
                model.PreImportSellingPriceCS = Convert.ToDecimal(dto.Result.PreImportSellingPriceCS);
                model.OceanFreightCost = Convert.ToDecimal(dto.Result.OceanFreightCost);
                model.OceanFreightCostCS = Convert.ToDecimal(dto.Result.OceanFreightCostCS);
                model.ImportDuty = Convert.ToDecimal(dto.Result.ImportDuty);
                model.ImportDutyCS = Convert.ToDecimal(dto.Result.ImportDutyCS);
                model.ExciseTax = Convert.ToDecimal(dto.Result.ExciseTax);
                model.ExciseTaxCS = Convert.ToDecimal(dto.Result.ExciseTaxCS);
                model.TotalImportCost = Convert.ToDecimal(dto.Result.TotalImportCost);
                model.TotalImportCostCS = Convert.ToDecimal(dto.Result.TotalImportCostCS);
                model.FinalMfgCost = Convert.ToDecimal(dto.Result.FinalMfgCost);
                model.FinalMfgCostCS = Convert.ToDecimal(dto.Result.FinalMfgCostCS);

                model.Fees = Convert.ToDecimal(dto.Result.Fees);
                model.FeesCS = Convert.ToDecimal(dto.Result.FeesCS);

                model.FinalMfgCostAndFees = Convert.ToDecimal(dto.Result.FinalMfgCostAndFees);
                model.FinalMfgCostAndFeesCS = Convert.ToDecimal(dto.Result.FinalMfgCostAndFeesCS);

                model.Margin = Convert.ToDecimal(dto.Result.Margin);
                model.FinalPrice = Convert.ToDecimal(dto.Result.FinalPrice);
                model.FinalPriceCS = Convert.ToDecimal(dto.Result.FinalPriceCS);
                model.PackTotal = Convert.ToDecimal(dto.Result.PackTotal);
                model.SellPrice = Convert.ToDecimal(dto.Result.SellPrice);


                UnitOfWork.TblQuoteHistory.Add(model);

                UnitOfWork.Save();
               // dto.id = model.id;

            }
            catch (Exception ex)
            {
                //dto.id = 0;
            }
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult Delete(int id)
        {
            bool succeeded = false;

            try
            {
                var model = UnitOfWork.TblQuoteHistory.Get(id);

                if (model != null)
                {
                    UnitOfWork.TblQuoteHistory.Remove(model);
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