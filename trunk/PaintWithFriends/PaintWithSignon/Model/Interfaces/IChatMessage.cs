using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaintWithSignon.Model.Interfaces
{
    public interface IChatMessage
    {
        string PlayerName { get; set; }
        string Message { get; set; }
    }
}
