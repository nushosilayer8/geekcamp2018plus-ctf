FROM ubuntu:latest
RUN apt-get update && apt-get install -y \
	python-pip \
	python-dev \
	build-essential \
	&& rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY ./src/requirements.txt .
RUN pip install -r requirements.txt
