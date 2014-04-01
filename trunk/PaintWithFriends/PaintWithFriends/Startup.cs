using Microsoft.Owin;
using Owin;
using PaintWithFriends;

[assembly: OwinStartup(typeof(PaintWithFriends.Startup))]

namespace PaintWithFriends
{
    public class Startup
    {

        // add a comment to deploy update to azure
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}