using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace MiniIRC
{
    public class ChatHub : Hub
    {
        public void SubmitMessage(string message)
        {
            Clients.All.sendMessage(message);
        }
    }
}