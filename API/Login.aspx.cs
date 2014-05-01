using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vss;
using DAL;

public partial class API_Login : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string sName = Request.Params["sName"];
        string sPsws = Request.Params["sPsw"];

        ClientAdapt.Open();
        TVssService.Client client = ClientAdapt.GetClient();
        TValidator tValidator = new TValidator(sName, sPsws, "VssBlog");
        TLoginResult tLoginState = client.Login(tValidator);
        ClientAdapt.Close();

        HttpContext.Current.Session["UserLogin"] = tValidator;

        Response.Clear();
        if (tLoginState == TLoginResult.SUCCESS)
        {
            Response.Write("SUCCESS");
        }
        else
        {
            Response.Write("ERROR");
        }
        
        Response.End();
    }
}