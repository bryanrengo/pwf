using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Timers;
using System.Diagnostics;
using App.Hubs.Models;

namespace App
{
    public class GameHub : Hub
    {
        public void SendSegments(segment[] segments)
        {
            Clients.AllExcept(Context.ConnectionId).drawSegments(segments);
        }
    }
}