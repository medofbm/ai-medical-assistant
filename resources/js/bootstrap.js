/**
 * Bootstrap the application.
 * This file sets up global axios defaults (CSRF header, etc.)
 */
import axios from 'axios';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
