using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Thrift.Protocol;
using Thrift.Collections;
using Thrift.Server;
using Thrift.Transport;
using Vss;

namespace DAL
{
    public class ClientAdapt
    {

        private static TTransport transport = new TSocket("192.168.0.234", 8090);
        private static TProtocol protocol = new TBinaryProtocol(transport);
        private static TVssService.Client client = new TVssService.Client(protocol);

        public static void Open()
        {
            if (!transport.IsOpen)
            {
                transport.Open();
            }
        }

        public static void Close()
        {
            if (transport.IsOpen)
            {
                transport.Close();
            }
        }

        public static TVssService.Client GetClient()
        {
            return client;
        }


    }
}
