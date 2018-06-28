using AutoMapper;
using MCL.DTOs;
using MCL.EF.Model;

namespace MasterCollateralLibrary.Mappers
{
    public class LanguageProfile : Profile
    {
        public LanguageProfile()
        {
            CreateMap<tbl_lang, LangDTO>().ReverseMap();
        }
    }
}