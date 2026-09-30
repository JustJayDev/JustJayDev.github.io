#!/usr/bin/env python3
"""Serves dist/ the way GitHub Pages does: real files when they exist, and
404.html (the SPA shim) for any unknown path.

`npm run preview` uses Vite's own server, which DOES rewrite unknown paths to
index.html -- so it cannot catch deep-link bugs. This can.

Usage: python3 scripts/serve-pageslike.py [port]
"""
import http.server
import os
import socketserver
import sys

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dist')
SHIM = os.path.join(ROOT, '404.html')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4200


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Never let the parent touch the filesystem; _resolve is the only path.
        super().__init__(*args, directory=ROOT, **kwargs)

    def _resolve(self):
        path = self.path.split('?', 1)[0].split('#', 1)[0]
        full = os.path.normpath(os.path.join(ROOT, path.lstrip('/')))
        # Keep the resolver inside dist/.
        if not full.startswith(ROOT):
            return SHIM
        if os.path.isdir(full):
            index = os.path.join(full, 'index.html')
            full = index if os.path.isfile(index) else SHIM
        elif not os.path.isfile(full):
            full = SHIM
        return full

    def _serve(self, body):
        target = self._resolve()
        with open(target, 'rb') as f:
            data = f.read()
        self.send_response(200)
        self.send_header('Content-Type', self.guess_type(target))
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        if body:
            self.wfile.write(data)

    def do_GET(self):
        self._serve(True)

    def do_HEAD(self):
        self._serve(False)

    def log_message(self, *args):
        pass


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"serving {ROOT} on http://localhost:{PORT} (Pages-like 404 fallback)", flush=True)
    httpd.serve_forever()