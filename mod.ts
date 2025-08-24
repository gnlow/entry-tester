import { launch } from "./src/deps.ts"

export const capture =
async (proj: unknown) => {
    await using browser = await launch({ headless: false })
    await using page = await browser.newPage("https://playentry.org/ws/new")

    await page.waitForSelector(".tooltipGuide")
    await page.$(".tooltipGuide")
        .then(x => x?.evaluate(
            (el: HTMLElement) => el.remove()
        ))

    await page.waitForSelector("canvas")

    // deno-lint-ignore no-explicit-any
    const Entry = {} as any

    await page.evaluate(proj => {
        Entry.clearProject()
        Entry.loadProject(proj)
        Entry.engine.run()
    }, { args: [proj] })

    return await page.$("canvas")
        .then(x => x?.screenshot()!)
}
