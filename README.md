## Automatic Subs translator

An automatic subs translator.

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [How to run](#how-to-run)
- [Contact](#contact)

## General info

A script that extract subs of mkv videos and translate them using a web service and automatic navigation browser.

## Technologies

- Javascript
- Node.js
- Puppeteer

## How to run

Note: You have to have [MKVToolNix](https://mkvtoolnix.download/downloads.html) installed on your computer and added to the PATH.

1. Install [Node.js](https://nodejs.org/) to run.
2. Clone the repository
3. Copy the files to the directory where you have you mkv videos
4. Open a terminal and navigate to the folder where you have the ```index.js``` file
5. Now run ```npm install``` to install all dependencies
6. Finally run ```node index.js``` to run the app

## Usage examples:

```$ node index.js --track=4```

*This takes the track with the id=4 (by default 2) of the mkv video and extract it as srt file*

Note: *The track with the id=0 corresponds to video track*


## Contact

Created by [@retaLazyCodes](https://github.com/retaLazyCodes) - feel free to contact me!
