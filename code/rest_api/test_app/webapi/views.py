from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.decorators import api_view,renderer_classes
from django.utils.crypto import get_random_string
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
import json
import os
import shutil
import base64
import mimetypes
import subprocess

@csrf_exempt
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def Compile(request, format=None):
	fname = 'lib'
	try:
		code = request.data['code']
		fname = get_random_string(length = 15)
		fcode = open('/share/%s.rs' % fname,'w')
		fcode.write(code)
		fcode.close()
	except (KeyError):
		print('no code')
		pass
	popen = subprocess.Popen("docker run -e NONCE=%s --rm -it -v $INK_DIR:/share ink_env"%fname, shell=True)
	popen.wait()

	fwasm = open('/share/%s/sample.wasm' % fname,'rb')
	wasm = fwasm.read()
	fwasm.close()

	fabi = open('/share/%s/old_abi.json' % fname,'r')
	abi = fabi.read()
	fabi.close()
	
	shutil.rmtree('/share/%s/' % fname )
	os.remove('/share/%s.rs' % fname)

	ret_data = {'wasm':base64.b64encode(wasm),'abi':abi}
	return Response(ret_data)
