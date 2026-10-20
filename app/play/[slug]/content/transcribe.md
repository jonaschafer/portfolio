I talk through a lot of ideas in Voice Memos, usually on runs or in the car. Getting them back out as text was always the annoying part. I didn't want to paste a recording into some website, and I didn't want another subscription for something I do a few times a week.

So now it's a right-click. Select a memo (or a bunch) in Finder, choose Quick Actions, then Transcribe. A text file shows up next to the recording, and if it's just one, the text is already on your clipboard.

## How it works

It runs OpenAI's Whisper model on your own Mac, through a version called whisper.cpp that's built for Apple chips. Nothing gets uploaded. A 30 second memo takes about five seconds on my laptop, and longer ones scale from there.

A few calls that shaped it:

1. **Local only.** Voice memos are half-formed thoughts, sometimes personal ones. Keeping them on the machine was the whole point, and it means it works on a plane.
2. **One model, the good one.** Whisper large-v3 turbo is the best mix of speed and accuracy right now. It's a one-time 550 MB download the first time you use it, then it's instant to start.
3. **It figures out the language.** Talk in English, Spanish, whatever. It also works on video files, so a screen recording or a Zoom export gets the same treatment.
4. **Plain text, right next to the file.** No app to open, no format to deal with. It goes wherever the memo is, and drops on your Desktop if that folder is locked.

Claude wrote the script and the bundle that turns it into a Quick Action.

## Get it

You'll need a Mac with an Apple chip and [Homebrew](https://brew.sh). Then install the two tools it uses:

```
brew install whisper-cpp ffmpeg
```

1. [Download Transcribe](/play/builds/transcribe/Transcribe.zip) and unzip it.
2. Double-click **Transcribe.workflow** and choose Install.
3. To get a memo out of Voice Memos, drag it onto your Desktop or into any folder.
4. Right-click it, then Quick Actions, then Transcribe.

The first run downloads the model, so give that one a minute. If it says something's missing, it copies the install command to your clipboard for you.

Don't see it in the menu? Check System Settings, then General, then Login Items & Extensions, then Finder, and make sure Transcribe is on.
