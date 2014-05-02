using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace App.Api
{
    public class LoginController : ApiController
    {
        [Authorize]
        public bool Index()
        {
            return false;
        }
    }
}
