/**
 * Autogenerated by Thrift Compiler (1.0.0-dev)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.IO;
using Thrift;
using Thrift.Collections;
using System.Runtime.Serialization;
using Thrift.Protocol;
using Thrift.Transport;

namespace Vss
{

  #if !SILVERLIGHT 
  [Serializable]
  #endif
  public partial class TValidator : TBase
  {

    public string VssID { get; set; }

    public string VssPsw { get; set; }

    public string AppID { get; set; }

    public TValidator() {
    }

    public TValidator(string VssID, string VssPsw, string AppID) : this() {
      this.VssID = VssID;
      this.VssPsw = VssPsw;
      this.AppID = AppID;
    }

    public void Read (TProtocol iprot)
    {
      bool isset_VssID = false;
      bool isset_VssPsw = false;
      bool isset_AppID = false;
      TField field;
      iprot.ReadStructBegin();
      while (true)
      {
        field = iprot.ReadFieldBegin();
        if (field.Type == TType.Stop) { 
          break;
        }
        switch (field.ID)
        {
          case 1:
            if (field.Type == TType.String) {
              VssID = iprot.ReadString();
              isset_VssID = true;
            } else { 
              TProtocolUtil.Skip(iprot, field.Type);
            }
            break;
          case 2:
            if (field.Type == TType.String) {
              VssPsw = iprot.ReadString();
              isset_VssPsw = true;
            } else { 
              TProtocolUtil.Skip(iprot, field.Type);
            }
            break;
          case 3:
            if (field.Type == TType.String) {
              AppID = iprot.ReadString();
              isset_AppID = true;
            } else { 
              TProtocolUtil.Skip(iprot, field.Type);
            }
            break;
          default: 
            TProtocolUtil.Skip(iprot, field.Type);
            break;
        }
        iprot.ReadFieldEnd();
      }
      iprot.ReadStructEnd();
      if (!isset_VssID)
        throw new TProtocolException(TProtocolException.INVALID_DATA);
      if (!isset_VssPsw)
        throw new TProtocolException(TProtocolException.INVALID_DATA);
      if (!isset_AppID)
        throw new TProtocolException(TProtocolException.INVALID_DATA);
    }

    public void Write(TProtocol oprot) {
      TStruct struc = new TStruct("TValidator");
      oprot.WriteStructBegin(struc);
      TField field = new TField();
      field.Name = "VssID";
      field.Type = TType.String;
      field.ID = 1;
      oprot.WriteFieldBegin(field);
      oprot.WriteString(VssID);
      oprot.WriteFieldEnd();
      field.Name = "VssPsw";
      field.Type = TType.String;
      field.ID = 2;
      oprot.WriteFieldBegin(field);
      oprot.WriteString(VssPsw);
      oprot.WriteFieldEnd();
      field.Name = "AppID";
      field.Type = TType.String;
      field.ID = 3;
      oprot.WriteFieldBegin(field);
      oprot.WriteString(AppID);
      oprot.WriteFieldEnd();
      oprot.WriteFieldStop();
      oprot.WriteStructEnd();
    }

    public override string ToString() {
      StringBuilder __sb = new StringBuilder("TValidator(");
      __sb.Append(", VssID: ");
      __sb.Append(VssID);
      __sb.Append(", VssPsw: ");
      __sb.Append(VssPsw);
      __sb.Append(", AppID: ");
      __sb.Append(AppID);
      __sb.Append(")");
      return __sb.ToString();
    }

  }

}