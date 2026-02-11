USE parkir_app;

-- Update all users with correct bcrypt hash for 'password123'
UPDATE users SET password = '$2a$10$7xX5N2L9JLOUQDzz9G.hRecINaUOqJ/Rinvknr70vYFQVTFx6NjFm';

SELECT 'Passwords updated successfully!' as status;
SELECT username, LEFT(password, 20) as password_preview FROM users;
