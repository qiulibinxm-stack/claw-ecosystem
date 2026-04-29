import os, urllib.request, json, base64, sys

workspace = r'C:\Users\Administrator\.qclaw\workspace-agent-cf443017'
files = [
    ('examples/01_simple.py', 'temp_simple.py'),
    ('examples/02_tools.py', 'temp_tools.py'),
    ('examples/04_apps.py', 'temp_apps.py'),
    ('pyproject.toml', 'temp_pyproject.txt'),
]
out = []
for fn, label in files:
    req = urllib.request.Request('https://api.github.com/repos/prefecthq/fastmcp/contents/' + fn, headers={'User-Agent':'Mozilla/5.0'})
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read())
        content = base64.b64decode(data['content']).decode('utf-8')
        path = os.path.join(workspace, label)
        with open(path, 'w', encoding='utf-8') as fp:
            fp.write(content)
        out.append('OK:' + fn + ':' + str(len(content)))
    except Exception as e:
        out.append('FAIL:' + fn + ':' + str(e))

# Read and display
all_content = []
for fn, label in files:
    path = os.path.join(workspace, label)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as fp:
            content = fp.read()
        lines = content.split('\n')
        all_content.append('=== ' + fn + ' (' + str(len(lines)) + ' lines) ===')
        all_content.append('\n'.join(lines[:60]))
        all_content.append('...(truncated)...')
        all_content.append('')

with open(os.path.join(workspace, 'temp_examples_out.txt'), 'w', encoding='utf-8') as fp:
    fp.write('\n'.join(all_content))

for o in out:
    sys.stdout.buffer.write((o + '\n').encode('utf-8'))
sys.stdout.buffer.write('Files written\n'.encode('utf-8'))