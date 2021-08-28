const FindFiles = require('file-regex')

const pattern = /\.mkv$/

async function listFiles() {
    const result = await FindFiles(process.cwd(), pattern, 5);

    let files = []
    for (let i = 0; i < result.length; i++) {
        files.push(result[i])
    }
    return files
}

module.exports = {
    listFiles
}