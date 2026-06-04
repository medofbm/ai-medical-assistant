@echo off
color 0B
echo =========================================
echo   Initializing Smart Assistant Setup...
echo =========================================
echo.

echo [1/5] Copying environment configuration...
if not exist .env (
    copy .env.example .env
    echo       .env file created from .env.example.
) else (
    echo       .env file already exists, skipping.
)
echo.

echo [2/5] Clearing old caches...
call php artisan optimize:clear
echo.


echo [3/5] Generating Application Key...
call php artisan key:generate --force
echo.

echo [4/5] Setting up SQLite Database...
if not exist database\database.sqlite (
    type nul > database\database.sqlite
    echo       database.sqlite created.
) else (
    echo       database.sqlite already exists, skipping.
)
call php artisan migrate --force
echo.

echo [5/5] Optimizing Application Cache...
call php artisan config:cache
call php artisan route:cache
call php artisan view:cache
echo.

echo =========================================
echo   Setup Complete!
echo   Run "2-Run_Server.bat" to start.
echo =========================================
echo.
pause
