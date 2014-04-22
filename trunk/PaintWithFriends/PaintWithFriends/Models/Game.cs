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
            this.Match = "frog";
        }

        public string GroupId { get; set; }
        public string Match { get; set; }
        public bool IsRunning { get; set; }
        public Player Drawer { get; set; }
        public ConcurrentDictionary<string, Player> Players { get; set; }

        public bool Guess(string guess)
        {
            return string.Equals(guess, this.Match, StringComparison.OrdinalIgnoreCase);
        }

        public void ResetGame()
        {
            this.IsRunning = false;

            var currentDrawer = this.Drawer;

            var newDrawer = this.Players.Values.FirstOrDefault(p => !p.IsDrawer);

            currentDrawer.IsDrawer = false;

            this.Drawer = newDrawer;
            this.Drawer.IsDrawer = true;

        }
    }
}