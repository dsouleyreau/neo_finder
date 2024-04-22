FROM python:3

ARG WORKDIR=/backend

# Set environment variables
ENV PYTHONPATH "${PYTHONPATH}:/${WORKDIR}"
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR ${WORKDIR}

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt