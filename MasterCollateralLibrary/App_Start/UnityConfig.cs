using System;
using Microsoft.Practices.Unity;
using MCL.EF.DAL;
using MCL.Services;
using MCL.EF.DAL.Interfaces;
using MasterCollateralLibrary.Controllers;

namespace MasterCollateralLibrary.App_Start
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    public class UnityConfig
    {
        #region Unity Container
        private static Lazy<IUnityContainer> container = new Lazy<IUnityContainer>(() =>
        {
            var container = new UnityContainer();
            RegisterTypes(container);
            return container;
        });

        /// <summary>
        /// Gets the configured Unity container.
        /// </summary>
        public static IUnityContainer GetConfiguredContainer()
        {
            return container.Value;
        }
        #endregion

        /// <summary>Registers the type mappings with the Unity container.</summary>
        /// <param name="container">The unity container to configure.</param>
        /// <remarks>There is no need to register concrete types such as controllers or API controllers (unless you want to 
        /// change the defaults), as Unity allows resolving a concrete type even if it was not previously registered.</remarks>
        public static void RegisterTypes(IUnityContainer container)
        {
            // NOTE: To load from web.config uncomment the line below. Make sure to add a Microsoft.Practices.Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            // TODO: Register your types here
            //container.RegisterInstance(typeof(DbContext), new GRI_DBEntities());

            //container.RegisterType<ITblQtHdrRepository, TblQtHdrRepository>();
            //container.RegisterType<ITblQtDtlRepository, TblQtDtlRepository>();
            //container.RegisterType<ITblLangRepository, TblLangRepository>();
            //container.RegisterType<ITblPlantRepository, TblPlantRepository>();
            //container.RegisterType<ITblHScodeRepository, TblHScodeRepository>();
            //container.RegisterType<ITblRepRepository, TblRepRepository>();
            //container.RegisterType<ITblFormulaRepository, TblFormulaRepository>();
            //container.RegisterType<ITblBrandRepository, TblBrandRepository>();
            //container.RegisterType<ITblCurrencyRepository, TblCurrencyRepository>();
            //container.RegisterType<ITblBoxRepository, TblBoxRepository>();
            //container.RegisterType<ITblQtStatusRepository, TblQtStatusRepository>();

            container.RegisterType<AccountController>(new InjectionConstructor());

            //container.RegisterType<IUnitOfWork, UnitOfWork>();

            // business layer
            //container.RegisterType<IQuoteService, QuoteService>();


        }
    }
}
