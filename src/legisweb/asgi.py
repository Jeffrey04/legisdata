"""
ASGI config for legisweb project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

import dotenv
from django.core.asgi import get_asgi_application

dotenv.read_dotenv(
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "legisweb.settings")

application = get_asgi_application()
