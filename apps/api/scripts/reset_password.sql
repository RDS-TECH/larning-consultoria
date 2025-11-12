-- Script SQL para resetar senha do admin
-- Senha: Admin123 (você pode trocar depois de logar)
-- Hash gerado com pbkdf2_sha256

UPDATE users
SET password = '$pbkdf2-sha256$29000$xBmtr7n3TzCgWRE2BW4AoA==$1bW7lboRSujT65CpMA3YPprnDKxjVDNOgqLyW2UwLQw='
WHERE email = 'admin@school.dev';

-- Verificar se atualizou
SELECT username, email, created_at
FROM users
WHERE email = 'admin@school.dev';

-- ✅ SENHA TEMPORÁRIA: Admin123
-- ⚠️ LEMBRE-SE DE TROCAR APÓS LOGIN!
