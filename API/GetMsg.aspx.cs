using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vss;
using DAL;

public partial class API_GetMsg : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.Params["opKind"] == null || Request.Params["vssID"] == null)
        {
            Response.Write("NOPARAMS");
            Response.End();
            return;
        }

        int iKind = Int32.Parse(Request.Params["opKind"]);
        string vssID = Request.Params["vssID"];

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

        List<TMessages> retList = new List<TMessages>();

        switch (iKind)
        {
            case 0:
                {
                    //拉取我的share
                    retList = client.GetPublishMessage(tValidator, new List<string>() { vssID }, 500);
                    if (tValidator.VssID == vssID)
                    {
                        retList.AddRange(client.GetProvideItems(tValidator, 500));
                    }
                    ClientAdapt.Close();
                    break;
                }
            case 1:
                {
                    //拉取@我的：
                    if (tValidator.VssID == vssID)
                    {
                        retList = client.GetProvideMessage(tValidator, 500);
                    }
                    ClientAdapt.Close();
                    break;
                }
            case 2:
                {
                    //我的大厅
                    TValidator tmpValid = new TValidator(vssID, tValidator.VssPsw, tValidator.AppID);
                    List<string> listFri = client.GetFocus(tmpValid);
                    retList = client.GetPublishMessage(tValidator, listFri, 500);
                    ClientAdapt.Close();
                    break;
                }
            default:
                {
                    break;
                }
        }

        List<string> listReal = new List<string>();

        foreach (TMessages msg in retList)
        {
            if (msg.FileOject.FileKind == TContentKind.Weibo)
            {
                listReal.Add(System.Text.Encoding.UTF8.GetString(msg.FileOject.FileContent));
            }
        }

        ClientAdapt.Close();

        Response.Write("{Data:[" + string.Join(",", listReal.ToArray()) + "]}");
        Response.End();
    }
}