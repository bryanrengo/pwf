using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaintWithFriends
{
    public class GameState
    {   
        private readonly Lazy<GameState> _instance = new Lazy<GameState>(() => new GameState(GlobalHost.ConnectionManager.GetHubContext<GameHub>()));
        public IHubConnectionContext Clients { get; set; }
        public IGroupManager Groups { get; set; }

        private GameState(IHubContext context)
        {
            Clients = context.Clients;
            Groups = context.Groups;
        }

        public GameState Instance
        {
            get { return _instance.Value; }
        }
    }
}