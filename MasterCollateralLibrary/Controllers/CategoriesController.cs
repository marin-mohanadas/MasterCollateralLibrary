using AutoMapper;
using MCL.DTOs;
using MCL.EF.DAL;
using MCL.EF.DAL.Interfaces;
using MCL.EF.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace MasterCollateralLibrary.Controllers
{
    [Authorize]
    public class CategoriesController : Controller
    {
        protected readonly IUnitOfWork UnitOfWork;

        public CategoriesController()
        {
            UnitOfWork = new UnitOfWork(new GRI_DBEntities());
        }

        // GET: Categories
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet] 
        public JsonResult GetRootCategories()
        {
            var data = UnitOfWork.TblCat.GetRootCategories();
            var dto = Mapper.Map<ICollection<CategoryDTO>>(data);
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetParentTreeNodes()
        {
            var results = new List<TreeNodeDTO>();

            var data = UnitOfWork.TblCat.GetRootCategories();

            if (data != null)
            {
                foreach (var d in data)
                {
                    var node = new TreeNodeDTO();
                    node.Id = d.id;
                    node.Name = d.cat_desc;
                    node.HasChildren = (d.children != null && d.children.Count > 0);
                    node.CatId = d.id;
                    results.Add(node);
                }
            }

            return Json(results, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetChildrenTreeNodes(int id)
        {
            var results = new List<TreeNodeDTO>();

            var data = UnitOfWork.TblCat.GetChildrenCategories(id);

            if (data != null && data.Count() > 0)
            {
                foreach (var d in data)
                {
                    var node = new TreeNodeDTO();
                    node.Id = d.id;
                    node.Name = d.cat_desc;
                    node.HasChildren = (d.children != null && d.children.Count > 0);
                    node.CatId = d.id;

                    if (!node.HasChildren)
                    {
                        node.HasItem = UnitOfWork.TblComp.GetByCategoryId(node.Id).Count() > 0;
                    }

                    results.Add(node);
                }
            }
            else
            {
                // get items
                var items = UnitOfWork.TblComp.GetByCategoryId(id);
                if (items != null)
                {
                    results.AddRange(items.Select(t => new TreeNodeDTO()
                    {
                        Id = t.id,
                        Name = string.IsNullOrEmpty(t.comp_desc_orig) ? t.comp_vend_pn : t.comp_desc_orig,
                        HasChildren = false,
                        HasItem = false,
                        IsItem = true,
                        CatId = t.comp_cat_id ?? 0
                    }).ToList());
                }
            }

            return Json(results, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Create(CategoryDTO dto)
        {
            CategoryDTO result = null;
            try
            {
                var entity = Mapper.Map<tbl_cat>(dto);

                if (entity != null)
                {
                    UnitOfWork.TblCat.Add(entity);
                    UnitOfWork.Save();
                    result = Mapper.Map<CategoryDTO>(entity);
                }
            }
            catch (Exception ex)
            {
                result = null;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult Update(int id, CategoryDTO dto)
        {            
            bool result = false;
            try
            {                
                var entity = UnitOfWork.TblCat.Get(id);                

                if (entity != null)
                {
                    bool parentIdChanged = entity.parent_id == dto.parent_id;
                    entity.cat_desc = dto.cat_desc;
                    entity.parent_id = dto.parent_id;
                    UnitOfWork.Save();

                    if (parentIdChanged)
                    {
                        // remove cross ref
                        // may need to remove the opposite cross ref
                        var refItems = UnitOfWork.TblXRef.GetEquivByCompId(id);

                        if (refItems != null && refItems.Count() > 0)
                        {
                            UnitOfWork.TblXRef.RemoveRange(refItems);
                            UnitOfWork.Save();
                        }
                    }

                    result = true;
                }
            }
            catch (Exception ex)
            {
                result = false;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult Delete(int id)
        {
            bool result = false;
            try
            {
                var entity = UnitOfWork.TblCat.Get(id);

                if (entity != null)
                {
                    UnitOfWork.TblCat.Remove(entity);
                    UnitOfWork.Save();

                    // remove from comp
                    // or should we assign these comps to a parent product group?
                    var items = UnitOfWork.TblComp.GetByCategoryId(id);

                    if (items != null)
                    {
                        foreach (var item in items)
                        {
                            item.comp_cat_id = null;
                            UnitOfWork.Save();

                            // remove cross ref
                            // may need to remove the opposite cross ref
                            var refItems = UnitOfWork.TblXRef.GetEquivByCompId(id);
                            
                            if (refItems != null && refItems.Count() > 0)
                            {
                                UnitOfWork.TblXRef.RemoveRange(refItems);
                                UnitOfWork.Save();
                            }
                        }
                    }

                    result = true;
                }
            }
            catch (Exception ex)
            {
                result = false;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetCatFullPath(int id)
        {
            string result = "";

            var entity = UnitOfWork.TblCat.Get(id);

            if (entity != null)
            {
                List<string> path = new List<string>();
                path.Add(entity.cat_desc);
                
                while (entity.parent != null)
                {
                    entity = entity.parent;
                    path.Add(entity.cat_desc);
                }

                path.Reverse();
                result = string.Join(" > ", path);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetCrossRefTree(int id)
        {
            TreeNodeDTO result = null;
            var entity = UnitOfWork.TblCat.Get(id);

            if (entity != null)
            {
                result = new TreeNodeDTO();
                result.Id = entity.id;
                result.Name = entity.cat_desc;                
                result.CatId = entity.id;
                

                var items = UnitOfWork.TblComp.GetByCategoryId(id);
                result.HasItem = items != null && items.Any();
                result.HasChildren = items != null && items.Any();
                if (items != null)
                {
                    result.Children = items.Select(t => new TreeNodeDTO()
                    {
                        Id = t.id,
                        Name = string.IsNullOrEmpty(t.comp_desc_orig) ? t.comp_vend_pn : t.comp_desc_orig,
                        HasChildren = false,
                        HasItem = false,
                        IsItem = true,
                        CatId = t.comp_cat_id ?? 0
                    }).ToList();
                }

                while (entity.parent != null)
                {
                    entity = entity.parent;
                    var parent = new TreeNodeDTO();
                    parent.Id = entity.id;
                    parent.Name = entity.cat_desc;
                    parent.CatId = entity.id;
                    parent.HasChildren = true;
                    parent.HasItem = false;
                    parent.Children.Add(result);
                    result = parent;
                }
            }
            return Json(new List<TreeNodeDTO>() { result }, JsonRequestBehavior.AllowGet);            
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                UnitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}