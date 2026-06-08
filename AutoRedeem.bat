@echo off
setlocal
:: [QUAN TRONG] Chuyen ve thu muc chua file .bat (fix loi khi double-click)
cd /d "%~dp0"

title Delta Force Auto Redeem Tool
echo ==========================================
echo    DELTA FORCE AUTO REDEEM TOOL
echo ==========================================
echo.

:: -----------------------------------------------
:: BUOC 1: Kiem tra Node.js
:: -----------------------------------------------
set "NODE_EXE=node"
set "NPM_CMD=npm"

where node >nul 2>nul
if %errorlevel% neq 0 (
    if exist "bin\node.exe" (
        set "NODE_EXE=%~dp0bin\node.exe"
        set "NPM_CMD=%~dp0bin\npm.cmd"
        echo [OK] Dung Node.js portable tai: bin\node.exe
    ) else (
        echo [!] Khong tim thay Node.js. Dang tu dong tai ban Portable...
        echo [!] Vui long cho trong giay lat (khoang 30MB)...

        powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $url = 'https://nodejs.org/dist/v20.12.2/node-v20.12.2-win-x64.zip'; $zip = '%~dp0node.zip'; Invoke-WebRequest -Uri $url -OutFile $zip; Expand-Archive -Path $zip -DestinationPath '%~dp0temp_node'; Move-Item -Path '%~dp0temp_node\node-v20.12.2-win-x64\*' -Destination '%~dp0'; Remove-Item -Recurse -Force '%~dp0temp_node', $zip; if (!(Test-Path '%~dp0bin')) { New-Item -ItemType Directory -Path '%~dp0bin' }; Move-Item -Force -Path '%~dp0node.exe' -Destination '%~dp0bin\node.exe' }"

        if exist "bin\node.exe" (
            set "NODE_EXE=%~dp0bin\node.exe"
            set "NPM_CMD=%~dp0bin\npm.cmd"
            echo [OK] Tai Node.js thanh cong!
        ) else (
            echo [LOI] Khong the tai Node.js. Vui long cai Node.js tu: https://nodejs.org
            pause
            exit /b 1
        )
    )
) else (
    echo [OK] Da tim thay Node.js:
    node -v
)

:: -----------------------------------------------
:: BUOC 2: Cai dat thu vien npm neu chua co
:: -----------------------------------------------
if not exist "node_modules\playwright" (
    echo.
    echo [!] Dang cai dat Playwright...
    "%NPM_CMD%" install
    if %errorlevel% neq 0 (
        echo [LOI] npm install that bai!
        pause
        exit /b 1
    )
)

:: -----------------------------------------------
:: BUOC 3: Cai dat Playwright browser (msedge) neu chua co
:: -----------------------------------------------
if not exist "%LOCALAPPDATA%\ms-playwright" (
    echo.
    echo [!] Dang cai dat Playwright browser (lan dau chay, can vai phut)...
    "%NODE_EXE%" "%~dp0node_modules\.bin\playwright" install msedge
    if %errorlevel% neq 0 (
        :: Thu cach khac
        npx playwright install msedge
    )
) else (
    echo [OK] Playwright browser da san sang.
)

:: -----------------------------------------------
:: BUOC 4: Chay script chinh
:: -----------------------------------------------
echo.
echo [!] Dang khoi dong tool...
echo.
"%NODE_EXE%" "%~dp0redeem.js"

echo.
echo ==========================================
echo    HOAN THANH!
echo ==========================================
pause
