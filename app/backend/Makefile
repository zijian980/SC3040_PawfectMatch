format:
	black app/ && ruff check --fix app/

lint:
	ruff check app/ && mypy app/

check:
	black --check app/ && ruff check app/ && mypy app/

migrate:
	alembic upgrade head

create_db:
	python app/database/scripts/create_db.py

mock_data:
	python app/database/scripts/mock_data.py

setup: create_db migrate mock_data
