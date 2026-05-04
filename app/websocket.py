import json
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from app.handlers.sentiment import analyzer

class WebSocketHandler:
    """ساده‌ترین پیاده‌سازی WebSocket برای Termux"""
    
    @staticmethod
    def handle_websocket(client_socket, headers):
        try:
            # پاسخ handshake WebSocket
            key = headers.get('Sec-WebSocket-Key', '')
            import hashlib
            import base64
            accept = base64.b64encode(hashlib.sha1((key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').encode()).digest()).decode()
            
            client_socket.send(b'HTTP/1.1 101 Switching Protocols\r\n')
            client_socket.send(b'Upgrade: websocket\r\n')
            client_socket.send(b'Connection: Upgrade\r\n')
            client_socket.send(f'Sec-WebSocket-Accept: {accept}\r\n\r\n'.encode())
            
            # دریافت و پردازش پیام‌ها
            while True:
                data = client_socket.recv(1024)
                if not data:
                    break
                
                # رمزگشایی فریم WebSocket (ساده شده)
                payload = data[2:2+data[1]]
                text = payload.decode('utf-8')
                
                try:
                    req = json.loads(text)
                    result = analyzer.analyze(req.get('text', ''), 'websocket')
                    
                    # ارسال پاسخ
                    response = json.dumps(result).encode()
                    frame = b'\x81' + bytes([len(response)]) + response
                    client_socket.send(frame)
                except:
                    pass
                    
        except Exception as e:
            pass

def run_websocket_server(port=8081):
    """اجرای WebSocket server در پورت جداگانه"""
    import socket
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('0.0.0.0', port))
    server.listen(5)
    print(f'🔌 WebSocket server running on ws://0.0.0.0:{port}')
    
    def accept_loop():
        while True:
            client, addr = server.accept()
            thread = threading.Thread(target=WebSocketHandler.handle_websocket, args=(client, {}))
            thread.daemon = True
            thread.start()
    
    thread = threading.Thread(target=accept_loop)
    thread.daemon = True
    thread.start()
