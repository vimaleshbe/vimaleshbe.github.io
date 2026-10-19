#!/usr/bin/env python3
"""
Simple HTTP server for local development
Run this to serve your profile page locally and avoid CORS issues.

Usage:
    python server.py
    
Then open: http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
import os

# Change to the script's directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def main():
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Server starting at http://localhost:{PORT}")
        print(f"Serving files from: {os.getcwd()}")
        print(f"Your profile page: http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server")

        # Auto-open browser
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except Exception:
            print("Could not auto-open browser, please open manually")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")

if __name__ == "__main__":
    main()