using AutoMapper;
using ClosedXML.Excel;
using MasterCollateralLibrary.Controllers;
using MasterCollateralLibrary.Extensions;
using MasterCollateralLibrary.Models;
using MCL.DTOs;
using MCL.EF;
using MCL.EF.DAL;
using MCL.EF.DAL.Interfaces;
using MCL.EF.Model;
using MCL.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SharedReportMethods;
using System.Threading.Tasks;

namespace MasterCollateralLibrary.Jobs
{
    public class QuoteHistory : IQuoteHistory
    {
        protected readonly IUnitOfWork UnitOfWork;
        protected readonly IQuoteService QuoteService;
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public QuoteHistory()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
            QuoteService = new QuoteService(UnitOfWork);
        }

        public void Start()
        {
            _logger.Debug("Quote History Weekly Job Start");
            //string[] QuoteStatusList = { "QC Check", "Production Change", "New Award", "QC Confirmed", "In Process / Editing" };
            //foreach(string quoteStatus in QuoteStatusList)
            //{
            try
            {
                DataTable QuoteList = Get_Quotes();
                int QuoteCount = QuoteList.Rows.Count;
                int i = 0;
                _logger.Debug(string.Format("Number of {0} Quotes to be inserted/updated", QuoteCount));
                //while (i++ < QuoteCount)
                //{
                foreach (DataRow quote in QuoteList.Rows)
                {
                    int quoteid = (int)quote[0];
                    try
                    {
                        InsertToSQL(QuoteService.GetPackQuoteReport(quoteid), quoteid);
                    }
                    catch (Exception ex)
                    {
                        _logger.Error(string.Format("Error on Quote {0}: {1}", i, ex.ToString()));
                    }
                    //}

                }


                //int page_limit = 20;
                //var quotes = Find(page_limit, quoteStatus);
                //decimal Total = quotes.Total;

                //decimal Total_Pages = Math.Ceiling(Total / page_limit) + 1;
                //int i = 0;

                //_logger.Debug(string.Format("{0} - Number of {1} Quotes to be inserted", quotes.Total.ToString(), quoteStatus));
                //_logger.Debug(string.Format("{0} - Number of Pages", Total_Pages.ToString()));

                //while (i++ < Total_Pages)
                //{
                //    _logger.Debug(string.Format("Page {0} of {1}", i, Total_Pages));
                //    foreach (QuoteHdrDTO row in quotes.Data.ToList())
                //    {
                //        try
                //        {
                //            InsertToSQL(QuoteService.GetPackQuoteReport(row.id), row.id);
                //        }
                //        catch (Exception ex)
                //        {
                //            _logger.Error(string.Format("Error on Quote {0}: {1}", row.id, ex.ToString()));
                //        }

                //    }
                //    quotes = Find(i, quoteStatus);
                //}

            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            finally
            {
                _logger.Debug(string.Format("Quote History Weekly Job Ended For - {0}", ""));
            }
            //}

        }
        protected DataTable Get_Quotes()
        {
            DataTable dt = new DataTable();
            dt = Data.GetDataFromSql(@"SELECT        dbo.tbl_qthdr.id
                                        FROM            dbo.tbl_qthdr INNER JOIN
                                                                 dbo.tbl_qtstatus ON dbo.tbl_qthdr.qthdr_status_id = dbo.tbl_qtstatus.id
                                        WHERE        (dbo.tbl_qtstatus.qtstatus_desc IN (N'QC Check', N'Production Change', N'New Award', N'QC Confirmed', N'In Process / Editing')) AND (dbo.tbl_qthdr.qthdr_deleted = 0) AND (ISNULL(dbo.tbl_qthdr.qthdr_qcApproval, 0) = 0) AND 
                                                                 (NOT (dbo.tbl_qthdr.id IN
                                                                     (SELECT        dbo.tbl_QuoteHistory.id
                                                                       FROM            dbo.tbl_QuoteHistory LEFT OUTER JOIN
                                                                                                 dbo.tbl_qthdr AS tbl_qthdr_1 ON dbo.tbl_QuoteHistory.QuoteNo = tbl_qthdr_1.id
                                                                       WHERE        (dbo.tbl_QuoteHistory.Date_Recorded < GETDATE()))))");
            return dt;
        }
        //public PageListDTO<ICollection<QuoteHdrDTO>> Find(int page, string quoteStatus)
        //{
        //    //var data = UnitOfWork.TblQtHdr.Find(10, page, "id", "asc", null, null, null, false, null, null, null, null, null, null, false, null, false, null, "New Award");
        //    var data = UnitOfWork.TblQtHdr.Find(20, page, "id", "asc", null, null, null, false, null, null, null, null, null, null, null, null, false, null, quoteStatus);
        //    var dto = Mapper.Map<PageListDTO<ICollection<QuoteHdrDTO>>>(data);
        //    return dto;
        //}
        //public PageListDTO<ICollection<QuoteHdrDTO>> Find_All_Quotes(int page)
        //{
        //    //var data = UnitOfWork.TblQtHdr.Find(10, page, "id", "asc", null, null, null, false, null, null, null, null, null, null, false, null, false, null, "New Award");
        //    var data = UnitOfWork.TblQtHdr.Find(10, page, "qn_basis", "asc", null, null, null, false, null, null, null, null, null, null, null, null, false, null, null);
        //    var dto = Mapper.Map<PageListDTO<ICollection<QuoteHdrDTO>>>(data);
        //    return dto;
        //}

        public void InsertToSQL(ActionResult<PackQuoteReport> quote, int QuoteNo)
        {
            try
            {
                DateTime startOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + (int)DayOfWeek.Sunday);
                DateTime endOfWeek = startOfWeek.AddDays(7);

                var HistoryLookup = new QuoteHistoryController().Find(QuoteNo, startOfWeek, endOfWeek);
                if (HistoryLookup.Total == 0)
                {
                    var result = new QuoteHistoryController().SaveNew(quote);
                    _logger.Debug(string.Format("QuoteID {0} Calculation Inserted...", QuoteNo));
                }
                else
                {
                    foreach (QuoteHistoryDTO row in HistoryLookup.Data.ToList())
                    {
                        if (row.Date_Recorded > startOfWeek.AddSeconds(-1) && row.Date_Recorded < endOfWeek)
                        {
                            var result = new QuoteHistoryController().Update(quote, row.id);
                            _logger.Debug(string.Format("QuoteID {0} Calculation Updated...", QuoteNo));
                        }
                        //else
                        //{
                        //    var result = new QuoteHistoryController().SaveNew(quote);
                        //}
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.Error(string.Format("Error inserting quote {0} into SQL: {1}", quote.Result.QuoteNo, ex.ToString()));
            }
        }

    }
}