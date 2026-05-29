<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="AI Medical Assistant — Your virtual general practitioner powered by Gemini AI">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#020617">

    <title>AI Medical Assistant — MediAssist</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="antialiased h-full overflow-hidden bg-slate-950">
    <div id="app" class="h-full"></div>
</body>
</html>
