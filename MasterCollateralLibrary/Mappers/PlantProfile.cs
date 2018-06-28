using AutoMapper;
using MCL.DTOs;
using MCL.EF.Model;

namespace MasterCollateralLibrary.Mappers
{
    public class PlantProfile : Profile
    {
        public PlantProfile()
        {
            CreateMap<tbl_plant, PlantDTO>();
        }
    }
}