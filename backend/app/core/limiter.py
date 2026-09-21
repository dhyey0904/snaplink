from slowapi import Limiter
from slowapi.util import get_remote_address

# Create a globally accessible limiter
limiter = Limiter(key_func=get_remote_address)
