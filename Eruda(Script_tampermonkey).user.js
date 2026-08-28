// ==UserScript==
// @name         Eruda
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Eruda
// @author       FengPwner
// @match        *://*/*
// @match        */*
// @match        file:///*
// @match        data:*
// @include      *
// @grant        none
// @run-at       document-start
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
            var style = document.createElement('style');
            style.textContent = `
                .eruda-container {
                    z-index: 2147483647 !important;
                    position: fixed !important;
                }
                .eruda-dev-tools {
                    z-index: 2147483646 !important;
                }
                .eruda-entry-btn {
                    z-index: 2147483647 !important;
                    position: fixed !important;
                }
            `;
            document.head.appendChild(style);
            console.log('Eruda is running!');
        }
    };
    document.body.appendChild(script);
})();
