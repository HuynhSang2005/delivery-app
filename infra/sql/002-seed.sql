INSERT INTO foundation.demo_accounts (id, role, display_name)
VALUES
  ('user_demo', 'user', 'Demo User'),
  ('driver_demo', 'driver', 'Demo Driver'),
  ('admin_demo', 'admin', 'Demo Admin')
ON CONFLICT (id) DO UPDATE
SET
  role = EXCLUDED.role,
  display_name = EXCLUDED.display_name;
