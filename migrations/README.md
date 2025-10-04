# Database Migrations

This directory contains SQL migration files for the Allumino database.

## How Migrations Work

We use **Prisma Migrate** to manage PostgreSQL schema changes.

### Creating a Migration

When you modify `prisma/schema.prisma`, create a migration:

```bash
npm run prisma:migrate
```

This will:
1. Prompt you for a migration name
2. Generate SQL migration files in `prisma/migrations/`
3. Apply the migration to your database
4. Update Prisma Client

### Applying Migrations (Production)

In production (Railway/Vercel):

```bash
npm run prisma:migrate:deploy
```

This applies all pending migrations without prompting.

## Migration Files Location

Actual migration files are in `prisma/migrations/` directory, not here.

This directory (`migrations/`) is reserved for custom SQL scripts if needed.

## MongoDB Migrations

MongoDB is schema-less, so migrations are handled differently:

- **Mongoose schemas** define structure but don't enforce it
- **Index creation** happens automatically when models load
- **Data migrations** can be written as scripts in `scripts/` folder

## Best Practices

1. **Always review** generated SQL before committing
2. **Test migrations** on a copy of production data
3. **Keep migrations small** - one logical change per migration
4. **Never edit** old migrations - create new ones instead
5. **Backup database** before running migrations in production

## Common Commands

```bash
# Create and apply migration (dev)
npm run prisma:migrate

# Apply migrations (production)
npm run prisma:migrate:deploy

# Reset database (dev only - destructive!)
npx prisma migrate reset

# View migration status
npx prisma migrate status

# Generate Prisma Client after migration
npm run prisma:generate
```

## Migration Workflow

### Development

1. Modify `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Name your migration (e.g., "add-user-roles")
4. Verify changes in `prisma/migrations/`
5. Test your application
6. Commit migration files to Git

### Production

1. Pull latest code (includes new migrations)
2. Run `npm run prisma:migrate:deploy`
3. Restart application
4. Verify health check

## Troubleshooting

### Migration conflicts

If multiple developers create migrations:

```bash
# Pull latest changes
git pull

# Apply all migrations
npm run prisma:migrate:deploy

# Generate client
npm run prisma:generate
```

### Reset development database

```bash
# Warning: This deletes all data!
npx prisma migrate reset
npm run db:seed
```

### View migration history

```bash
npx prisma migrate status
```

## Custom SQL Migrations

If you need to run custom SQL (data migrations, complex schema changes):

1. Create a `.sql` file in this directory
2. Document what it does
3. Run it manually or via a script

Example:

```sql
-- migrations/2025-01-15-add-admin-role.sql
UPDATE users
SET roles = array_append(roles, 'admin')
WHERE email = 'admin@allumino.com';
```

Run it:

```bash
psql $DATABASE_URL_POSTGRES < migrations/2025-01-15-add-admin-role.sql
```

---

For more information, see the [Prisma Migrate documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate).
