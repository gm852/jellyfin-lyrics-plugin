using MediaBrowser.Model.Plugins;

namespace Jellyfin.Plugin.LyricsStyler.Configuration;

public class PluginConfiguration : BasePluginConfiguration
{

    public PluginConfiguration()
    {
        Options = "Default";
        EnableStyling = true;
    }


    public string Options { get; set; }


    public bool EnableStyling { get; set; }
}
