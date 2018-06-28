using AutoMapper;
using Hangfire;
using MasterCollateralLibrary.Mappers;
using MCL.DTOs;
using MCL.EF;
using MCL.EF.Model;
using Microsoft.Owin;
using Owin;
using System.Configuration;

[assembly: OwinStartupAttribute(typeof(MasterCollateralLibrary.Startup))]
namespace MasterCollateralLibrary
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            GlobalConfiguration.Configuration.UseSqlServerStorage(ConfigurationManager.ConnectionStrings["GRI_Identity"].ConnectionString, new Hangfire.SqlServer.SqlServerStorageOptions()
            {
                PrepareSchemaIfNecessary = true
            });

            GlobalConfiguration.Configuration.UseAutofacActivator(Jobs.JobFactory.Instance.Container);

            app.UseHangfireDashboard();
            app.UseHangfireServer();
            string cronExp = "0 1 * * 0";
            RecurringJob.AddOrUpdate<Jobs.IQuoteHistory>(t => t.Start(), cronExp);

            Mapper.Initialize(cfg =>
            {
                cfg.AddProfile<LanguageProfile>();
                cfg.AddProfile<PlantProfile>();
                
                cfg.CreateMap<tbl_HScode, HScodeDTO>();
                cfg.CreateMap<tbl_rep, RepDTO>();
                cfg.CreateMap<tbl_formulas, FormulaDTO>();
                cfg.CreateMap<tbl_formulas, FormulaFindDTO>();
                cfg.CreateMap<tbl_brand, BrandFindDTO>();
                cfg.CreateMap<tbl_brand, BrandDTO>();
                cfg.CreateMap<tbl_currncy, CurrencyDTO>();
                cfg.CreateMap<tbl_boxes, BoxDTO>();
                cfg.CreateMap<tbl_boxes, BoxFindDTO>();
                cfg.CreateMap<tbl_qtstatus, QuoteStatusDTO>().ReverseMap();
                cfg.CreateMap<tbl_vend, VendorDTO>().ReverseMap();

                cfg.AddProfile<ComponentProfile>();
                cfg.AddProfile<QuoteProfile>();
                cfg.AddProfile<AccountProfile>();
                                
                cfg.CreateMap<tbl_gpo, GpoDTO>().ReverseMap();
                cfg.CreateMap<tbl_dist, DistributorDTO>().ReverseMap();

                cfg.CreateMap(typeof(PageList<>), typeof(PageListDTO<>));
                cfg.CreateMap<tbl_CEclass, CEclassDTO>();
                cfg.CreateMap<tbl_techhdng, TechHdngDTO>();
                cfg.CreateMap<tbl_X_grpcomp, GrpCompDTO>();
                cfg.CreateMap<tbl_grpFAB, GrpFabDTO>();
                cfg.CreateMap<tbl_tech, TechDTO>();
                cfg.CreateMap<tbl_grppix, GrpPixDTO>();
                cfg.CreateMap<tbl_grpLbl, GrpLblDTO>();
                cfg.CreateMap<tbl_grpHdr, GrpHdrDTO>();
                cfg.CreateMap<tbl_grpHdr, GrpCreateDTO>();
                cfg.CreateMap<tbl_vendDtl, VendorDtlDTO>();
                cfg.CreateMap<tbl_vend, VendorCreateDTO>();
                cfg.CreateMap<tbl_cat1, Category1DTO>().ReverseMap();
                cfg.CreateMap<tbl_cat2, Category2DTO>().ReverseMap();
                cfg.CreateMap<tbl_cat1, Category1DetailDTO>();
                cfg.CreateMap<tbl_coo, CountryDTO>();
                cfg.CreateMap<tbl_strlty, SterilityDTO>();
                cfg.CreateMap<tbl_stat, StatDTO>();
                cfg.CreateMap<tbl_prodmgr, ProdMgrDTO>();
                cfg.CreateMap<tbl_purch, PurchaseDTO>().ReverseMap();
                cfg.CreateMap<tbl_cst_type, CostTypeDTO>();
                cfg.CreateMap<tbl_cst_type, CostTypeFindDTO>();
                cfg.CreateMap<tbl_uom, UomDTO>();                
                cfg.CreateMap<tbl_X_ref, ComponentCrossRefDTO>().ReverseMap();
                cfg.CreateMap<tbl_life_cycle, LifeCycleDTO>().ReverseMap();
                cfg.CreateMap<tbl_X_cat, ComponentCategoryDTO>().ReverseMap();
                cfg.CreateMap<tbl_X_trait, ComponentTraitDTO>().ReverseMap();
                cfg.CreateMap<tbl_trait, TraitDTO>().ReverseMap();
                cfg.CreateMap<tbl_material, MaterialDTO>().ReverseMap();
                cfg.CreateMap<tbl_material, MaterialFindDTO>().ReverseMap();
                cfg.CreateMap<tbl_X_material, ComponentMaterialDTO>().ReverseMap();
                cfg.CreateMap<tbl_X_spclty, ComponentSpecialtyDTO>().ReverseMap();
                cfg.CreateMap<tbl_spclty, SpecialtyDTO>().ReverseMap();
                cfg.CreateMap<tbl_lbl, ComponentLabelDTO>().ReverseMap();
                cfg.CreateMap<tbl_qthdr, QuoteCreateDTO>().ReverseMap();
                cfg.CreateMap<tbl_pix, ComponentPixDTO>().ReverseMap();
                cfg.CreateMap<tbl_cat, CategoryDTO>().ReverseMap();
                cfg.CreateMap<tbl_rep, RepFindDTO>();
                cfg.CreateMap<tbl_rep, RepDTO>().ReverseMap();

                cfg.CreateMap<tblExchRatesUSD, ExchRatesDTO>().ReverseMap();
                cfg.CreateMap<tblExchRatesUSD, ExchRatesDTO>();

                cfg.CreateMap<tbl_QuoteHistory, QuoteHistoryDTO>().ReverseMap();
                cfg.CreateMap<tbl_QuoteHistory, QuoteHistoryDTO>();

                cfg.CreateMap(typeof(ActionResult<>), typeof(ActionResultDTO<>));

                cfg.CreateMap<VendorContractItem, VendorContractItemsDTO>().ReverseMap();
                cfg.CreateMap<VendorContractItem, VendorContractItemsDTO>();

                cfg.CreateMap<tbl_ACLAccountExceptions, ComponentACLExceptionDTO>().ReverseMap();
                cfg.CreateMap<tbl_ACLAccountExceptions, ComponentACLExceptionDTO>();
            });
        }
    }
}
