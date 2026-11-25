"""Render a dated snapshot from public GitHub repository metadata only."""
from collections import Counter
from datetime import datetime, timezone
from html import escape
from pathlib import Path
import json
import os
import urllib.request

OWNER = 'trustNOpeps'
ROOT = Path(__file__).resolve().parents[1]

def public_repositories():
    repos = []
    headers = {'Accept': 'application/vnd.github+json', 'User-Agent': 'haammkaki-profile'}
    if token := os.environ.get('GITHUB_TOKEN'):
        headers['Authorization'] = f'Bearer {token}'
    for page in range(1, 101):
        url = f'https://api.github.com/users/{OWNER}/repos?type=owner&per_page=100&page={page}'
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request, timeout=30) as response:
            batch = json.load(response)
        if not isinstance(batch, list):
            raise ValueError('GitHub did not return a repository list')
        repos.extend(r for r in batch if not r.get('private', True) and r['owner']['login'].lower() == OWNER.lower())
        if len(batch) < 100:
            return repos
    raise ValueError('Pagination limit exceeded; refusing a partial snapshot')

def render(repos, date):
    languages = Counter(r['language'] for r in repos if r.get('language'))
    labels = languages.most_common()
    palette = ['#c4f06b', '#8bbdf4', '#d6a4f2', '#edc084', '#7bdbbd', '#f09fa9']
    svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="900" height="270" viewBox="0 0 900 270" role="img" aria-labelledby="title desc">',
           '<title id="title">Public repository snapshot</title>',
           f'<desc id="desc">{len(repos)} public repositories, {len(languages)} primary languages. Updated {date}. Counts are repositories, not proficiency.</desc>',
           '<rect width="900" height="270" rx="18" fill="#0d151d"/>',
           '<g font-family="Arial,sans-serif">',
           '<text x="32" y="37" fill="#a6b4c0" font-size="13" letter-spacing="2">GITHUB / PUBLIC REPOSITORIES</text>',
           f'<text x="32" y="102" fill="#c4f06b" font-size="44" font-weight="700">{len(repos)}</text>',
           '<text x="95" y="96" fill="#e5ecf2" font-size="18">public repositories</text>',
           f'<text x="470" y="102" fill="#8bbdf4" font-size="44" font-weight="700">{len(languages)}</text>',
           '<text x="530" y="96" fill="#e5ecf2" font-size="18">primary languages</text>']
    total = sum(languages.values())
    x = 32
    for i, (name, count) in enumerate(labels):
        width = 836 * count / max(total, 1)
        svg.append(f'<rect x="{x:.2f}" y="133" width="{width:.2f}" height="13" fill="{palette[i % len(palette)]}"/>')
        x += width
        # Two rows keep the card readable if the language mix expands.
        col, row = i % 4, i // 4
        if i < 8:
            px, py = 32 + col * 211, 178 + row * 25
            svg.append(f'<circle cx="{px+5}" cy="{py-5}" r="4" fill="{palette[i % len(palette)]}"/><text x="{px+17}" y="{py}" fill="#d1dbe3" font-size="13">{escape(name)} · {count}</text>')
    svg.append(f'<text x="32" y="239" fill="#93a4b2" font-size="12">Updated {date} UTC · Source: GitHub API · Language counts are per repository</text></g></svg>')
    return ''.join(svg)

if __name__ == '__main__':
    repos = public_repositories()
    date = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    target = ROOT / 'assets/profile/repository-stats.svg'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(render(repos, date), encoding='utf-8')
    print(f'Rendered {len(repos)} public repositories, updated {date}')
