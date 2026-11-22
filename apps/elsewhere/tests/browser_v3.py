"""Offline desktop and mobile end-to-end smoke checks with no external network dependencies."""
import re
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text()
html=re.sub(r'<link[^>]+>', '', html)
html=re.sub(r'<script type="module" src="app.js"></script>', '', html)
css=(root/'styles.css').read_text()+'\n'+(root/'atlas.css').read_text()
core=(root/'core.js').read_text().replace('export const ','const ').replace('export function ','function ')
app=re.sub(r'^import .*? from \'./core.js\';\n','',(root/'app.js').read_text())
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-web-security'])
 for name, w, h in [('desktop',1440,960),('mobile',390,844),('small-mobile',320,700)]:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  errs=[]
  page.on('pageerror', lambda error: errs.append(str(error)))
  page.set_content(html,wait_until='domcontentloaded')
  page.evaluate("""() => { const data={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return data[k]??null},setItem(k,v){data[k]=v},removeItem(k){delete data[k]}}}) }""")
  page.add_style_tag(content=css)
  page.add_script_tag(content=core+'\n'+app)
  assert page.locator('#option-grid .option-card').count()==3
  assert page.locator('#library-top-count').inner_text()=='(1)'
  assert page.locator('#example-banner').is_visible()
  assert page.locator('.quick-step').count()==3
  assert page.locator('.route-item').count()==3
  assert page.locator('.topnav .nav-item').count()==4
  page.screenshot(path=f'/mnt/data/elsewhere-v3-{name}.png',full_page=True)
  # New decision should be saved, not overwrite existing sample
  page.locator('#hero-new').click()
  page.locator('#field-title').fill('Should I learn a new skill?')
  page.locator('#dialog-submit').click()
  assert page.locator('#library-top-count').inner_text()=='(2)'
  assert page.locator('#view-compare').evaluate('(el)=>el.classList.contains("active")')
  assert page.locator('#matrix-table tbody tr').count()==5
  page.screenshot(path=f'/mnt/data/elsewhere-v3-{name}-compare.png',full_page=True)
  if name=='desktop':
   page.locator('#matrix-table select').first.select_option('9')
  else:
   assert page.locator('#mobile-score').is_visible()
   page.locator('#mobile-option-select').select_option('b')
   range_in=page.locator('#mobile-score input[data-mobile-score]').first
   range_in.fill('9')
   range_in.dispatch_event('change')
   assert '9/10' in page.locator('.mobile-score-head output').first.inner_text()
  # Add third option, edit first criterion
  page.locator('#add-option').click()
  page.locator('#field-name').fill('Build something')
  page.locator('#dialog-submit').click()
  assert page.locator('#matrix-table thead th').count()==6
  page.locator('#add-criterion').click()
  page.locator('#field-name').fill('Learning potential')
  page.locator('#field-weight').fill('45')
  page.locator('#dialog-submit').click()
  assert page.locator('#matrix-table tbody tr').count()==6
  # Scenario settings work and note saves
  if name!='desktop':
   page.locator('#menu-button').click()
  page.locator(('#sidebar ' if name!='desktop' else '.topnav ')+'[data-view="scenario"]').click()
  page.locator('[data-preset="balanced"]').click()
  assert page.locator('.scenario-chart-row').count()==3
  if name!='desktop':page.locator('#menu-button').click()
  page.locator(('#sidebar ' if name!='desktop' else '.topnav ')+'[data-view="notes"]').click()
  page.locator('#journal-reflection').fill('A clearer way to decide.')
  assert 'A clearer way' in page.evaluate("JSON.parse(localStorage.getItem('elsewhere.library.v2')).items[0].notes.reflection")
  # Switching restores previously saved example without losing new decision.
  if name=='small-mobile':
   page.locator('#menu-button').click()
   page.locator('#library-sidebar').click()
  else:
   page.locator('#library-top').click()
  assert page.locator('.library-item').count()==2
  page.locator('.library-choice').filter(has_text='free weekend').click()
  assert 'free weekend' in page.locator('#decision-heading').inner_text()
  assert page.locator('#library-top-count').inner_text()=='(2)'
  # Restore blank decision
  if name=='small-mobile':
   page.locator('#menu-button').click()
   page.locator('#library-sidebar').click()
  else:
   page.locator('#library-top').click()
  page.locator('.library-choice').filter(has_text='learn a new skill').click()
  assert 'learn a new skill' in page.locator('#decision-heading').inner_text()
  assert not errs,errs
  horizontal=page.evaluate('document.documentElement.scrollWidth > innerWidth')
  print(name,'PASS','overflow:',horizontal,'errors:',len(errs),flush=True)
  assert not horizontal
  page.close()
 browser.close()
