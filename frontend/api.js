const baseUrl = "https://us-central1-pixel-emoji.cloudfunctions.net"

const API = {
    get_emoji_name: (emojiId) => get_request(`${baseUrl}/getEmojiName?id=${emojiId}`),
    get_emoji_list: () => get_request(`${baseUrl}/getEmojiList`),
    set_emoji: (emojiId, emojiName) => get_request(`${baseUrl}/setEmoji?id=${emojiId}&name=${emojiName}`),
}

async function get_request(path) {
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    let response, error;

    await fetch(path, requestOptions)
        .then((resp) => resp.json())
        .then(result => response = result)
        .catch(err => error = err);

    return {response: response, error: error}
}   