const puppeteer = require('puppeteer')
const path = require('path')
const child_process = require('child_process')

const cmd = 'mkvextract HNK_001_Remastered_Edition.mkv chapters --simple "My Chapters.txt" tracks -c MS-ANSI "4:MySubs.srt"'
const url = 'https://translatesubtitles.com/subtitlestranslator/index.php'
const filePath = path.join(__dirname, '/MySubs.srt')
console.log(filePath);


getSubs = async () => {
    try {
        const process = await child_process.exec(cmd)

        process.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        })
        return true

    } catch (e) {
        console.log(e)
    }
    return false
}

translateSubs = async () => {
    console.log('Lanzamos navegador!');
    const browser = await puppeteer.launch({ headless: false })

    const page = await browser.newPage()
    await page.goto(url)
    const navigationPromise = page.waitForNavigation()
    const waitSelector = (selector) => page.waitForSelector(selector, { visible: true })

    await waitSelector('input[type="file"]')
    const elementHandle = await page.$('input[type=file]')
    await elementHandle.uploadFile(filePath)


    await setTimeout(() => {
        page.click('button[id=next-button]')
    }, 1000)
    await navigationPromise

    await waitSelector('select[class=goog-te-combo]')
    await page.select('select[class=goog-te-combo]', 'es')
    await waitSelector('button[id=translate-button]')


    await setTimeout(() => {
        page.click('button[id=translate-button]')
    }, 2000)


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

    const processSuccess = await getSubs();
    console.log(processSuccess)

    if (processSuccess) {
        await translateSubs()
    }
}

main()