using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace PaintWithFriends
{
    public class GameHub : Hub
    {
        public void Hello()
        {
            Clients.All.hello();
        }

        public override System.Threading.Tasks.Task OnConnected()
        {
            //Hello();

            return Clients.Caller.hello();
        }
    }
}