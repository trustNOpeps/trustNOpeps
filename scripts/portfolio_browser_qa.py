"""Read-only browser smoke tests for a locally served published tree."""
import os
import shutil
import sys
from playwright.sync_api import sync_playwright

base = sys.argv[1].rstrip('/') + '/'
with sync_playwright() as p:
    executable = shutil.which('google-chrome') or shutil.which('chromium')
    browser = p.chromium.launch(headless=True, executable_path=executable, args=['--no-sandbox','--disable-dev-shm-usage'])
    for width in (320,390,768,1440):
        context = browser.new_context(viewport={'width':width,'height':900}, reduced_motion='reduce', is_mobile=width<=390, has_touch=width<=390)
        page = context.new_page()
        response = page.goto(base, wait_until='domcontentloaded',timeout=30000)
        assert response and response.ok, f'Homepage {width}'
        page.locator('#hero-heading').wait_for()
        assert page.locator('[id^="project-"]').count()==17
        assert page.locator('main section[data-scene]').count()==7
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+2'), f'Homepage overflow {width}'
        if width<=390:
            page.locator('.mobile-navigation summary').click()
            page.locator('.mobile-navigation a[href="#engineering"]').click()
            assert page.evaluate('location.hash')=='#engineering'
        for key in ('mech-os-shaft','fabframe','machinescope','apply-os','elsewhere','arah-supplies'):
            assert page.locator('#project-'+key+' h3').is_visible(), key
        page.goto(base+'apps/fabframe/',wait_until='domcontentloaded')
        page.locator('#mass').wait_for()
        assert '11.11' in page.locator('#mass').inner_text()
        page.locator('#w').fill('800')
        assert page.locator('#mass').inner_text()!='11.11 kg'
        page.locator('#kerf').fill('')
        assert page.locator('#error').inner_text().strip()
        assert page.locator('#cad').is_disabled()
        context.close()
        print('PASS browser viewport',width)
    browser.close()
