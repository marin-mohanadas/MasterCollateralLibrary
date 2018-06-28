using AutoMapper;
using MCL.DTOs;
using MCL.DTOs.Quote;
using MCL.EF.Model;

namespace MasterCollateralLibrary.Mappers
{
    public class QuoteProfile : Profile
    {
        public QuoteProfile()
        {
            CreateMap<tbl_qtdtl, QuoteDetailDTO>().ReverseMap();
            CreateMap<tbl_qthdr, QuoteHdrDTO>().ReverseMap();

            // sub assembly
            CreateMap<QuoteSubAssemblyDTO, tbl_qtdtl>()
                .ForMember(_ => _.tbl_comp, options => options.Ignore())
                .ForMember(_ => _.tbl_qthdr, options => options.Ignore());
        }        
    }
}