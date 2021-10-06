import puppeteer from 'puppeteer'
import axios from 'axios'
import elMundoStrategy from './strategies/el-mundo.js'
import elPaisStrategy from './strategies/el-pais.js'

const strategies = [
    { mediaCompany: 'El Mundo', strategy: elMundoStrategy },
    { mediaCompany: 'El pais', strategy: elPaisStrategy }
]

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const scrapTask = async strategy => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    })
    const page = await browser.newPage()
    let result = await strategy(page)
    await browser.close()
    return result
}

while (true) {

    await strategies.reduce((prevScrapTask, current) => prevScrapTask
        .then(async () => {
            let result = await scrapTask(current.strategy)
            result && await result.reduce((prevPostTask, content) => prevPostTask.then(() =>
                axios.post(`http://${process.env.API_SERVER_IP}:${process.env.API_SERVER_PORT}/feeds`, {
                    content,
                    mediaCompany: current.mediaCompany,
                    dateCreated: (new Date()).toISOString()
                })
                    .then(res => console.log(`[SUCCESS][${(new Date()).toISOString()}][${res.data._id}]`))
                    .catch(err => console.log(`[ERROR][${(new Date()).toISOString()}][${err.message}]`))
            ), Promise.resolve())
        })
        .catch(console.log)
        , Promise.resolve())
    await delay(process.env.DELAY_TIME_MILLIS)
}