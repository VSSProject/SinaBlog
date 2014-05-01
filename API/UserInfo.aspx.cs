using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vss;
using DAL;

public partial class API_UserInfo : System.Web.UI.Page
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

       


        string sRet = "";
        ClientAdapt.Open();
        TVssService.Client client = ClientAdapt.GetClient();
        if (sData == "")
        { 
            //判断获取对象
            if (Request.Params["vssid"] != null)
            {
                tValidator = new TValidator(Request.Params["vssid"], "", "VssBlog");
            }
            sRet = client.GetAppUserInfo(tValidator);
        }
        else
        {
            client.PutAppUserInfo(tValidator, sData);
        }
        ClientAdapt.Close();
        if (sData == "")
        {
            Response.Write(sRet);
        }
        else
        {
            Response.Write("SUCCESS");
        }
        Response.End();
    }
}