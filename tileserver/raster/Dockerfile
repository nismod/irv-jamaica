FROM python:3.10

RUN apt-get update && apt-get install -y libgdal-dev
WORKDIR /code
COPY requirements.txt requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install -r requirements.txt

CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:5000", "-m", "007", "--access-logfile", "'-'", "terracotta.server.app:app"]
