using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Vss;
using DAL;

public partial class API_GetFriends : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.Params["opKind"] == null || Request.Params["friID"] == null)
        {
            Response.Write("NOPARAMS");
            Response.End();
            return;
        }

        int iKind = Int32.Parse(Request.Params["opKind"]);
        string sID = Request.Params["friID"];
        string[] arID;
        List<string> listID = new List<string>();

        if (sID != "")
        {
            arID = sID.Split('|');
            foreach (string id in arID)
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

        List<string> retList = null;

        switch (iKind)
        {
            case 0:
                {
                    //拉取关注列表：
                    retList = client.GetFocus(tValidator);
                    ClientAdapt.Close();
                    Response.Write("{Data:['" + string.Join("','", retList.ToArray()) + "']}");
                    Response.End();
                    return;
                }
            case 1:
                {
                    //拉取我的听众列表：
                    retList = client.GetFollow(tValidator);
                    ClientAdapt.Close();
                    Response.Write("{Data:['" + string.Join("','", retList.ToArray()) + "']}");
                    Response.End();
                    return;
                }
            case 2:
                {
                    //设置关注列表
                    client.AddFocus(tValidator, listID);
                    ClientAdapt.Close();
                    Response.Write("SUCCESS");
                    Response.End();
                    return;
                }
            case 3:
                {
                    //取消关注
                    client.DelFocus(tValidator, listID);
                    ClientAdapt.Close();
                    Response.Write("SUCCESS");
                    Response.End();
                    return;
                }
            case 4:
                {
                    //拉取关注列表：同时要求详细信息
                    retList = client.GetFocus(tValidator);
                    break;
                }
            case 5:
                {
                    //拉取我的听众列表：同时要求详细信息
                    retList = client.GetFollow(tValidator);
                    break;
                }
            default:
                {
                    break;
                }
        }

        List<string> listReal = new List<string>();

        TValidator tmpValid = new TValidator(tValidator.VssID, tValidator.VssPsw, tValidator.AppID);

        foreach (string s in retList)
        {
            tmpValid.VssID = s;
            listReal.Add(client.GetAppUserInfo(tmpValid));
        }

        ClientAdapt.Close();

        Response.Write("{Data:[" + string.Join(",", listReal.ToArray()) + "]}");
        Response.End();




    }
}