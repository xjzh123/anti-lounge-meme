import requests
print(requests.post('https://6kkcp1.deta.dev/', {'message': 'jibå'}).content.decode())