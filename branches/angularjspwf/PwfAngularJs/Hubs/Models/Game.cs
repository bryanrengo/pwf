using Newtonsoft.Json;
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

        public Game()
        {
            GameInstanceName = "Game" + new Random(1);
        }

        public List<Player> Players { get { return players; } }

        public string GameId { get; set; }

        public string GameInstanceName { get; set; }

        [JsonIgnore]
        public string Answer { get; set; }
        
        [JsonIgnore]
        public List<segment> Segments { get { return segments; } }

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