FROM python:3.12-slim

WORKDIR /code

COPY . /code

RUN apt-get update && apt-get install -y libgdal-dev g++
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

#CMD ["fastapi", "run", "main.py", "--port", "80"]

# If running behind a proxy like Nginx or Traefik add --proxy-headers
CMD ["fastapi", "run", "main.py", "--port", "80", "--proxy-headers"]
