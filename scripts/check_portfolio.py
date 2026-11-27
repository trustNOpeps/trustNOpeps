"""Check the published portfolio against the canonical project registry."""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.links = []
        self.scenes = []
        self.numbers = []
        self.number = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'): self.ids.append(a['id'])
        if a.get('data-scene') and tag == 'section': self.scenes.append(a['data-scene'])
        if 'showcase-number' in a.get('class','').split(): self.number = True
        for key in ('href','src','srcset'):
            if a.get(key): self.links.append(a[key])
    def handle_data(self, data):
        if self.number:
            if data.strip().isdigit(): self.numbers.append(int(data.strip()))
            self.number = False

root = Path(sys.argv[1]).resolve()
registry = json.loads(Path(sys.argv[2]).read_text())
page = Page()
page.feed((root / 'index.html').read_text())
assert len(page.ids) == len(set(page.ids)), 'Duplicate HTML IDs'
assert len(page.scenes) == 7, 'Approved seven-scene structure changed'
assert page.numbers == list(range(1,len(page.numbers)+1)), 'Project numbering not sequential'
expected = {'project-'+p['id'] for p in registry['projects']}
actual = {i for i in page.ids if i.startswith('project-')}
assert actual == expected, (expected-actual,actual-expected)
for link in page.links:
    u = urlsplit(link)
    if u.scheme or u.netloc: continue
    if not u.path:
        if u.fragment: assert u.fragment in page.ids, link
        continue
    target = (root / unquote(u.path)).resolve()
    assert target.is_relative_to(root), link
    assert target.is_file() or (target / 'index.html').is_file(), link
for name in ['fabframe','machinescope','elsewhere','little-world','pixel-desk','request-desk','tensile-desk']:
    assert (root/'apps'/name/'index.html').is_file(), name
print(f'PASS: {len(expected)} projects, {len(page.scenes)} scenes, {len(page.links)} links inspected')
