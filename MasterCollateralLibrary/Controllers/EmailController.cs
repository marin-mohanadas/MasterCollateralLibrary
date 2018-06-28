using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net.Mail;
using System.IO;
using RazorEngine;
using RazorEngine.Templating;
using System.Net;
using MasterCollateralLibrary.Models;
using System.Threading.Tasks;
using System.Reflection;
using NLog;

namespace MasterCollateralLibrary.Controllers
{
    public class EmailController : Controller
    {
        //  
        // GET: /MailMessaging/  
        private static Logger _logger = LogManager.GetCurrentClassLogger();

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Send(EmailModels mail, HttpPostedFileBase fileUploader = null, object modal = null, string email_template = null)
        {
            //NOTES:  You can call this in the example below.  (This example is in the QuoteMasterController.cs)
            //
            //var email = new EmailController();
            //var message = new EmailModels();
            //message.To = dto.tbl_rep.rep_email;
            //message.Subject = string.Format("Quote {0} has been confirmed", dto.qthdr_qn_basis + "-" + dto.qthdr_rev);
            //Task.Run(() => email.Send(message, null, dto, "quoteConfirmRepEmail.html"));
            //
            //You can also call this without sending models
            //message.Body = "some body string";
            //Task.Run(() => email.Send(message));

            _logger.Debug(string.Format("Start Send Email"));

            if (ModelState.IsValid)
            {
                var message = new MailMessage();
                try
                {
                    if (mail.To.ToString() != null)
                    {
                        foreach (string to in mail.To.ToString().Split(';'))
                        {
                            if (!string.IsNullOrEmpty(to))
                            {
                                message.To.Add(new MailAddress(to));
                                _logger.Debug(string.Format("Sending Email to {0}", to));
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error("Either no To set or error setting To");
                }
                try
                {
                    if (mail.CC.ToString() != null)
                    {
                        foreach (string cc in mail.CC.ToString().Split(';'))
                        {
                            if (!string.IsNullOrEmpty(cc))
                            {
                                message.CC.Add(new MailAddress(cc));
                                _logger.Debug(string.Format("Sending Email CC to {0}", cc));
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error("Either no CC set or error setting CC");
                }


                message.Subject = mail.Subject;

                string template = "";
                string templatefile = "";
                string templatePath = "~/Content/Templates/";
                string body = "";
                string siteURL = System.Configuration.ConfigurationManager.AppSettings["SiteURL"];

                if (email_template == null)
                {
                    body = mail.Body;
                }
                else
                {
                    try
                    {
                        template = System.IO.File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath(templatePath + email_template));
                    }
                    catch (Exception)
                    {
                        string currentfolder = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                        templatefile = currentfolder + "\\Content\\templates\\" + email_template;
                        template = System.IO.File.ReadAllText(templatefile);
                    }
                    try
                    {
                        object templateModal = new object();
                        var viewBag = new DynamicViewBag();
                        viewBag.AddValue("SiteURL", siteURL);

                        if (modal == null)
                        {
                            templateModal = mail;
                        }
                        else
                        {
                            templateModal = modal;
                        }

                        if (Engine.Razor.IsTemplateCached(email_template, null))
                        {
                            body = Engine.Razor.Run(email_template, null, modal, viewBag);
                        }
                        else
                        {
                            body = Engine.Razor.RunCompile(template, email_template, null, modal, viewBag);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.Error(string.Format("Error Sending Email: {0}", ex.ToString()));
                        body = ex.ToString();
                    }
                }

                message.Body = body;
                message.IsBodyHtml = true;
                if (mail.Attachment != null && mail.Attachment.ContentLength > 0)
                {
                    message.Attachments.Add(new Attachment(mail.Attachment.InputStream, Path.GetFileName(mail.Attachment.FileName)));
                }
                using (var smtp = new SmtpClient())
                {
                    try
                    {
                        await smtp.SendMailAsync(message);
                        return RedirectToAction("Sent");
                    }
                    catch (Exception ex)
                    {
                        _logger.Error(string.Format("Error Sending Email: {0}", ex.ToString()));
                        return RedirectToAction("Error");
                    }
                }
            }
            return View(mail);
        }
    }
}