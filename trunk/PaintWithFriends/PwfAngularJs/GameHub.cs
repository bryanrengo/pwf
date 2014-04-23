using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Timers;
using System.Diagnostics;

namespace App
{
    public class GameHub : Hub
    {
        public GameHub()
        {
        }

        public void SetPosition(Position position)
        {
            if (position == null)
            {
                return;
            }

            //HACK: for all other clients, not drawing.  
            position.isDrawing = false;

            Clients.AllExcept(Context.ConnectionId).drawPoint(position);
        }
    }

    public class Position
    {
        public bool isDrawing { get; set; }
        public double top { get; set; }
        public double left { get; set; }
    }
}