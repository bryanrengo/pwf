using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace App.Hubs.Models
{
    public class Game
    {
        private List<Player> players = new List<Player>();
        private List<segment> segments = new List<segment>();

        public string GameId { get; set; }
        public string Answer { get; set; }
        public List<segment> Segments { get { return segments; } }
        public List<Player> Players { get { return players; } }

        public Player GetPlayer(string playerConnectionId)
        {
            return players.FirstOrDefault(p => p.Id == playerConnectionId);
        }

        public void RemovePlayer(Player player)
        {
            players.Remove(player);
        }
    }
}