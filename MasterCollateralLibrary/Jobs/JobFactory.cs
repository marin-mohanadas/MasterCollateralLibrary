using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Hangfire;
using System;
using System.Configuration;
using Autofac;
using MasterCollateralLibrary.Extensions;
using MasterCollateralLibrary.Models;
using MCL.DTOs;
using MCL.EF;
using MCL.EF.DAL;
using MCL.EF.DAL.Interfaces;
using MCL.EF.Model;
using MCL.Services;

namespace MasterCollateralLibrary.Jobs
{
    public class JobFactory
    {
        private static readonly Lazy<JobFactory> _lazy = new Lazy<JobFactory>(() => new JobFactory());

        public static JobFactory Instance { get { return _lazy.Value; } }

        public ContainerBuilder ContainerBuilder { get; private set; }

        public IContainer Container { get; private set; }

        private JobFactory()
        {
            ContainerBuilder = new ContainerBuilder();
            Map();
            Build();
        }

        private void Map()
        {
            ContainerBuilder.RegisterType<Jobs.QuoteHistory>().As<Jobs.IQuoteHistory>().InstancePerBackgroundJob();
        }

        private void Build()
        {
            Container = ContainerBuilder.Build();
        }
    }
}