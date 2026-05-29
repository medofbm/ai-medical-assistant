<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| All web requests are served by the SPA Blade template. Vue Router handles
| client-side routing. This catch-all must be last.
|
*/

Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
