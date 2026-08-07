# Alembic Migrations

This directory contains database migration scripts for the inventory-app.

## Setup

First, ensure you have the required dependencies installed:

```bash
pip install alembic aiosqlite
```

## Configuration

The Alembic configuration is in `alembic.ini`. The database URL can be set via the `DATABASE_URL` environment variable or defaults to `sqlite:///./inventory.db`.

## Usage

### Initialize (if not already done)

```bash
alembic init migrations
```

### Create a new migration

```bash
# Generate a new empty migration
alembic revision -m "migration_name"

# Or generate an autogenerate migration based on model changes
alembic revision --autogenerate -m "description of changes"
```

### Apply migrations

```bash
# Upgrade to latest version
alembic upgrade head

# Upgrade to a specific version
alembic upgrade <revision_id>

# Downgrade by one version
alembic downgrade -1

# Downgrade to a specific version
alembic downgrade <revision_id>
```

### Check migration status

```bash
# Show current revision
alembic current

# Show history of migrations
alembic history

# Show heads (latest versions)
alembic branches
```

## Notes for SQLite

For SQLite databases, Alembic uses batch mode to handle ALTER operations since SQLite doesn't support them natively. This is configured in the `env.py` file via `render_as_batch=True`.
