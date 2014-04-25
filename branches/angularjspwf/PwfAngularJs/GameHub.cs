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

        public void PushSegmentArray(segment[] segments)
        {
            Clients.AllExcept(Context.ConnectionId).drawSegments(segments);
        }
    }

    public class segment
    {
        public int x_from { get; set; }
        public int y_from { get; set; }
        public int x_to { get; set; }
        public int y_to { get; set; }
    }

    public class Position
    {
        public bool isDrawing { get; set; }
        public double top { get; set; }
        public double left { get; set; }
    }
}