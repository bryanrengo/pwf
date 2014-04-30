using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace App.Hubs.Models
{
    public class Player
    {
        private List<Game> gameWins = new List<Game>();

        public string Id { get; set; }
        public string Name { get; set; }
        public bool IsHost { get; set; }
        public List<Game> GameWins { get { return gameWins; } }
    }
}