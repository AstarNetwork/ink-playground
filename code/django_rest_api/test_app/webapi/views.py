from webapi.models import Profile
from webapi.serializers import ProfileSerializer
from django.http.response import HttpResponse,JsonResponse
from rest_framework import generics
import shutil
import mimetypes
import subprocess


class ProfileListCreate(generics.ListCreateAPIView):
	queryset = Profile.objects.all()
	serializer_class = ProfileSerializer

def Compile(request):
	try:
		code = request.POST['code']
		fcode = open('/share/lib.rs','w')
		fcode.write(code)
		fcode.close()
	except (KeyError):
		print('no code')
		pass
	popen = subprocess.Popen("docker run --rm -it -v $INK_DIR:/share proj_ink", shell=True)
	popen.wait()
	file = open('/share/sample.wat','r')
	data = file.read()
	file.close()
	ret = {'wat':data}
	return JsonResponse(ret)
