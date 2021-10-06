export default async page => {
    await page.goto('https://elpais.com/')
    return await page.evaluate(() =>
        Array.from(document.querySelectorAll('#fusion-app > div > main > div.z.z-hi article header > h2 > a'))
            .map(x => x.innerText))
}