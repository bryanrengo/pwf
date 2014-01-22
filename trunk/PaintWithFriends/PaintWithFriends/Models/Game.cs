using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaintWithFriends.Models
{
    public class Game : IGame
    {
        public Game(string groupId)
        {
            this.GroupId = groupId;
            this.Players = new ConcurrentDictionary<string, Player>();
            this.IsRunning = false;
        }

        public string GroupId { get; set; }
        public string Match { get; set; }
        public bool IsRunning { get; set; }
        public Player Drawer { get; set; }
        public ConcurrentDictionary<string, Player> Players { get; set; }
    }
}