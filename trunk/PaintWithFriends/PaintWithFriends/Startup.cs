using Microsoft.Owin;
using Owin;
using PaintWithFriends;

[assembly: OwinStartup(typeof(PaintWithFriends.Startup))]

namespace PaintWithFriends
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}