import random
import string
import json
import os
import shutil
import base64
import subprocess
from flask import Flask, request,jsonify,make_response,render_template
from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler

app = Flask(__name__)

def get_random_str(length):
	dat = string.digits + string.ascii_lowercase + string.ascii_uppercase
	return ''.join([random.choice(dat) for i in range(length)])

@app.route('/api/compile/')
def compile():
	print('get compile request')
	if request.environ.get('wsgi.websocket'):
		ws = request.environ['wsgi.websocket']
		data = json.loads(ws.receive())
		fname = 'lib'
		try:
			code = data['code']
			fname = get_random_str(length = 15)
			fcode = open('/share/%s.rs' % fname,'w')
			fcode.write(code)
			fcode.close()
		except (KeyError):
			print('no code')
			pass
		
		print("begin compile: docker run -e NONCE=%s --rm -it -v $INK_DIR:/share ink_env" % fname)
		popen = subprocess.Popen("docker run -e NONCE=%s --rm -it -v $INK_DIR:/share ink_env"%fname, shell=True)
		popen.wait()
		
		retobj={}

		try:
			fwasm = open('/share/%s/sample.wasm' % fname,'rb')
			wasm = fwasm.read()
			fwasm.close()
		except:
			pass
		else:
			retobj['wasm']=base64.b64encode(wasm).decode('utf-8')
		try:
			fmetadata = open('/share/%s/metadata.json' % fname,'r')
			metadata = fmetadata.read()
			fmetadata.close()
		except:
			pass
		else:
			retobj['metadata']=metadata
		try:
			flog = open('/share/%s/log.txt' % fname,'r')
			log = flog.read()
			flog.close()
		except:
			pass
		else:
			retobj['log']=log
		
		ws.send(json.dumps(retobj))
		ws.close()
		print('websocket closed')

		shutil.rmtree('/share/%s/' % fname )
		os.remove('/share/%s.rs' % fname)

		return ('',204)

def main():
	app.debug = True
	server = pywsgi.WSGIServer(("", 8000), app, handler_class=WebSocketHandler)
	server.serve_forever()

if __name__ == "__main__":
	main()
