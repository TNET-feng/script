// ==UserScript==

// @name         移动端网页调试控制台(Eruda)

// @namespace    http://tampermonkey.net/

// @version      1.3

// @description  在移动端网页上注入Eruda控制台

// @author       TNET-feng

// @match        *://*/*

// @match        edge://newtab/*

// @match        edge://startpage/*

// @match        about:blank

// @match        about:home

// @match        about:newtab

// @match        *://cn.bing.com/*

// @match        *://*.bing.com/*

// @match        *://bing.com/*

// @match        */*

// @match        edge://*/*

// @match        chrome://*/*

// @match        about:*

// @match        file:///*

// @match        data:*

// @match        blob:*

// @match        javascript:*

// @match        *://*.github.com/*

// @include      *

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




            var style = document.createElement('style');

            style.textContent = `

                .eruda-container {

                    z-index: 2147483647 !important; /* 最大z-index值 */

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
