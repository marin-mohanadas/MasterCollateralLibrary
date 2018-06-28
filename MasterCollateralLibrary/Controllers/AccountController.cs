using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using MasterCollateralLibrary.Models;
using MCL.DTOs;
using MCL.DTOs.Users;
using System.Collections.Generic;
using NLog;
using Newtonsoft.Json;

namespace MasterCollateralLibrary.Controllers
{    
    [Authorize]
    public class AccountController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private ApplicationDbContext _dbContext;

        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public AccountController()
        {
        }

        //public AccountController(ApplicationUserManager userManager, 
        //    ApplicationSignInManager signInManager,
        //    ApplicationDbContext context)
        //{
        //    UserManager = userManager;
        //    SignInManager = signInManager;
        //    _context = context;
        //}

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set 
            { 
                _signInManager = value; 
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ApplicationDbContext DbContext
        {
            get
            {
                return _dbContext ?? HttpContext.GetOwinContext().Get<ApplicationDbContext>();
            }
            private set
            {
                _dbContext = value;
            }
        }

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true
            var result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid login attempt.");
                    return View(model);
            }
        }

        //
        // GET: /Account/VerifyCode
        [AllowAnonymous]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe)
        {
            // Require that the user has already logged in via username/password or external login
            if (!await SignInManager.HasBeenVerifiedAsync())
            {
                return View("Error");
            }
            return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/VerifyCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes. 
            // If a user enters incorrect codes for a specified amount of time then the user account 
            // will be locked out for a specified amount of time. 
            // You can configure the account lockout settings in IdentityConfig
            var result = await SignInManager.TwoFactorSignInAsync(model.Provider, model.Code, isPersistent:  model.RememberMe, rememberBrowser: model.RememberBrowser);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(model.ReturnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid code.");
                    return View(model);
            }
        }

        //
        // GET: /Account/Register
        //[AllowAnonymous]
        public ActionResult Register()
        {
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        //[AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await SignInManager.SignInAsync(user, isPersistent:false, rememberBrowser:false);
                    
                    // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    // string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    // var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    // await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");

                    return RedirectToAction("Index", "Home");
                }
                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ConfirmEmail
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return View("Error");
            }
            var result = await UserManager.ConfirmEmailAsync(userId, code);
            return View(result.Succeeded ? "ConfirmEmail" : "Error");
        }

        //
        // GET: /Account/ForgotPassword
        //[AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        //
        // POST: /Account/ForgotPassword
        [HttpPost]
        //[AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByNameAsync(model.Email);
                if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    return View("ForgotPasswordConfirmation");
                }

                // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=320771
                // Send an email with this link
                // string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                // var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);		
                // await UserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>");
                // return RedirectToAction("ForgotPasswordConfirmation", "Account");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ForgotPasswordConfirmation
        //[AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        //
        // GET: /Account/ResetPassword
        //[AllowAnonymous]
        public ActionResult ResetPassword(string code)
        {
            return code == null ? View("Error") : View();
        }

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        //[AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await UserManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
            if (result.Succeeded)
            {
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            AddErrors(result);
            return View();
        }

        //
        // GET: /Account/ResetPasswordConfirmation
        //[AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        //[AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/SendCode
        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe)
        {
            var userId = await SignInManager.GetVerifiedUserIdAsync();
            if (userId == null)
            {
                return View("Error");
            }
            var userFactors = await UserManager.GetValidTwoFactorProvidersAsync(userId);
            var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
            return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/SendCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SendCode(SendCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            // Generate the token and send it
            if (!await SignInManager.SendTwoFactorCodeAsync(model.SelectedProvider))
            {
                return View("Error");
            }
            return RedirectToAction("VerifyCode", new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            // Sign in the user with this external login provider if the user already has a login
            var result = await SignInManager.ExternalSignInAsync(loginInfo, isPersistent: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = false });
                case SignInStatus.Failure:
                default:
                    // If the user does not have an account, then prompt the user to create an account
                    ViewBag.ReturnUrl = returnUrl;
                    ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                    return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = loginInfo.Email });
            }
        }

        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Manage");
            }

            if (ModelState.IsValid)
            {
                // Get the information about the user from the external login provider
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (result.Succeeded)
                    {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                        return RedirectToLocal(returnUrl);
                    }
                }
                AddErrors(result);
            }

            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return RedirectToAction("Index", "Home");
        }

        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        [Authorize]
        [HttpGet]
        public JsonResult UserProfile()
        {
            UserProfileDTO dto = null;

            if (User.Identity.IsAuthenticated)
            {
                dto = new UserProfileDTO();                
                var userId = User.Identity.GetUserId();
                var user = UserManager.FindById(userId);
                dto.Username = user.UserName;
                dto.Roles = UserManager.GetRoles(userId);
                var claims = UserManager.GetClaims(userId);
                if (claims != null)
                {
                    dto.Claims = claims
                        .Select(t => new UserClaimDTO()
                            { Key = t.Type, Value = t.Value })
                        .ToList();
                }

                dto.CanAwardQuote = Extensions.AuthHelper
                    .IsAllowed(dto.Roles, "QuoteMaster", "CreateNewAwardFromId", "POST");
                dto.CanCreateComponent = Extensions.AuthHelper
                    .IsAllowed(dto.Roles, "ComponentList", "Create", "POST");
                dto.CanUpdateComponent = Extensions.AuthHelper
                    .IsAllowed(dto.Roles, "ComponentList", "Update", "PUT");

            }
            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost]
        public JsonResult Find(UserFindDTO param)
        {
            var query = UserManager.Users.AsQueryable();

            if (!string.IsNullOrEmpty(param.Email))
                query = query.Where(t => t.Email.StartsWith(param.Email));

            int total = query.Count();

            if (param.SortBy == "email" && param.SortDir == "asc")
                query = query.OrderBy(t => t.Email);
            else if (param.SortBy == "email" && param.SortDir == "desc")
                query = query.OrderByDescending(t => t.Email);
            else
                query = query.OrderBy(t => t.Email);

            int pages = (int)Math.Ceiling((double)total / param.PageSize);
            int skip = (param.PageNumber - 1) * param.PageSize;
            var data = query.Skip(skip).Take(param.PageSize)
                .Select(t => new UserLiteDTO
                {
                    Id = t.Id,
                    Email = t.Email
                }).ToList();

            var dto = new PageListDTO<IEnumerable<UserLiteDTO>>()
            {
                Total = total,
                Data = data
            };

            return Json(dto, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet]
        public JsonResult Get(string id)
        {
            UserCreateDTO result = null;

            try
            {
                var user = UserManager.FindById(id);

                if (user != null)
                {                    
                    result = new UserCreateDTO();
                    result.Id = user.Id;
                    result.Email = user.Email;
                    result.Roles = UserManager.GetRoles(user.Id);
                    result.Claims = UserManager.GetClaims(user.Id)
                        .Select(t => new UserClaimDTO() { Key = t.Type, Value = t.Value })
                        .ToList();
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost]
        public async Task<JsonResult> Create(UserCreateDTO model)
        {
            var result = new ActionResultDTO<UserLiteDTO>();

            try
            {
                if (model.Password != model.ConfirmPassword)
                {
                    result.Errors.Add("Password and Confirm Password do not match.");
                    return Json(result, JsonRequestBehavior.AllowGet);
                }

                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var createResult = await UserManager.CreateAsync(user, model.Password);

                if (createResult.Succeeded)
                {
                    user = await UserManager.FindByEmailAsync(model.Email);

                    foreach (var role in model.Roles)
                    {
                        await UserManager.AddToRoleAsync(user.Id, role);
                    }

                    foreach (var claim in model.Claims)
                    {
                        await UserManager.AddClaimAsync(user.Id, new Claim(claim.Key, claim.Value));
                    }

                    result.Result = new UserLiteDTO()
                    {
                        Id = user.Id,
                        Email = user.Email
                    };                    
                }
                else
                {
                    foreach (var err in createResult.Errors)
                    {
                        result.Errors.Add(err);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(JsonConvert.SerializeObject(model));
                _logger.Error(ex);
            }
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Administrator")]
        [HttpPut]
        public async Task<JsonResult> Edit(UserCreateDTO model)
        {
            var result = new ActionResultDTO<UserLiteDTO>();

            try
            {
                if (!string.IsNullOrEmpty(model.Password) && model.Password != model.ConfirmPassword)
                {
                    result.Errors.Add("Password and Confirm Password do not match.");
                    return Json(result, JsonRequestBehavior.AllowGet);
                }

                var user = await UserManager.FindByIdAsync(model.Id);
                
                if (user == null)
                {
                    result.Errors.Add($"User ID {model.Id} not found.");
                    return Json(result, JsonRequestBehavior.AllowGet);
                }

                if (!string.IsNullOrEmpty(model.Password))
                {
                    // reset password
                    var passToken = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                    var updatedPass = await UserManager.ResetPasswordAsync(user.Id, passToken, model.Password);

                    if (!updatedPass.Succeeded)
                    {
                        foreach (var err in updatedPass.Errors)
                        {
                            result.Errors.Add(err);
                        }
                        return Json(result, JsonRequestBehavior.AllowGet);
                    }
                }
                
                // roles
                var existingRoles = await UserManager.GetRolesAsync(user.Id);
                var toDeleteRoles = existingRoles.Where(t => !model.Roles.Contains(t))
                    .ToArray();
                var toAddRoles = model.Roles.Where(t => !existingRoles.Contains(t))
                    .ToArray();

                // remove roles
                await UserManager.RemoveFromRolesAsync(user.Id, toDeleteRoles);
                // add roles
                await UserManager.AddToRolesAsync(user.Id, toAddRoles);

                // claims
                var existingClaims = await UserManager.GetClaimsAsync(user.Id);
                
                // remove claims
                foreach (var c in existingClaims)
                {
                    var found = model.Claims.Any(t => t.Key == c.Type);

                    if (!found)                    
                        await UserManager.RemoveClaimAsync(user.Id, c);
                    
                }

                // upsert claims
                foreach (var c in model.Claims)
                {
                    var found = existingClaims.FirstOrDefault(t => t.Type == c.Key);

                    if (found != null)
                    {
                        // remove 
                        await UserManager.RemoveClaimAsync(user.Id, found);
                    }

                    // add
                    await UserManager.AddClaimAsync(user.Id, new Claim(c.Key, c.Value));
                }

                result.Result = new UserLiteDTO()
                {
                    Id = user.Id,
                    Email = user.Email
                };
            }
            catch (Exception ex)
            {
                _logger.Error(JsonConvert.SerializeObject(model));
                _logger.Error(ex);
                result.Errors.Add("Encountered error");
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            return View("Edit");
        }

        public ActionResult Edit(string id)
        {
            return View();
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet]        
        public JsonResult Roles()
        {
            var roles = DbContext.Roles
                .Select(t => t.Name)
                .ToList();
            return Json(roles, JsonRequestBehavior.AllowGet);
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }
        #region Helpers
            // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion
    }
}