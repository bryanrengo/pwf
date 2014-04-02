using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PaintWithSignon.Startup))]
namespace PaintWithSignon
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            app.MapSignalR();
        }
    }
}
