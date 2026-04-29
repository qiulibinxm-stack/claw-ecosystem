# -*- coding: utf-8 -*-
import json
import urllib.request
import sys

body = json.dumps({"keyword": "免费在线视频转文字工具"})
req = urllib.request.Request(
    "http://127.0.0.1:19000/proxy/prosearch/search",
    data=body.encode('utf-8'),
    headers={"Content-Type": "application/json"}
)
try:
    resp = urllib.request.urlopen(req)
    data = resp.read()
    sys.stdout.buffer.write(data)
except Exception as e:
    print(json.dumps({"success": False, "message": str(e)}), file=sys.stderr)