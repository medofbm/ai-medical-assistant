@echo off
color 0B
echo =========================================
echo   Initializing MediAssist AI Setup...
echo =========================================
echo.

echo [1/4] Copying environment configuration...
if not exist .env (
    copy .env.example .env
    echo       .env file created from .env.example.
) else (
    echo       .env file already exists, skipping.
)
echo.

echo [2/4] Installing PHP Dependencies...
call composer install --optimize-autoloader --no-dev
echo.

echo [3/4] Generating Application Key...
call php artisan key:generate --force
echo.

echo [4/4] Running Database Migrations...
call php artisan migrate:fresh --force
echo.

echo =========================================
echo   Setup Complete!
echo   Run "2-Run_Server.bat" to start.
echo =========================================
echo.
pause
