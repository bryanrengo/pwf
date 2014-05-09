using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace App.Hubs.Models
{
    public class segment
    {
        public string color { get; set; }
        public int xFrom { get; set; }
        public int yFrom { get; set; }
        public int xTo { get; set; }
        public int yTo { get; set; }
    }
}