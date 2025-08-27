// ==UserScript==
// @name         网站路径扫描器
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  扫描当前所在路径下的子路径，智能分析结果，支持实时刷新。
// @author       TNET-feng
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict'
    const pathDictionary = [
        "", "index", "home", "main", "default", "start", "welcome", "dashboard", "console", "panel",
        "portal", "gateway", "entry", "access", "gate", "door", "front", "frontend", "backend", "base",
        "admin", "administrator", "admin/login", "admincp", "admin_area", "manage", "control", "superadmin", 
        "sysadmin", "webadmin", "admin/admin", "admin/account", "admin_area/login", "admin_area/admin", 
        "admin/home", "admin/dashboard", "admin/console", "admin/control", "admin/panel", "admin/config",
        "admin/settings", "admin/system", "admin/tools", "admin/management", "admin/security", "admin/users",
        "admin/permissions", "admin/roles", "admin/logs", "admin/backup",
        "login", "signin", "sign-in", "log-in", "auth", "authentication", "authenticate", "signup", "register",
        "registration", "logout", "signout", "password", "passwd", "forgot-password", "reset-password",
        "change-password", "recover", "security", "oauth", "oauth2", "sso", "cas", "saml", "openid",
        "token", "access-token", "refresh-token", "authorize", "authorization", "identity",
        "user", "users", "member", "members", "profile", "profiles", "account", "accounts", "myaccount",
        "user/profile", "user/account", "user/settings", "user/preferences", "user/dashboard", "user/home",
        "client", "clients", "customer", "customers", "guest", "guests", "visitor", "visitors", "person",
        "people", "staff", "employee", "employees", "team", "teams",
        "file", "files", "upload", "uploads", "download", "downloads", "document", "documents", "doc", "docs",
        "attachment", "attachments", "resource", "resources", "asset", "assets", "media", "image", "images",
        "img", "picture", "pictures", "photo", "photos", "video", "videos", "audio", "audios", "archive",
        "archives", "backup", "backups", "storage", "store", "repository", "repo", "data", "dataset", "datasets",
        "config", "configuration", "conf", "settings", "setting", "options", "option", "preferences", "preference",
        "setup", "install", "installation", "uninstall", "deploy", "deployment", "env", "environment", "property",
        "properties", "parameter", "parameters", "variable", "variables", "init", "initialize", "initialization",
        "configure", "customize", "customization",
        "db", "database", "databases", "sql", "mysql", "postgres", "oracle", "mongo", "mongodb", "redis",
        "memcached", "dba", "database/admin", "db/admin", "db/backup", "database/backup", "db/export",
        "database/export", "db/import", "database/import", "db/maintenance", "database/maintenance",
        "db/query", "database/query", "db/status", "database/status", "db/info", "database/info",
        "db/connect", "database/connect",
        "log", "logs", "logging", "logger", "error", "errors", "access", "debug", "debugging", "trace", "tracing",
        "audit", "auditing", "monitor", "monitoring", "status", "health", "healthcheck", "metrics", "stat",
        "stats", "statistics", "performance", "perf", "report", "reports", "reporting", "analytics", "analysis",
        "analyze",
        "api", "api/v1", "api/v2", "api/v3", "api/v4", "api/v5", "rest", "restful", "graphql", "graphiql",
        "soap", "xml", "json", "rpc", "endpoint", "endpoints", "interface", "interfaces", "webhook", "webhooks",
        "callback", "callbacks", "service", "services", "microservice", "microservices", "gateway", "api-gateway",
        "proxy", "api-proxy",
        "dev", "development", "develop", "developer", "developers", "test", "testing", "testers", "qa", "quality",
        "stage", "staging", "preprod", "pre-production", "prod", "production", "live", "beta", "alpha", "demo",
        "sandbox", "playground", "experiment", "experimental", "lab", "labs", "research", "development/tools",
        "debugger", "inspector",
        "git", "svn", "hg", "mercurial", "cvs", "version", "versions", "versioning", "branch", "branches",
        "tag", "tags", "commit", "commits", "history", "revision", "revisions", "code", "source", "sourcecode",
        "repository", "repositories", "pull", "push", "merge", "conflict", "checkout", "clone", "fork", "blame",
        "system", "systems", "sys", "server", "servers", "host", "hosts", "node", "nodes", "cluster", "clusters",
        "loadbalancer", "loadbalancing", "proxy", "proxies", "gateway", "gateways", "firewall", "firewalls",
        "security", "secure", "protection", "defense", "shield", "guard", "permission", "permissions",
        "authorization", "authorisation", "authentication", "auth", "identity", "identities",
        "content", "contents", "cms", "article", "articles", "post", "posts", "blog", "blogs", "news", "newses",
        "story", "stories", "page", "pages", "documentation", "docs", "help", "helps", "support", "supports",
        "faq", "faqs", "question", "questions", "answer", "answers", "knowledgebase", "kb", "manual", "manuals",
        "guide", "guides", "tutorial", "tutorials", "howto", "how-to", "example", "examples", "sample", "samples",
        "shop", "shops", "store", "stores", "market", "markets", "mall", "malls", "product", "products", "item",
        "items", "goods", "catalog", "catalogue", "catalogs", "catalogues", "category", "categories", "brand",
        "brands", "cart", "carts", "basket", "baskets", "checkout", "payment", "payments", "order", "orders",
        "purchase", "purchases", "invoice", "invoices", "receipt", "receipts", "shipping", "delivery", "billing",
        "bill", "invoice",
        "social", "socials", "community", "communities", "forum", "forums", "discussion", "discussions", "talk",
        "talks", "chat", "chats", "message", "messages", "comment", "comments", "review", "reviews", "rating",
        "ratings", "like", "likes", "favorite", "favorites", "favourite", "favourites", "follow", "follows",
        "friend", "friends", "connection", "connections", "network", "networks", "group", "groups", "team", "teams",
        "search", "searches", "find", "finds", "lookup", "query", "queries", "filter", "filters", "sort", "sorts",
        "discover", "explore", "browse", "browsing", "navigate", "navigation", "sitemap", "sitemaps", "indexes",
        "tool", "tools", "utility", "utilities", "util", "utils", "function", "functions", "feature", "features",
        "module", "modules", "component", "components", "plugin", "plugins", "extension", "extensions",
        "addon", "addons", "widget", "widgets", "block", "blocks", "element", "elements", "package", "packages",
        "library", "libraries",
        "static", "statics", "public", "publics", "shared", "share", "common", "commons", "global", "globals",
        "lib", "libs", "library", "libraries", "framework", "frameworks", "package", "packages", "vendor",
        "vendors", "thirdparty", "third-party", "external", "externals",
        "tmp", "temp", "temporary", "cache", "caches", "caching", "session", "sessions", "cookie", "cookies",
        "token", "tokens", "tempory", "transient", "volatile", "swap", "swapping", "buffer", "buffers", "memory",
        ".git", ".svn", ".hg", ".DS_Store", ".htaccess", ".htpasswd", ".env", ".config", ".settings", ".idea",
        ".vscode", ".well-known", ".ssh", ".cache", ".local", ".tmp", ".temp", ".log", ".logs", ".backup",
        ".backups", ".old", ".new", ".orig", ".bak", ".save", ".sav", ".tmp", ".temp", ".swp", ".swo",
        "robots.txt", "sitemap.xml", "sitemap_index.xml", "crossdomain.xml", "favicon.ico", "humans.txt", 
        "security.txt", "manifest.json", "package.json", "composer.json", "composer.lock", "yarn.lock",
        "package-lock.json", "webpack.config.js", "tsconfig.json", ".gitignore", ".gitattributes", ".editorconfig",
        ".eslintrc", ".prettierrc", ".babelrc", ".npmrc", ".yarnrc", ".dockerignore", ".env.example",
        ".env.local", ".env.production", ".env.development", ".env.test",
        "bin", "sbin", "usr", "etc", "var", "opt", "lib", "lib64", "sys", "proc", "dev", "mnt", "media", "root",
        "home", "boot", "efi", "tmp", "var/log", "var/www", "var/html", "var/lib", "var/tmp", "opt/app",
        "opt/software", "usr/bin", "usr/sbin", "usr/lib", "usr/local", "usr/share", "usr/src",
        "cgi-bin", "cgi", "fcgi", "php", "php5", "php7", "php8", "pl", "py", "rb", "jsp", "asp", "aspx",
        "do", "action", "servlet", "webapp", "webapps", "app", "apps", "application", "applications",
        "web", "webs", "site", "sites", "portal", "portals", "platform", "platforms",
        "wp-admin", "wp-login.php", "wp-content", "wp-includes", "administrator", "manager", "management",
        "console", "controlpanel", "cp", "dashboard", "monitor", "supervisor", "operator", "maintenance",
        "sysop", "root", "superuser", "webmaster", "operator", "maintainer"
    ];
    const errorKeywords = [
        'not found', '404', 'doesn\'t exist', 'page cannot be found', 'page not found',
        'error', '找不到', '页面不存在', '無法找到', '404 error', '未找到'
    ];
    const loginKeywords = [
        'login', 'sign in', 'username', 'password', 'log in', 'signin', 'authenticate',
        '登录', '帳號', '密码', '密碼', '登陆', '账号'
    ];

    let isScanning = false;
    let scannedCount = 0;
    let foundPaths = [];
    let currentTimeoutIds = [];
    let isUIVisible = true;
    GM_addStyle(`
        #path-scanner-ui {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border: 2px solid #007bff;
            border-radius: 8px;
            z-index: 10000;
            width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            font-size: 12px;
            transition: all 0.3s ease;
        }
        #path-scanner-ui.hidden {
            transform: translateX(100%);
            opacity: 0;
            pointer-events: none;
        }
        #scanner-toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        #path-scanner-ui h3 {
            margin: 0 0 10px 0;
            color: #007bff;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        #scan-controls {
            margin-bottom: 15px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .control-group {
            display: flex;
            gap: 5px;
            flex: 1;
        }
        #scan-button {
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            flex: 1;
        }
        #scan-button:disabled {
            background: #6c757d;
            cursor: not-allowed;
        }
        #stop-button {
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            flex: 1;
        }
        #stop-button:disabled {
            background: #6c757d;
            cursor: not-allowed;
        }
        #refresh-target {
            background: #28a745;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
        }
        #hide-scanner {
            background: #6c757d;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
        }
        #scan-progress {
            margin: 10px 0;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
            font-size: 11px;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            margin-top: 5px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #28a745;
            transition: width 0.3s ease;
            width: 0%;
        }
        #scan-results {
            border-top: 1px solid #eee;
            padding-top: 10px;
            max-height: 300px;
            overflow-y: auto;
        }
        .result-item {
            margin: 5px 0;
            padding: 8px;
            border-left: 4px solid #28a745;
            background: #f8f9fa;
            font-size: 11px;
            word-break: break-all;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .result-item:hover {
            background: #e9ecef;
        }
        .result-item.error {
            border-left-color: #dc3545;
        }
        .result-item.warning {
            border-left-color: #ffc107;
        }
        .result-item.info {
            border-left-color: #17a2b8;
        }
        .result-item.redirect {
            border-left-color: #6f42c1;
        }
        .result-status {
            font-weight: bold;
            margin-bottom: 3px;
        }
        .result-url {
            color: #0056b3;
            text-decoration: none;
        }
        .result-url:hover {
            text-decoration: underline;
        }
        .stats {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 11px;
            color: #666;
            flex-wrap: wrap;
            gap: 5px;
        }
        .stat-item {
            display: flex;
            align-items: center;
            gap: 3px;
        }
        .stat-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
        }
        .stat-success { background: #28a745; }
        .stat-warning { background: #ffc107; }
        .stat-error { background: #dc3545; }
        .stat-info { background: #17a2b8; }
        .stat-redirect { background: #6f42c1; }
        .current-url {
            margin: 5px 0;
            padding: 5px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 3px;
            font-size: 11px;
            word-break: break-all;
        }
        .path-info {
            margin: 5px 0;
            font-size: 11px;
            color: #666;
        }
        .total-paths {
            margin: 5px 0;
            font-size: 11px;
            color: #007bff;
            font-weight: bold;
        }
    `);

    function getCurrentBasePath() {
        const currentUrl = new URL(window.location.href);
        return currentUrl.origin + currentUrl.pathname;
    }

    function createScannerUI() {
        const existingUI = document.getElementById('path-scanner-ui');
        const existingToggle = document.getElementById('scanner-toggle-btn');
        if (existingUI) existingUI.remove();
        if (existingToggle) existingToggle.remove();

        const currentPath = getCurrentBasePath();

        const scannerUI = document.createElement('div');
        scannerUI.id = 'path-scanner-ui';
        scannerUI.innerHTML = `
            <h3>
                🛠️ 路径扫描器 (当前路径)
                <button id="hide-scanner">隐藏</button>
            </h3>
            <div class="current-url" id="current-url-display">扫描路径: <strong>${currentPath}/</strong></div>
            <div class="total-paths">路径字典: ${pathDictionary.length} 个路径</div>
            <div class="path-info">正在扫描当前路径下的子路径和文件</div>
            <div id="scan-controls">
                <div class="control-group">
                    <button id="scan-button">开始扫描</button>
                    <button id="stop-button" disabled>停止</button>
                </div>
                <div class="control-group">
                    <button id="refresh-target" title="刷新目标路径">🔄 刷新</button>
                </div>
            </div>
            <div id="scan-progress">
                <div>就绪 - 共 ${pathDictionary.length} 个路径待扫描</div>
                <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
            </div>
            <div class="stats">
                <div class="stat-item"><span class="stat-dot stat-success"></span> 真实页面: 0</div>
                <div class="stat-item"><span class="stat-dot stat-warning"></span> 虚拟路径: 0</div>
                <div class="stat-item"><span class="stat-dot stat-info"></span> 需要登录: 0</div>
                <div class="stat-item"><span class="stat-dot stat-error"></span> 无权限: 0</div>
                <div class="stat-item"><span class="stat-dot stat-redirect"></span> 重定向: 0</div>
            </div>
            <div id="scan-results">
                <strong>扫描结果 (点击路径可访问):</strong>
                <div id="results-container"></div>
            </div>
        `;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'scanner-toggle-btn';
        toggleBtn.innerHTML = '🔍';
        toggleBtn.title = '显示/隐藏扫描器';

        document.body.appendChild(scannerUI);
        document.body.appendChild(toggleBtn);
        document.getElementById('scan-button').addEventListener('click', startScan);
        document.getElementById('stop-button').addEventListener('click', stopScan);
        document.getElementById('hide-scanner').addEventListener('click', hideScanner);
        document.getElementById('refresh-target').addEventListener('click', refreshTarget);
        toggleBtn.addEventListener('click', toggleScannerUI);
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                updateCurrentPathDisplay();
            }
        }).observe(document, {subtree: true, childList: true});
    }

    function updateCurrentPathDisplay() {
        const currentPath = getCurrentBasePath();
        document.getElementById('current-url-display').innerHTML = `扫描路径: <strong>${currentPath}/</strong>`;
    }

    function refreshTarget() {
        if (isScanning) {
            if (confirm('扫描正在进行中，确定要停止并刷新吗？')) {
                stopScan();
            } else {
                return;
            }
        }
        
        isScanning = false;
        scannedCount = 0;
        foundPaths = [];
        currentTimeoutIds.forEach(id => clearTimeout(id));
        currentTimeoutIds = [];
        
        updateCurrentPathDisplay();
        document.getElementById('results-container').innerHTML = '';
        document.getElementById('scan-button').disabled = false;
        document.getElementById('stop-button').disabled = true;
        updateProgressBar(0);
        updateProgress(`已刷新 - 共 ${pathDictionary.length} 个路径待扫描`, 0);
        updateStats();
        
        GM_notification({
            text: `已刷新目标路径，扫描结果已重置`,
            title: '路径扫描器',
            timeout: 2000
        });
    }

    function hideScanner() {
        const scannerUI = document.getElementById('path-scanner-ui');
        scannerUI.classList.add('hidden');
        isUIVisible = false;
    }

    function toggleScannerUI() {
        const scannerUI = document.getElementById('path-scanner-ui');
        isUIVisible = !isUIVisible;
        if (isUIVisible) {
            scannerUI.classList.remove('hidden');
        } else {
            scannerUI.classList.add('hidden');
        }
    }

    function startScan() {
        if (isScanning) return;

        isScanning = true;
        scannedCount = 0;
        foundPaths = [];
        currentTimeoutIds = [];
        document.getElementById('results-container').innerHTML = '';
        document.getElementById('scan-button').disabled = true;
        document.getElementById('stop-button').disabled = false;
        updateProgressBar(0);

        const currentPath = getCurrentBasePath();
        updateProgress(`开始扫描: ${currentPath}/`, 0);

        pathDictionary.forEach((path, index) => {
            const timeoutId = setTimeout(() => {
                if (!isScanning) return;

                let testUrl = '';
                if (path === '') {
                    testUrl = currentPath;
                } else if (currentPath.endsWith('/')) {
                    testUrl = `${currentPath}${path}`;
                } else {
                    testUrl = `${currentPath}/${path}`;
                }
                
                scanSinglePath(testUrl, path);
            }, index * 80);

            currentTimeoutIds.push(timeoutId);
        });
    }

    function stopScan() {
        isScanning = false;
        currentTimeoutIds.forEach(id => clearTimeout(id));
        currentTimeoutIds = [];
        
        document.getElementById('scan-button').disabled = false;
        document.getElementById('stop-button').disabled = true;
        updateProgress(`扫描已停止 - 已完成 ${scannedCount}/${pathDictionary.length}`, scannedCount);
        updateStats();
    }

    function scanSinglePath(url, path) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 8000,
            onload: function(response) {
                if (!isScanning) return;
                
                scannedCount++;
                let resultType = '';
                let reason = '';
                let statusEmoji = '';

                const responseText = response.responseText.toLowerCase();
                const isErrorPage = errorKeywords.some(keyword => responseText.includes(keyword));
                const isLoginPage = loginKeywords.some(keyword => responseText.includes(keyword));

                if (response.status === 200) {
                    if (isErrorPage) {
                        resultType = 'warning';
                        reason = '可能是虚拟路径 (SPA 404页)';
                        statusEmoji = '⚠️';
                    } else if (isLoginPage) {
                        resultType = 'info';
                        reason = '需要登录';
                        statusEmoji = '🔐';
                    } else {
                        resultType = 'success';
                        reason = '真实页面';
                        statusEmoji = '✅';
                    }
                    foundPaths.push({url: url, status: response.status, type: resultType, reason: reason});
                    addResult(url, response.status, resultType, reason, statusEmoji);

                } else if (response.status === 403 || response.status === 401) {
                    resultType = 'error';
                    reason = '无权限访问';
                    statusEmoji = '🚫';
                    foundPaths.push({url: url, status: response.status, type: resultType, reason: reason});
                    addResult(url, response.status, resultType, reason, statusEmoji);

                } else if (response.status === 301 || response.status === 302) {
                    resultType = 'redirect';
                    reason = '重定向';
                    statusEmoji = '↪️';
                    foundPaths.push({url: url, status: response.status, type: resultType, reason: reason});
                    addResult(url, response.status, resultType, reason, statusEmoji);
                }

                const progress = (scannedCount / pathDictionary.length) * 100;
                updateProgress(`扫描中... ${scannedCount}/${pathDictionary.length} - 找到 ${foundPaths.length} 个路径`, progress);
                updateStats();

                if (scannedCount === pathDictionary.length) {
                    finishScan();
                }
            },
            onerror: function(error) {
                if (!isScanning) return;
                scannedCount++;
                const progress = (scannedCount / pathDictionary.length) * 100;
                updateProgress(`扫描中... ${scannedCount}/${pathDictionary.length} - 找到 ${foundPaths.length} 个路径`, progress);
                if (scannedCount === pathDictionary.length) {
                    finishScan();
                }
            },
            ontimeout: function() {
                if (!isScanning) return;
                scannedCount++;
                const progress = (scannedCount / pathDictionary.length) * 100;
                updateProgress(`扫描中... ${scannedCount}/${pathDictionary.length} - 找到 ${foundPaths.length} 个路径`, progress);
                if (scannedCount === pathDictionary.length) {
                    finishScan();
                }
            }
        });
    }

    function addResult(url, status, type, reason, emoji) {
        const resultsContainer = document.getElementById('results-container');
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${type}`;
        resultItem.innerHTML = `
            <div class="result-status">${emoji} [${status}] ${reason}</div>
            <div class="result-url">${url}</div>
        `;
        
        resultItem.addEventListener('click', function(e) {
            if (e.target.tagName !== 'A') {
                window.open(url, '_blank');
            }
        });
        
        resultsContainer.appendChild(resultItem);
        resultsContainer.scrollTop = resultsContainer.scrollHeight;
    }

    function updateProgress(message, progress) {
        const progressElement = document.getElementById('scan-progress').firstChild;
        if (progressElement) {
            progressElement.textContent = message;
        }
        updateProgressBar(progress);
    }

    function updateProgressBar(progress) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
    }

    function updateStats() {
        const stats = {
            success: foundPaths.filter(p => p.type === 'success').length,
            warning: foundPaths.filter(p => p.type === 'warning').length,
            info: foundPaths.filter(p => p.type === 'info').length,
            error: foundPaths.filter(p => p.type === 'error').length,
            redirect: foundPaths.filter(p => p.type === 'redirect').length
        };

        const statElements = document.querySelectorAll('.stat-item');
        if (statElements.length >= 5) {
            statElements[0].innerHTML = `<span class="stat-dot stat-success"></span> 真实页面: ${stats.success}`;
            statElements[1].innerHTML = `<span class="stat-dot stat-warning"></span> 虚拟路径: ${stats.warning}`;
            statElements[2].innerHTML = `<span class="stat-dot stat-info"></span> 需要登录: ${stats.info}`;
            statElements[3].innerHTML = `<span class="stat-dot stat-error"></span> 无权限: ${stats.error}`;
            statElements[4].innerHTML = `<span class="stat-dot stat-redirect"></span> 重定向: ${stats.redirect}`;
        }
    }

    function finishScan() {
        isScanning = false;
        document.getElementById('scan-button').disabled = false;
        document.getElementById('stop-button').disabled = true;
        updateProgress(`扫描完成! 共找到 ${foundPaths.length} 个有效路径`, 100);
        
        if (foundPaths.length > 0) {
            GM_notification({
                text: `扫描完成！找到 ${foundPaths.length} 个路径`,
                title: '路径扫描器',
                timeout: 3000
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createScannerUI);
    } else {
        createScannerUI();
    }
})();
