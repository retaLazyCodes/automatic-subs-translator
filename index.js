const puppeteer = require('puppeteer')
const path = require('path')
const child_process = require('child_process')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv))
    .option('track', {
        alias: 't',
        default: 2,
        type: 'number',
        description: 'select the track id to extract subs'
    })
    .check((argv, options) => {
        if (isNaN(argv.track)) {
            argv.track = 2
        }
        return true
    })
    .argv

const { listFiles } = require('./utils/findFiles')
const { replaceAll } = require('./utils/customReplace')

const url = 'https://translatesubtitles.com/subtitlestranslator/index.php'


getCommands = async (files) => {
    let commands = []
    files.forEach(element => {
        const { file } = element
        let cmd = ''
        if (process.platform === 'win32') {
            cmd = `mkvextract "${file}" chapters --simple "My Chapters.txt" tracks -c MS-ANSI "${argv.track}:${file.replace('mkv', 'srt')}"`
        } else {
            const filename = replaceAll(file, ' ', '\\ ')
            cmd = `mkvextract ${filename} chapters --simple "My Chapters.txt" tracks -c MS-ANSI "${argv.track}:${file.replace('mkv', 'srt')}"`
        }
        commands.push(cmd)
    });
    return commands
}

extractSubs = async () => {
    try {
        const files = await listFiles()
        const commands = await getCommands(files)
        commands.map((cmd) => {
            console.log(cmd)
            child_process.execSync(cmd)
        })
        return files

    } catch (e) {
        console.log(e)
    }
    return false
}

translateSubs = async (files) => {

    console.log('Lanzamos navegador!');
    const browser = await puppeteer.launch({ headless: false })

    const page = await browser.newPage()
    await page.goto(url)
    const navigationPromise = page.waitForNavigation()
    const waitSelector = (selector) => page.waitForSelector(selector, { visible: true })

    await waitSelector('input[type="file"]')
    const elementHandle = await page.$('input[type=file]')

    let filesToUpload = []
    files.forEach(element => {
        let filePath = path.join(element.dir, element.file.replace('mkv', 'srt'))
        filesToUpload.push(filePath)
    })

    await elementHandle.uploadFile(...filesToUpload)

    await setTimeout(() => {
        page.click('button[id=next-button]')
    }, 2000)
    await navigationPromise

    await waitSelector('select[class=goog-te-combo]')
    await page.select('select[class=goog-te-combo]', 'es')
    await waitSelector('button[id=translate-button]')


    await setTimeout(() => {
        page.click('button[id=translate-button]')
    }, 3000)


    await waitSelector('#page-top > div.dialog.skiptranslate')
    await page.click('#dialog-cancel')

    await waitSelector('#download-button > span')
    await page.click('#download-button > span')

    await waitSelector('#download-btn')
    await page.click('#download-btn')


    await setTimeout(() => {
        console.log('Cerramos navegador...');
        browser.close();
        console.log('Navegador cerrado');
    }, 15000)
}

async function main() {

    const files = await extractSubs();
    console.log(files)

    if (files) {
        await translateSubs(files)
    }
}

main()