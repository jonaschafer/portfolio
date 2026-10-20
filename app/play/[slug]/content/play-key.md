I don't use Apple Music. But every time I hit the play key on my keyboard while Spotify is closed, Apple Music opens anyway, with an empty library and a pitch to subscribe. Then I close it, open Spotify, and hit play again.

It's a small thing that happens a lot. AirPods do it too: connect them, tap play, and there's Music.

## You can't delete it

My first move was to drag Music to the Trash. macOS won't let you. It's a system app that lives on a locked part of the drive, and even `sudo` can't remove it. You could turn off System Integrity Protection to force it, but that's a security feature for the whole Mac and not worth trading away for this.

So the fix is to stop Music from sticking around when it opens, and send the play key to Spotify instead.

## The fix: noTunes

[noTunes](https://github.com/tombonez/noTunes) is a tiny free, open-source app that sits in your menu bar. Whenever Music tries to open, it quits it. You can also tell it to open a different player in its place, which is the part I wanted.

### 1. Install it

If you have Homebrew, run this in Terminal:

```bash
brew install --cask notunes
```

No Homebrew? Download the latest release from the [noTunes GitHub page](https://github.com/tombonez/noTunes/releases) and drag it into Applications.

### 2. Point it at Spotify

This tells noTunes to open Spotify whenever it catches Music:

```bash
defaults write digital.twisted.noTunes replacement /Applications/Spotify.app
```

Use whatever player you like here. Swap in the path to Tidal, YouTube Music or anything else in your Applications folder.

### 3. Open it

```bash
open -a noTunes
```

This is the step I missed. I installed it, set the replacement, hit play, and Music opened right up. noTunes only works while it's running, and installing it doesn't start it.

If macOS blocks it the first time, right-click the app in Applications and choose Open.

### 4. Make it start with your Mac

Go to System Settings › General › Login Items and add noTunes. Skip this and Music will be back the next time you restart.

## What it feels like now

Hit play with Spotify closed and Music flickers open for a split second, noTunes closes it, and Spotify opens. Once Spotify is open, the play key controls Spotify like you'd expect.

If the little icon in your menu bar bugs you, you can hide it:

```bash
defaults write digital.twisted.noTunes hideIcon -bool true
```

## The fix I'd skip

You'll find a lot of advice online to turn off the macOS service that listens for the play key:

```bash
launchctl disable gui/$(id -u)/com.apple.rcd
```

It does stop Music from opening. It also stops the play key from working in every app, Spotify included, after your next restart. I ran it, then had to undo it. If you did too, this puts it back:

```bash
launchctl enable gui/$(id -u)/com.apple.rcd
```
