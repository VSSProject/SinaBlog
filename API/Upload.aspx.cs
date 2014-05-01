using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vss;
using DAL;
using System.IO;

public partial class API_Upload : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        if (HttpContext.Current.Session["UserLogin"] == null)
        {
            //这里也可以根据类型不同，返回适当的情况！
            Response.Write("NOLOGIN");
            Response.End();
            return;
        }

        if (Request.Files.Count == 0)
        {
            return;
        }
        HttpPostedFile file = Request.Files[0];
        Stream s = file.InputStream;

        s.Seek(0, SeekOrigin.Begin);
        byte[] buf = new byte[s.Length];
        s.Read(buf, 0, (int)s.Length);

        TValidator tValidator = (TValidator)HttpContext.Current.Session["UserLogin"];


        ClientAdapt.Open();
        TVssService.Client client = ClientAdapt.GetClient();
        TFile tFile = new TFile();
        tFile.FileId = "";
        tFile.FileContent = buf;
        tFile.FileInfo = DateTime.Now.ToLongDateString() + "  " + DateTime.Now.ToLongTimeString() + "Upload a Picture";
        tFile.FileKind = TContentKind.Picture;
        tFile.FileOwner = tValidator.VssID;
        tFile.FileSize = tFile.FileContent.Length;
        tFile.FromApp = "VssBlog";
        tFile.FileOwner = tValidator.VssID;

        string fileID = client.Put(tValidator, tFile);

        ClientAdapt.Close();

        Response.Write("<img id='mypic' width='400px' height='300px' src='GetFile.aspx?fileID=" + fileID + "' />");

        Response.End();


    }
}