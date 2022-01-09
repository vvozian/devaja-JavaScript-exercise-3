# JavaScript exercise 3
Third exercise for De Vaja

## Task
- Create an emoji generator for De Vaja
- Draw an 8 x 8 virtual led screen with HTML5 Canvas API
- Leds can be set on and off by clicking on them
- If user presses SAVE button they are asked to give a name for the emoji
- Saved emojis are stored in an online database
- All saved emojis are shown below the virtual led screen in a grid layout
- Who knows - maybe your cool emoji design will be featured on new De Vaja
videos!


## Demo
[https://happy-spence-9f9fb8.netlify.app](https://happy-spence-9f9fb8.netlify.app)

## API
Base url - https://us-central1-pixel-emoji.cloudfunctions.net

### Endpoints 
- /getEmojiName?id={emoji code} (GET)
- /getEmojiList (GET)
- /setEmoji?id={emoji code}&name={emoji name} (GET)
