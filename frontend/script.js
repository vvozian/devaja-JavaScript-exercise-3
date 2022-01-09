let CODE = '0000000000000000';

// Converting matrix to hex code
function matrix_to_code(matrix, width, height) {
    let block = '';
    let matrixCode = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            block += String(parseInt(+matrix[y][x]));
            if (block.length == 4) {
                matrixCode += parseInt(block, 2).toString(16).toUpperCase();
                block = '';
            }
        }
    }

    if (block.length != 0) {
        const zerosToAdd = 4 - block.length;
        matrixCode += parseInt('0'.repeat(zerosToAdd) + block, 2).toString(16).toUpperCase();
    }

    return matrixCode
}

function hexToBin(hexNum) {
    let bin = '';
    for (let i = 0; i < hexNum.length; i++) {
        let block = parseInt(hexNum[i], 16).toString(2);
        const zerosToAdd = 4 - block.length;
        bin += '0'.repeat(zerosToAdd) + block;
    }
    return bin
}

// Handler for canvas click
function canvasClick(matrix, position) {
    CODE = matrix_to_code(matrix, 8, 8);
    window.history.replaceState({}, '', parent.location.href.split('?')[0] + '?id=' + CODE);
}

// Initial function
async function init() {
    // Get matrix code from URL query (or set default)
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('id');
    CODE = code ? code : '0000000000000000'

    // Creating and show canvas 
    const mainCanvas = create_matrix(hexToBin(code), true, canvasClick);
    document.querySelector('.main_canvas').appendChild(mainCanvas);

    // Set matrix code to URL query
    window.history.replaceState({}, '', parent.location.href.split('?')[0] + '?id=' + CODE);


    // Showing all saved emojis
    let allEmojisDict = (await API.get_emoji_list()).response.response;

    Object.keys(allEmojisDict).forEach(matrix => {
        const canvas = create_matrix(hexToBin(matrix), false, null);

        const emoji = document.createElement('a');
        emoji.className = 'emoji';
        emoji.setAttribute("href", `?id=${matrix}`);

        const emojiTitle = document.createElement('div');
        emojiTitle.className = 'emoji__title';
        emojiTitle.innerText = allEmojisDict[matrix]

        emoji.appendChild(canvas);
        emoji.appendChild(emojiTitle);

        document.querySelector('.emojis').appendChild(emoji)
    })
    
}

// Save button handler
document.querySelector('.save_button').onclick = async () => {
    const input = document.querySelector('.emoji_name_input');
    const name = input.value;

    // Checking if input value cotains only whitespaces
    if (name.replace(/\s+/g, '') == '') {
        // If yes, user receives visual warning
        input.className = 'emoji_name_input danger'
    }
    else {
        // If no, execute api call, to save emoji and show loading screen at this moment. 
        document.querySelector('.loading_overlay').className = 'loading_overlay';
        await API.set_emoji(CODE, name)
        document.querySelector('.loading_overlay').className = 'loading_overlay hidden';
        input.className = 'emoji_name_input'
    }

}


init();

othersEmojis();



// Debug
// async function othersEmojis() {

//     let otherMatrixes = (await API.get_emoji_list()).response.response;
//     // console.log(ot)
//     console.log(otherMatrixes)

//     Object.keys(otherMatrixes).forEach(matrix => {

//         console.log(matrix)
//         const canvas = create_matrix(hexToBin(matrix), false, null);

//         const emoji = document.createElement('a');
//         emoji.className = 'emoji';
//         emoji.setAttribute("href", `?id=${matrix}`);

//         const emojiTitle = document.createElement('div');
//         emojiTitle.className = 'emoji__title';
//         emojiTitle.innerText = otherMatrixes[matrix]

//         emoji.appendChild(canvas);
//         emoji.appendChild(emojiTitle);

//         document.querySelector('.emojis').appendChild(emoji)
//     })
// }
// otherCanvases.forEach(canvas => {
//     const emoji = document.createElement('a');
//     emoji.className = 'emoji';
//     emoji.setAttribute("href", "#");

//     const emojiTitle = document.createElement('div');
//     emojiTitle.className = 'emoji__title';
//     emojiTitle.innerText = 'WEmoji title'

//     emoji.appendChild(canvas);
//     emoji.appendChild(emojiTitle);

//     document.querySelector('.emojis').appendChild(emoji)
// })