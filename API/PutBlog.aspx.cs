using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vss;
using DAL;

public partial class API_PutBlog : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.Params["data"] == null)
        {
            Response.Write("NOPARAMS");
            Response.End();
            return;
        }

        string sData = Request.Params["data"];


        if (HttpContext.Current.Session["UserLogin"] == null)
        {
            //这里也可以根据类型不同，返回适当的情况！
            Response.Write("NOLOGIN");
            Response.End();
            return;
        }

        TValidator tValidator = (TValidator)HttpContext.Current.Session["UserLogin"];


        ClientAdapt.Open();
        TVssService.Client client = ClientAdapt.GetClient();
        TFile tFile = new TFile();
        tFile.FileId = "";
        tFile.FileContent = System.Text.Encoding.UTF8.GetBytes(sData);
        tFile.FileInfo = DateTime.Now.ToLongDateString() + "  " + DateTime.Now.ToLongTimeString() + " Send a Blog.";
        tFile.FileKind = TContentKind.Weibo;
        tFile.FileOwner = tValidator.VssID;
        tFile.FileSize = tFile.FileContent.Length;
        tFile.FromApp = "VssBlog";
        tFile.FileOwner = tValidator.VssID;

        string fileID = client.Put(tValidator, tFile);

        tFile.FileId = fileID;
        tFile.FileContent = System.Text.Encoding.UTF8.GetBytes(sData.Replace("[REPLACE_STRMSGID]", fileID));

        fileID = client.Put(tValidator, tFile);

        ClientAdapt.Close();

        Response.Write(fileID);

        Response.End();
    }
}