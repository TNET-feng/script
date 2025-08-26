// ==UserScript==
// @name         移动端网页调试控制台(Eruda)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  
// @author       TNET-feng
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (window.eruda || document.getElementById('eruda-script')) {
        return;
    }

    var script = document.createElement('script');
    script.id = 'eruda-script';
    script.src = 'https://cdn.jsdelivr.net/npm/eruda';
    
    script.onload = function() {
        if (typeof eruda !== 'undefined') {
            eruda.init();
            console.log('Eruda is running!');
        }
    };
    
    document.body.appendChild(script);

})();
