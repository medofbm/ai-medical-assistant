<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="المساعد الذكي — مساعدك الطبي المدعوم بالذكاء الاصطناعي | Smart Assistant — Your AI-powered medical companion">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#0d9488">

    <title>المساعد الذكي — Smart Assistant</title>

    <!-- SVG Favicon — inline data URI, no file needed -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%230d9488'/><stop offset='60%25' stop-color='%230891b2'/><stop offset='100%25' stop-color='%232563eb'/></linearGradient></defs><rect width='32' height='32' rx='8' fill='url(%23g)'/><path d='M3 16h5l2.5-5 3 10 2.5-8 2 4H29' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' fill='none'/><path d='M16 8v5M13.5 10.5h5' stroke='white' stroke-width='2.5' stroke-linecap='round'/></svg>">

    <!-- Apple touch icon -->
    <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%230d9488'/><stop offset='100%25' stop-color='%232563eb'/></linearGradient></defs><rect width='180' height='180' rx='40' fill='url(%23g)'/><path d='M20 90h30l14-28 17 56 14-45 11 22H160' stroke='rgba(255,255,255,0.5)' stroke-width='11' stroke-linecap='round' stroke-linejoin='round' fill='none'/><path d='M90 45v28M76 59h28' stroke='white' stroke-width='14' stroke-linecap='round'/></svg>">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="antialiased h-full overflow-hidden bg-slate-950">
    <div id="app" class="h-full"></div>
</body>
</html>
