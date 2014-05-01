using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vss;
using DAL;

public partial class API_GetFile : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        if (Request["fileID"] == null)
        {
            Response.Write("NOPARAMS");
            Response.End();
            return;
        }

        string fileID = Request["fileID"];
        
        

        if (HttpContext.Current.Session["UserLogin"] == null)
        {
            Response.Write("NOLOGIN");
            Response.End();
            return;
        }

        TValidator tValidator = (TValidator)HttpContext.Current.Session["UserLogin"];

        try
        {
            ClientAdapt.Open();
            TVssService.Client client = ClientAdapt.GetClient();
            TFile file = client.Get(tValidator, fileID);
            ClientAdapt.Close();


            switch (file.FileKind)
            {
                case TContentKind.Weibo:
                    {
                        Response.ContentType = "text/html";
                        Response.Write(System.Text.Encoding.UTF8.GetString(file.FileContent));
                        break;
                    }
                case TContentKind.Picture:
                    {
                        Response.ContentType = "image/jpeg";
                        Response.BinaryWrite(file.FileContent);
                        break;
                    }
                default:
                    {
                        Response.ContentType = "text/html";
                        Response.BinaryWrite(file.FileContent);
                        break;
                    }
            }
        }
        catch
        {
            ;
        }

        Response.End();
    }
}