using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaintWithFriends.Models
{
    public class Game : IGame
    {
        public Game(string id)
        {
            this.Players = new List<Player>();
        }

        public string Id { get; set; }
        public string Match { get; set; }
        public Player CurrentDrawer { get; set; }
        public List<Player> Players { get; set; }
    }
}