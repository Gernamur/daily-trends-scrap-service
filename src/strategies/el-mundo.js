export default async page => {
    await page.goto('https://www.elmundo.es/');
    return page.evaluate(() =>
        Array.from(document.querySelectorAll('article > div > div > header > a > h2'))
            .map(x => x.innerText))
}
