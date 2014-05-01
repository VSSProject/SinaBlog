using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vss;
using DAL;
using Newtonsoft.Json;

public partial class API_GetNumber : System.Web.UI.Page
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

        TValidator tValidator = (TValidator)HttpContext.Current.Session["UserLogin"];

        ClientAdapt.Open();

        TVssService.Client client = ClientAdapt.GetClient();
        TNumber tNumber = client.GetNumber(tValidator);
        ClientAdapt.Close();

        Response.Write(JsonConvert.SerializeObject(tNumber));
        Response.End();
    }
}