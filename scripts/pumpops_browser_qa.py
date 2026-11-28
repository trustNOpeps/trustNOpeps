"""Real Chromium smoke test against hosted PumpOps and portfolio."""
import sys, re, csv, io, shutil, time
from playwright.sync_api import sync_playwright, expect
base=sys.argv[1].rstrip("/")+"/"
with sync_playwright() as p:
    chrome=shutil.which("google-chrome") or shutil.which("chromium")
    browser=p.chromium.launch(headless=True,executable_path=chrome) if chrome else p.chromium.launch(headless=True)
    for width,height in [(1440,900),(768,1024),(390,844),(320,700)]:
        context=browser.new_context(viewport={"width":width,"height":height},accept_downloads=True)
        page=context.new_page()
        errors=[]
        page.on("pageerror",lambda error:errors.append(str(error)))
        for attempt in range(12):
            try:
                response=page.goto(base+"apps/pumpops/?qa=rev2",wait_until="domcontentloaded",timeout=20000)
                assert response and response.ok
                expect(page.locator(".tag")).to_contain_text("REV 2.0",timeout=3000)
                break
            except Exception:
                if attempt==11: raise
                time.sleep(10)
        expect(page.locator("#baseline")).to_contain_text("kW")
        expect(page.locator("#comparison tr")).to_have_count(4)
        expect(page.locator("#sensitivity tr")).to_have_count(3)
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth+1"),f"Horizontal overflow at {width}"
        page.locator("#flow").fill("")
        expect(page.locator("#saving")).to_have_text("—")
        expect(page.locator("#csv")).to_be_disabled()
        expect(page.locator("#flow")).to_have_attribute("aria-invalid","true")
        page.locator("#reset").click()
        expect(page.locator("#flow")).to_have_value("85")
        expect(page.locator("#csv")).to_be_enabled()
        page.locator("#asset").fill("=1+1")
        with page.expect_download() as d:
            page.locator("#csv").click()
        raw=d.value.path().read_text(encoding="utf-8-sig")
        records={r[0]:r[1] for r in csv.reader(io.StringIO(raw)) if len(r)>=2}
        assert records["asset"]=="'=1+1"
        assert float(records["base"])>float(records["next"])
        page.locator("#tariff").fill("0")
        expect(page.locator("#barcurrent")).to_have_css("width","0px")
        page.locator("#reset").click()
        page.evaluate("window.print=()=>{window.__printed=true}")
        page.locator("#print").click()
        assert page.evaluate("window.__printed===true")
        assert not errors,errors
        page.screenshot(path=f"pumpops-{width}.png",full_page=True)
        response=page.goto(base+"#engineering",wait_until="domcontentloaded",timeout=30000)
        assert response and response.ok
        expect(page.locator("#project-pumpops")).to_be_visible(timeout=15000)
        href=page.locator("#project-pumpops .entry-actions a").first.get_attribute("href")
        assert href and "apps/pumpops/" in href
        print(f"PASS Chromium {width}x{height}: HTTP, UI, input, reset, CSV, print, sensitivity, no overflow, portfolio card")
        context.close()
    browser.close()
