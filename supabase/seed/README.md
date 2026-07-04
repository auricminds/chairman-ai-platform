# Seed

The initial seed data is embedded in the migrations:

- `004_create_engine_registry.sql` — seeds the engine_registry with 5 engines (1 enabled, 4 disabled)
- `005_create_site_connectors.sql` — seeds site_clients with 3 inactive sites

No separate seed file is required. Run the migrations in order.
