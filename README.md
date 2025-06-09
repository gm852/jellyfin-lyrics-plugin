<p align="center">
  <a href="https://github.com/gm852/jellyfin-lyrics-plugin">
   <img src="/Configuration/logo.png" alt="logo" width="150"/>
  </a>
</p>

# Welcome To Jellyfin Lyrics Styler Plugin
This plugin is for [Jellyfin](https://github.com/jellyfin/jellyfin-web) users who want to add a little style to they're lyrics pages. As of now
its a simple style and look using a shotty method of injecting the js into index.html with only 1 default style but it works. Im open to any PRs
as you can tell im not a native C# dev at all and couldnt find much docs on how the plugins worked, so if there is a better way to go about this
please let me know.


# Install Process
1. In jellyfin, go to dashboard -> plugins -> Repositories -> add and paste this link `https://raw.githubusercontent.com/gm852/jellyfin-lyrics-plugin/main/manifest.json`
2. Go to Catalog and search for Lyrics Styler
3. Click on it and install
4. Go into server CLI and paste these commands (not great practice i know but its the only method for injection i know of now)
```
sudo chown :jellyfin /usr/share/jellyfin/web/index.html
sudo chmod g+w /usr/share/jellyfin/web/index.html
```
6. Restart Jellyfin dashboard -> restart

