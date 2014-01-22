using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using PaintWithFriends.Models;

namespace PaintWithFriends
{
    public class GameHub : Hub
    {
        public class segment
        {
            public int x_from { get; set; }
            public int y_from { get; set; }
            public int x_to { get; set; }
            public int y_to { get; set; }
        }

        public void Hello()
        {
            Clients.All.hello();
        }

        public override System.Threading.Tasks.Task OnConnected()
        {
            return Clients.Caller.hello("Hello from the server");
        }

        public void Clear()
        {
            Clients.AllExcept(new string[] { Context.ConnectionId }).clear();
        }

        public void DrawSegment(int x_from, int y_from, int x_to, int y_to)
        {
            Clients.AllExcept(new string[] { Context.ConnectionId }).drawSegment(x_from, y_from, x_to, y_to);
            Clients.All.messageFromServer("test");
        }

        public void PushSegmentArray(segment[] segments)
        {
            Clients.AllExcept(new string[] { Context.ConnectionId }).drawSegments(segments);
        }

        public bool Join(string playerName)
        {
            Player player = GameState.Instance.GetPlayer(Context.ConnectionId, playerName);

            Game game = null;

            if (player.Game == null)
            {
                game = GameState.Instance.GetGame(player);

            }

            if (game.Players.Count >= 3)
            {
                // can start game if player count is 3 or more
                Clients.Client(game.Drawer.ConnectionId).enableStart();
            }
            else
            {
                // tell everyone we're waiting for more players
                Clients.Group(game.GroupId).enableDrawing();
            }

            return player != null;
        }

        public bool Start(string groupId)
        {
            var connectionId = Context.ConnectionId;

            Clients.Group(groupId).startGame(connectionId, 60);

            return true;
        }

        public override System.Threading.Tasks.Task OnDisconnected()
        {
            GameState.Instance.RemovePlayer(Context.ConnectionId);

            return base.OnDisconnected();
        }
    }
}