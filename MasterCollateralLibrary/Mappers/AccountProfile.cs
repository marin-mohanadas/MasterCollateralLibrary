using AutoMapper;
using MCL.DTOs;
using MCL.EF.Model;

namespace MasterCollateralLibrary.Mappers
{
    public class AccountProfile : Profile
    {
        public AccountProfile()
        {
            CreateMap<tbl_acct, AccountDTO>().ReverseMap();
            CreateMap<tbl_acct, AccountFindDTO>().ReverseMap();
            CreateMap<tbl_acct_cat, AccountCategoryDTO>().ReverseMap();
        }
    }
}