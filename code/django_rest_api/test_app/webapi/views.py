from webapi.models import Profile
from webapi.serializers import ProfileSerializer
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.decorators import api_view,renderer_classes
from django.utils.crypto import get_random_string
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
import json
import base64
import mimetypes
import subprocess


class ProfileListCreate(generics.ListCreateAPIView):
	queryset = Profile.objects.all()
	serializer_class = ProfileSerializer

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

	file = open('/share/%s/sample.wasm' % fname,'rb')
	data = file.read()
	file.close()
	ret_data = {'wasm':base64.b64encode(data)}
	return Response(ret_data)
