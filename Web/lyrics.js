
function injectLyricsLayout() {
    console.log("Checking for lyrics page:", window.location.href);
    if (!window.location.href.includes('/lyrics')) {
        console.log("Not on lyrics page, skipping injection");
        return;
    }
    console.log("On lyrics page, looking for elements...");

    const waitForElements = setInterval(() => {
        const container = document.querySelector('.dynamicLyricsContainer');
        const nowPlayingInfo = document.querySelector('.nowPlayingBarInfoContainer');

        if (container && nowPlayingInfo) {
            try {
                // Check if already injected
                if (document.querySelector('.songDetails')) {
                    console.log("Already injected, clearing interval");
                    clearInterval(waitForElements);
                    return;
                }

                clearInterval(waitForElements);

                // Extract info from now playing bar
                const nowPlayingImage = nowPlayingInfo.querySelector('.nowPlayingImage');
                const songTitleElement = nowPlayingInfo.querySelector('.nowPlayingBarText > div:first-child a');
                const artistElement = nowPlayingInfo.querySelector('.nowPlayingBarSecondaryText a');

                const albumArtUrl = nowPlayingImage ?
                    nowPlayingImage.style.backgroundImage.slice(5, -2) : null;
                const songTitle = songTitleElement ? songTitleElement.textContent : 'Unknown Title';
                const artistName = artistElement ? artistElement.textContent : 'Unknown Artist';

                // Check if album art is a valid image (not the default avatar)
                const hasValidAlbumArt = albumArtUrl &&
                    !albumArtUrl.includes('avatar.png') &&
                    !albumArtUrl.includes('default') &&
                    albumArtUrl.length > 10;

                console.log("Extracted info:", { songTitle, artistName, albumArtUrl, hasValidAlbumArt });

                // Create layout with conditional album art
                const albumArtHTML = hasValidAlbumArt ?
                    `<img id="albumArt" src="${albumArtUrl}" alt="Album Art">` : '';

                // Inject custom layout
                const songDetails = document.createElement('div');
                songDetails.innerHTML = `
                    <div class="songDetails ${hasValidAlbumArt ? 'has-album-art' : 'text-only'}">
                        ${albumArtHTML}
                        <div class="songInfo">
                            <h2 id="songTitle">${songTitle}</h2>
                            <h3 id="artistName">${artistName}</h3>
                        </div>
                    </div>
                    <style>
                    .lyricWrapper {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        margin-right: 5em;
                    }
                    .dynamicLyricsContainer {
                        flex: 2;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                    .lyricsLine {
                        display: inline-block;
                        width: fit-content;
                        margin: 0.3em;
                        font-size: 30px;
                        color: inherit;
                        min-height: 2em;
                    }
                    
                    /* Base song details styling */
                    .songDetails {
                        position: fixed;
                        right: 2%;
                        top: 40%;
                        transform: translateY(-50%);
                        max-width: 20%;
                        text-align: center;
                        z-index: 100;
                    }
                    
                    /* With album art */
                    .songDetails.has-album-art #albumArt {
                        width: 100%;
                        max-width: 200px;
                        border-radius: 12px;
                        margin-bottom: 15px;
                    }
                    
                    /* Text only layout */
                    .songDetails.text-only {
                        backdrop-filter: blur(10px);
                        border-radius: 15px;
                        padding: 20px;
                    }
                    
                    .songInfo {
                        color: #fff;
                    }
                    .songInfo h2 {
                        margin: 0;
                        font-size: 1.4rem;
                        font-weight: bold;
                        line-height: 1.2;
                    }
                    .songInfo h3 {
                        margin: 8px 0 0 0;
                        font-size: 1.1rem;
                        font-weight: normal;
                        opacity: 0.8;
                    }
                    
                    /* Mobile styles */
                    @media screen and (max-width: 768px) {
                        .songDetails {
                            position: fixed;
                            top: 40%;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 90%;
                            opacity: 0.3;
                            z-index: 1;
                            pointer-events: none;
                            text-align: center;
                        }

                        .songDetails.has-album-art #albumArt {
                            width: 140px;
                            max-width: 140px;
                            margin-bottom: 10px;
                            border-radius: 10px;
                        }

                        .songDetails.text-only {
                            padding: 10px;
                        }

                        .songInfo h2 {
                            font-size: 1.2rem;
                        }

                        .songInfo h3 {
                            font-size: 1rem;
                        }

                        .dynamicLyricsContainer {
                            position: relative;
                            z-index: 2;
                        }

                        .lyricsLine {
                            font-size: 24px;
                            margin: 0.2em;
                        }
                    }

                    
                    /* Very small screens */
                    @media screen and (max-width: 480px) {
                        .songDetails.has-album-art #albumArt {
                            width: 100px;
                            max-width: 100px;
                        }
                        
                        .songDetails.text-only {
                            padding: 12px;
                        }
                        
                        .songInfo h2 {
                            font-size: 1.1rem;
                        }
                        .songInfo h3 {
                            font-size: 0.95rem;
                        }
                        
                        .lyricsLine {
                            font-size: 20px;
                        }
                    }
                    
                    /* Tablet landscape */
                    @media screen and (min-width: 769px) and (max-width: 1024px) {
                        .songDetails {
                            max-width: 25%;
                            right: 1.5%;
                        }
                        
                        .songDetails.has-album-art #albumArt {
                            max-width: 160px;
                        }
                    }
                    </style>
                `;

                container.prepend(songDetails);
                console.log("Successfully injected lyrics layout");
            } catch (e) {
                console.error("Error during injection:", e);
            }
        }
    }, 500);

    // Stop trying after 10 seconds
    setTimeout(() => {
        clearInterval(waitForElements);
        console.log("Stopped waiting for elements after 10 seconds");
    }, 10000);
}

// Run immediately
injectLyricsLayout();

// Also listen for URL changes
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(injectLyricsLayout, 1000);
    }
}).observe(document, { subtree: true, childList: true });

// Periodic check as backup
setInterval(() => {
    if (window.location.href.includes('/lyrics') && !document.querySelector('.songDetails')) {
        injectLyricsLayout();
    }
}, 3000);
