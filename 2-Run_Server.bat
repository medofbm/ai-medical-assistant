@echo off
color 0A
echo =========================================
echo   Starting MediAssist AI Server...
echo   Ready for Presentation!
echo =========================================
echo.
echo Server is running at: http://127.0.0.1:8000
echo Do not close this window during the presentation.
echo.
php artisan serve
pause
