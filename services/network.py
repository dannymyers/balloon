import socket
try:
    import httplib
except:
    import http.client as httplib

from uptime import uptime

x = socket.gethostbyname(socket.gethostname())
print(x)


def have_internet():
    conn = httplib.HTTPConnection("www.google.com", timeout=5)
    try:
        conn.request("HEAD", "/")
        conn.close()
        return True
    except:
        conn.close()
        return False

print(have_internet())

print(uptime())