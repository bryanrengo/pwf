// --------------------------------------------------------------------------------------------------------------------
// <copyright file="BundleConfig.cs" company="KriaSoft LLC">
//   Copyright © 2013 Konstantin Tarkus, KriaSoft LLC. See LICENSE.txt
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace App
{
    using System.Web.Optimization;

    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new Bundle("~/js/libs").Include(
                "~/scripts/angular/angular.js",
                "~/scripts/angular/angular-route.js",
                "~/scripts/jquery/jquery-{version}.js",
                "~/scripts/underscore/underscore.js",
                "~/scripts/bootstrap/bootstrap.js",
                "~/scripts/angular-ui/ui-bootstrap-tpls.js",
                "~/scripts/angular/angular-google-maps.js",
                "~/scripts/signalr/jquery.signalr-{version}.js",
                "~/scripts/geolocation.js"));

            bundles.Add(new Bundle("~/js/app")
                .IncludeDirectory(directoryVirtualPath: "~/app", searchPattern: "*.js")
                .IncludeDirectory(directoryVirtualPath: "~/app/common", searchPattern: "*.js")
                .IncludeDirectory(directoryVirtualPath: "~/app/chat", searchPattern: "*.js")
                .IncludeDirectory(directoryVirtualPath: "~/app/gameboard", searchPattern: "*.js")
                .IncludeDirectory(directoryVirtualPath: "~/app/main", searchPattern: "*.js")
                .IncludeDirectory(directoryVirtualPath: "~/app/login", searchPattern: "*.js")
                .IncludeDirectory(directoryVirtualPath: "~/app/gameList", searchPattern: "*.js")
                .IncludeDirectory(directoryVirtualPath: "~/app/map", searchPattern: "*.js"));

            bundles.Add(new Bundle("~/css/app").Include(
                "~/styles/app.css",
                "~/styles/bootstrap.css"));
        }
    }
}