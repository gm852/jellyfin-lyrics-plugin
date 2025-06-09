using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text.RegularExpressions;
using ICU4N.Logging;
using Jellyfin.Plugin.LyricsStyler.Configuration;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Controller.Configuration;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;
using Microsoft.Extensions.Logging;

namespace Jellyfin.Plugin.LyricsStyler;

public class Plugin : BasePlugin<PluginConfiguration>, IHasWebPages
{
    private readonly ILogger<Plugin> _logger;

    public override string Name => "LyricsStyler";

    public override Guid Id => Guid.Parse("9656b96b-cdec-4e42-8f81-9c7252cd8728");

    public static Plugin? Instance { get; private set; }

    public Plugin(
        IApplicationPaths applicationPaths,
        IXmlSerializer xmlSerializer,
        ILogger<Plugin> logger,
        IServerConfigurationManager configurationManager)
        : base(applicationPaths, xmlSerializer)
    {
        Instance = this;
        _logger = logger;

        if (!Configuration.EnableStyling)
            return;

        if (string.IsNullOrWhiteSpace(applicationPaths.WebPath))
            return;

        var indexFile = Path.Combine(applicationPaths.WebPath, "index.html");
        if (!File.Exists(indexFile))
            return;

        string indexContents = File.ReadAllText(indexFile);
        string basePath = "";

        // Get base path from network config
        try
        {
            var networkConfig = configurationManager.GetConfiguration("network");
            var configType = networkConfig.GetType();
            var basePathField = configType.GetProperty("BaseUrl");
            var confBasePath = basePathField?.GetValue(networkConfig)?.ToString()?.Trim('/');

            if (!string.IsNullOrEmpty(confBasePath))
                basePath = $"/{confBasePath}";
        }
        catch (Exception e)
        {
            _logger.LogError("Unable to get base path from config, using '/': {0}", e);
        }

        // Don't run if script already exists
        string scriptReplace = "<script plugin=\"LyricsStyler\".*?></script>";
        string scriptSrc = $"{basePath}/web/configurationpage?name=LyricsStylerScript.js";
        string scriptElement = $"<script plugin=\"LyricsStyler\" version=\"1.0.0.0\" src=\"{scriptSrc}\"></script>";

        if (!indexContents.Contains(scriptElement))
        {
            _logger.LogInformation("Attempting to inject LyricsStyler script code in {0}", indexFile);

            // Replace old LyricsStyler scripts
            indexContents = Regex.Replace(indexContents, scriptReplace, "");

            // Insert script last in body
            int bodyClosing = indexContents.LastIndexOf("</body>", StringComparison.Ordinal);
            if (bodyClosing != -1)
            {
                indexContents = indexContents.Insert(bodyClosing, scriptElement);

                try
                {
                    File.WriteAllText(indexFile, indexContents);
                    _logger.LogInformation("Finished injecting LyricsStyler script code in {0}", indexFile);
                }
                catch (Exception e)
                {
                    _logger.LogError("Encountered exception while writing to {0}: {1}", indexFile, e);
                }
            }
            else
            {
                _logger.LogInformation("Could not find closing body tag in {0}", indexFile);
            }
        }
        else
        {
            _logger.LogInformation("Found LyricsStyler script already injected in {0}", indexFile);
        }
    }

    public IEnumerable<PluginPageInfo> GetPages()
    {
        return new[]
        {
            new PluginPageInfo
            {
                Name = Name,
                EmbeddedResourcePath = GetType().Namespace + ".Configuration.configPage.html"
            },
            new PluginPageInfo
            {
                Name = "LyricsStylerScript.js",
                EmbeddedResourcePath = GetType().Namespace + ".Web.lyrics.js"
            },
        };
    }
}
