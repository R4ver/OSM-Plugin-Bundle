# OSM Plugin Bundle

# Important!

This is not my original project, I'm just building features for it.

Please go [here](https://github.com/owenconti/livecodingtv-bot) to see the original project.

## Instalation

**NOTE! this installation may not work when you try it out, since the original project is still being development at this moment and things will change!**

- First of all you need to the original project from [here](https://github.com/owenconti/livecodingtv-bot) and install that.

- Drag the "modules" folder into the project folder.

- Copy the content of to_index.js

- place that into the original project folder index.js file under the lines where stuff gets required. ( comparison [here](http://i.imgur.com/HWfMeh4.png))

- Run the bot

**Extra steps if you are on Windows**

- Open a command prompt and navigate to the original project folder

- Run ```npm install winsay``` and let that download

- open the file inside the **commands** folder called **say.js**
 
- Change this line: ```var say = require('say');``` to: ```var say = require('winsay');```

- Run the bot

# Command list

- !op {@username} {#lvl} - Mod only - Gives the user a certain lvl.

- !q {question} - all - Notifies the streamer that a question has been asked.

- !rank - all - Prints out the users rank

- !schedule - all - Prints out the schedule (!UNDER DEVELOPMENT!)

- !rg {genre} - all - Creates a pool for a specific genre.

# Presences modules

## opGreeting.js
**Won't work correctly with core greeting.js! Move core greeting.js to another folder or delete it!**

Gives a custom greeting to an opped user.

### License

The OSM Plugin Bundle open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)