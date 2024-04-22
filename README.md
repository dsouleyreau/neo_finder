# Near Earth Objects Finder

This project is a technical exercise prior to a job interview.

## Context

It is asked to list the celestial bodies passing close to the Earth. We want to be able to enter a start and end date filter this list.

For each asteroid in the list, display:

- its name
- its estimated size
- the distance it passes from the Earth
- the date of its next approach

When clicking on an asteroid, we want to display the last 5 times the asteroid passed close to the Earth, with the corresponding date and distance at which it passed.

## Installation

Before all, Docker and the Docker Compose plugin need to be installed on your device.

First, copy the `.env.sample` file into `.env` and change these values.

Run these once:

> docker compose up --build

Run the server:

> docker compose start

Run with trailing logs:

> docker compose up

Or

> docker compose start

> docker compose logs -f

## References

Setting up Django with Docker:

- https://github.com/docker/awesome-compose/tree/master/official-documentation-samples/django/
- https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/
- https://parthkoshta.medium.com/dockerize-your-react-django-rest-api-application-and-serve-using-nginx-6f9ccf17105b
