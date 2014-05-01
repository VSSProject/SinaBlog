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
  public partial class TMessages : TBase
  {

    public string FromVssId { get; set; }

    public TFile FileOject { get; set; }

    public int ProvideTime { get; set; }

    public string FromApp { get; set; }

    public string ProvideName { get; set; }

    public TMessages() {
    }

    public TMessages(string FromVssId, TFile FileOject, int ProvideTime, string FromApp, string ProvideName) : this() {
      this.FromVssId = FromVssId;
      this.FileOject = FileOject;
      this.ProvideTime = ProvideTime;
      this.FromApp = FromApp;
      this.ProvideName = ProvideName;
    }

    public void Read (TProtocol iprot)
    {
      bool isset_FromVssId = false;
      bool isset_FileOject = false;
      bool isset_ProvideTime = false;
      bool isset_FromApp = false;
      bool isset_ProvideName = false;
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
              FromVssId = iprot.ReadString();
              isset_FromVssId = true;
            } else { 
              TProtocolUtil.Skip(iprot, field.Type);
            }
            break;
          case 2:
            if (field.Type == TType.Struct) {
              FileOject = new TFile();
              FileOject.Read(iprot);
              isset_FileOject = true;
            } else { 
              TProtocolUtil.Skip(iprot, field.Type);
            }
            break;
          case 3:
            if (field.Type == TType.I32) {
              ProvideTime = iprot.ReadI32();
              isset_ProvideTime = true;
            } else { 
              TProtocolUtil.Skip(iprot, field.Type);
            }
            break;
          case 4:
            if (field.Type == TType.String) {
              FromApp = iprot.ReadString();
              isset_FromApp = true;
            } else { 
              TProtocolUtil.Skip(iprot, field.Type);
            }
            break;
          case 5:
            if (field.Type == TType.String) {
              ProvideName = iprot.ReadString();
              isset_ProvideName = true;
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
      if (!isset_FromVssId)
        throw new TProtocolException(TProtocolException.INVALID_DATA);
      if (!isset_FileOject)
        throw new TProtocolException(TProtocolException.INVALID_DATA);
      if (!isset_ProvideTime)
        throw new TProtocolException(TProtocolException.INVALID_DATA);
      if (!isset_FromApp)
        throw new TProtocolException(TProtocolException.INVALID_DATA);
      if (!isset_ProvideName)
        throw new TProtocolException(TProtocolException.INVALID_DATA);
    }

    public void Write(TProtocol oprot) {
      TStruct struc = new TStruct("TMessages");
      oprot.WriteStructBegin(struc);
      TField field = new TField();
      field.Name = "FromVssId";
      field.Type = TType.String;
      field.ID = 1;
      oprot.WriteFieldBegin(field);
      oprot.WriteString(FromVssId);
      oprot.WriteFieldEnd();
      field.Name = "FileOject";
      field.Type = TType.Struct;
      field.ID = 2;
      oprot.WriteFieldBegin(field);
      FileOject.Write(oprot);
      oprot.WriteFieldEnd();
      field.Name = "ProvideTime";
      field.Type = TType.I32;
      field.ID = 3;
      oprot.WriteFieldBegin(field);
      oprot.WriteI32(ProvideTime);
      oprot.WriteFieldEnd();
      field.Name = "FromApp";
      field.Type = TType.String;
      field.ID = 4;
      oprot.WriteFieldBegin(field);
      oprot.WriteString(FromApp);
      oprot.WriteFieldEnd();
      field.Name = "ProvideName";
      field.Type = TType.String;
      field.ID = 5;
      oprot.WriteFieldBegin(field);
      oprot.WriteString(ProvideName);
      oprot.WriteFieldEnd();
      oprot.WriteFieldStop();
      oprot.WriteStructEnd();
    }

    public override string ToString() {
      StringBuilder __sb = new StringBuilder("TMessages(");
      __sb.Append(", FromVssId: ");
      __sb.Append(FromVssId);
      __sb.Append(", FileOject: ");
      __sb.Append(FileOject== null ? "<null>" : FileOject.ToString());
      __sb.Append(", ProvideTime: ");
      __sb.Append(ProvideTime);
      __sb.Append(", FromApp: ");
      __sb.Append(FromApp);
      __sb.Append(", ProvideName: ");
      __sb.Append(ProvideName);
      __sb.Append(")");
      return __sb.ToString();
    }

  }

}