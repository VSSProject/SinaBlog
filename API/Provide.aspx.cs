using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vss;
using DAL;

public partial class API_Provide : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.Params["fileID"] == null || Request.Params["friID"] == null)
        {
            Response.Write("NOPARAMS");
            Response.End();
            return;
        }

        string sFile = Request.Params["fileID"];
        string sID = Request.Params["friID"];
        string[] arID;
        List<string> listID = new List<string>();

        if(sID != "")
        {
            arID = sID.Split('|');
            foreach(string id in arID)
            {
                listID.Add(id);
            }
        }
        

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

        client.Provide(tValidator, sFile, listID, "VssBlog-" + DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToShortTimeString()); 

        ClientAdapt.Close();

        Response.Write("SUCCESS");

        Response.End();
    }
}