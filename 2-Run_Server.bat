@echo off
color 0A
echo =========================================
echo   Starting Smart Assistant Server...
echo   Ready for Presentation!
echo =========================================
echo.
echo Server is running at: http://127.0.0.1:8000
echo Open your browser and go to: http://127.0.0.1:8000
echo.
echo [!] Do NOT close this window during the presentation.
echo.
php artisan serve
pause
