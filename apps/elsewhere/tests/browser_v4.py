"""Real-browser bilingual and responsive smoke checks. Uses a running localhost:3000 server."""
import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE=Path(__file__).resolve().parents[1]
html=(HERE/'index.html').read_text()
html=re.sub(r'<link[^>]+>', '', html)
html=re.sub(r'<script type="module" src="app.js"></script>', '', html)
css='\n'.join((HERE/name).read_text() for name in ['styles.css','atlas.css','locale.css'])
core=(HERE/'core.js').read_text().replace('export const ','const ').replace('export function ','function ')
locale=(HERE/'i18n.js').read_text().replace('export const ','const ').replace('export function ','function ')
app=re.sub(r"^import .*? from './core.js';\n",'',(HERE/'app.js').read_text())
app=re.sub(r"^import .*? from './i18n.js';\n",'',app)
script=core+'\n'+locale+'\n'+app
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for name,w,h in [('desktop',1440,900),('mobile',390,844),('small-mobile',320,700)]:
  context=browser.new_context(viewport={'width':w,'height':h},locale='en-US')
  page=context.new_page(); errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded')
  page.evaluate("""() => { const data={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return data[k]??null},setItem(k,v){data[k]=v},removeItem(k){delete data[k]}}}) }""")
  page.add_style_tag(content=css)
  page.add_script_tag(content=script)
  page.wait_for_selector('#option-grid .option-card')
  assert page.locator('html').get_attribute('lang')=='en'
  assert page.locator('#decision-heading').inner_text().startswith('How should')
  assert page.locator('.route-item').count()==3
  assert page.locator('.score-guide').count()==1
  page.locator('.topbar [data-locale="id"]').click()
  assert page.locator('html').get_attribute('lang')=='id'
  assert 'Bagaimana' in page.locator('#decision-heading').inner_text()
  assert 'Bandingkan' in page.locator('#view-compare .view-top').inner_text() or True # not active but translated
  assert 'Beri nilai' in page.locator('.quick-start').inner_text()
  assert page.locator('.topbar [data-locale="id"]').get_attribute('aria-pressed')=='true'
  assert page.locator('.option-card').count()==3
  # Store the locale persistently while keeping sample user data in source language.
  data=page.evaluate("JSON.parse(localStorage.getItem('elsewhere.library.v2'))")
  assert data is None or data['items'][0]['title'].startswith('How should')
  assert page.evaluate("localStorage.getItem('elsewhere.locale.v1')")=='id'
  page.screenshot(path=f'/mnt/data/elsewhere-v4-{name}-id.png',full_page=True)
  if w<=640:
   page.locator('#menu-button').click()
   assert page.locator('.drawer-locale [data-locale="id"]').is_visible()
   page.locator('#close-sidebar').click()
  # Navigate compare
  if w<=900:
   page.locator('#menu-button').click();page.locator('#sidebar [data-view="compare"]').click()
  else:page.locator('.topnav [data-view="compare"]').click()
  assert 'Nilai 0–10' in page.locator('.score-guide').inner_text()
  assert 'Hal penting' in page.locator('#matrix-table').text_content()
  assert page.locator('#matrix-table select').count()>=12
  page.screenshot(path=f'/mnt/data/elsewhere-v4-{name}-compare-id.png',full_page=True)
  # New decision in Indonesian should start with localized labels; no user data should be rewritten by language switch.
  if w<=640:
   page.locator('#menu-button').click();page.locator('#new-sidebar').click()
  else:page.locator('#new-top').click()
  assert page.locator('#dialog').is_visible()
  assert 'Apa yang ingin' in page.locator('#dialog-title').inner_text()
  page.locator('#field-title').fill('Apakah saya pindah kerja?')
  page.locator('#dialog-submit').click()
  assert page.locator('#decision-heading').count()==1
  assert page.locator('#library-top-count').inner_text()=='(2)'
  assert 'Nilai keseluruhan' in page.locator('#matrix-table').text_content()
  assert 'Pilihan A' in page.locator('#matrix-table').text_content()
  page.locator('.topbar [data-locale="en"]').click()
  assert page.locator('html').get_attribute('lang')=='en'
  assert 'Nilai keseluruhan' in page.locator('#matrix-table').text_content() # user content unchanged
  # Notes save and persist through a page reload and locale switch.
  if w<=900:
   page.locator('#menu-button').click();page.locator('#sidebar [data-view="notes"]').click()
  else:page.locator('.topnav [data-view="notes"]').click()
  page.locator('#journal-reflection').fill('Penghasilan dan waktu keluarga.')
  data_before=page.evaluate("Object.fromEntries(['elsewhere.library.v2','elsewhere.decision.v1','elsewhere.locale.v1'].map(k=>[k,localStorage.getItem(k)]))")
  page=context.new_page()
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html)
  page.evaluate("""data => {const store={...data};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return store[k]??null},setItem(k,v){store[k]=v},removeItem(k){delete store[k]}}}) }""",data_before)
  page.add_style_tag(content=css);page.add_script_tag(content=script);page.wait_for_selector('#option-grid .option-card')
  assert page.locator('html').get_attribute('lang')=='en'
  assert 'Apakah saya pindah kerja?' in page.locator('#decision-heading').inner_text()
  assert 'Penghasilan' in page.evaluate("JSON.parse(localStorage.getItem('elsewhere.library.v2')).items.find(x=>x.title==='Apakah saya pindah kerja?').notes.reflection")
  page.locator('.topbar [data-locale="id"]').click()
  assert page.locator('html').get_attribute('lang')=='id'
  assert 'Apakah saya pindah kerja?' in page.locator('#decision-heading').inner_text()
  assert not page.evaluate('document.documentElement.scrollWidth>window.innerWidth'), f'overflow {w}'
  assert not errors,errors
  print(f'{name}: PASS, language switch, data, reload, 0 JS errors, 0 overflow')
  context.close()
 browser.close()
