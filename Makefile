.PHONY: build up down setup migrate migration logs shell

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

setup: build up
	docker compose exec api flask db init
	docker compose exec api flask db migrate -m "create produtos table"
	docker compose exec api flask db upgrade

migration:
	docker compose exec api flask db migrate -m "$(msg)"

migrate:
	docker compose exec api flask db upgrade