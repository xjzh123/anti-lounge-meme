import requests
print(requests.post('http://127.0.0.1:3000', {'message': 'jibå'}).content.decode())