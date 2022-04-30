ARG PYTHON_VERSION=3.10.4
FROM python:${PYTHON_VERSION}-alpine

RUN pip3 install networkx

EXPOSE 8156
COPY . .

CMD ["python", "./max_weight_matching.py"]

LABEL maintainer="Minty Fresh"
