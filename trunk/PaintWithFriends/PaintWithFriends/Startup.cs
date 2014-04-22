using Microsoft.Owin;
using Owin;
using PaintWithFriends;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;

[assembly: OwinStartup(typeof(PaintWithFriends.Startup))]

namespace PaintWithFriends
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();


            app.UseCookieAuthentication(new CookieAuthenticationOptions() { AuthenticationMode = AuthenticationMode.Active });

            app.UseFacebookAuthentication("420314314779503", "3fafa1fdea8070567a8d8154d33057b3");

            app.UseGoogleAuthentication("1023576817075-4kf8ikvr0s1n7avvf2sv1gs9jm3tqv6k.apps.googleusercontent.com", "5yWzMUVx3CUIHIkSDfVjMxea");
            // javascript origin: http://pwf.azurewebsites.net/  redirect URI's: http://pwf.azurewebsites.net/oauth2callback

            app.UseMicrosoftAccountAuthentication("0000000044114D67", "-sbktxOj9P3bK7-SsiOxChNxjqRXGMqn");
        }
    }
}