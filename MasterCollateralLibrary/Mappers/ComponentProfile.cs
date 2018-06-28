using AutoMapper;
using MCL.DTOs;
using MCL.EF.Model;

namespace MasterCollateralLibrary.Mappers
{
    public class ComponentProfile : Profile
    {
        public ComponentProfile()
        {
            CreateMap<tbl_comp, ComponentLiteDTO>().ReverseMap();
            CreateMap<tbl_comp, ComponentVendorDTO>().ReverseMap();
            CreateMap<tbl_comp, ComponentDTO>().ReverseMap();
            CreateMap<tbl_comp, ComponentCreateDTO>();
        }
    }
}