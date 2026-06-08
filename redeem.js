const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

async function run() {
    const startTime = Date.now();
    const codesPath = path.join(__dirname, 'codes.txt');
    if (!fs.existsSync(codesPath)) {
        console.error('Không tìm thấy file codes.txt!');
        return;
    }

    const rawCodes = fs.readFileSync(codesPath, 'utf-8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('//'));

    // Loai bo code trung lap
    const codes = [...new Set(rawCodes)];
    const dupCount = rawCodes.length - codes.length;

    if (codes.length === 0) {
        console.error('File codes.txt trống! Vui lòng dán code vào file.');
        return;
    }

    console.log(`Đã tìm thấy ${codes.length} mã hợp lệ.${dupCount > 0 ? ` (Đã bỏ qua ${dupCount} mã trùng lặp)` : ''}`);

    // Tự động chọn trình duyệt: Edge → Chrome → Chromium built-in
    let browser;
    const launchOptions = {
        headless: false,
        ignoreDefaultArgs: ['--enable-automation']
    };

    const browserCandidates = [
        { channel: 'msedge', name: 'Microsoft Edge' },
        { channel: 'chrome', name: 'Google Chrome' },
        { channel: null,     name: 'Chromium (built-in)' },
    ];

    for (const candidate of browserCandidates) {
        try {
            const opts = candidate.channel
                ? { ...launchOptions, channel: candidate.channel }
                : { ...launchOptions };
            browser = await chromium.launch(opts);
            console.log(`[OK] Dang dung trinh duyet: ${candidate.name}`);
            break;
        } catch (e) {
            console.log(`[!] Khong tim thay ${candidate.name}, thu trinh duyet khac...`);
        }
    }

    if (!browser) {
        console.error('[LOI] Khong tim thay trinh duyet nao! Vui long cai Edge hoac Chrome.');
        return;
    }

    // Tạo context với User Agent giống người dùng thật và vô hiệu hóa webdriver flag
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
        viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();

    // Ẩn biến navigator.webdriver
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
        });
    });

    // URL trang đổi quà (lấy từ thông tin bạn cung cấp)
    const redeemUrl = 'https://redeem.df.garena.sg/vi/cdkgarena.html';
    
    console.log('Đang mở trang đổi quà...');
    await page.goto(redeemUrl);

    console.log('--------------------------------------------------');
    console.log('BƯỚC 1: Vui lòng đăng nhập Garena trên trình duyệt.');
    console.log('BƯỚC 2: Sau khi đăng nhập xong và thấy ô nhập code, quay lại đây.');
    console.log('--------------------------------------------------');
    
    await askQuestion('Sau khi đã đăng nhập xong, nhấn Enter để bắt đầu auto nhập code...');

    for (let i = 0; i < codes.length; i++) {
        const code = codes[i];
        console.log(`[${i + 1}/${codes.length}] Đang nhập mã: ${code}`);

        try {
            // Chờ ô nhập code xuất hiện
            const inputSelector = 'input.spr.exc-input';
            const btnSelector = 'a.spr.btn-exchange';

            await page.waitForSelector(inputSelector, { timeout: 10000 });
            
            // Nhập mã mới
            await page.fill(inputSelector, '');
            await page.fill(inputSelector, code);

            // Nhấn nút Đổi (sử dụng force: true nếu vẫn bị overlay nhẹ)
            await page.click(btnSelector, { force: true });

            // Chờ thông báo xuất hiện
            await page.waitForTimeout(2000);

            // ĐỌC NỘI DUNG THÔNG BÁO (Để biết thành công hay đã nhận)
            const popupText = await page.evaluate(() => {
                // Thử tìm text trong các class thông báo phổ biến
                const el = document.querySelector('.pop-content, .dialog-txt, .msg, .pop-msg');
                return el ? el.innerText : '';
            });

            if (popupText) {
                if (popupText.includes('đã nhận') || popupText.includes('đã sử dụng')) {
                    console.log(`--> [BỎ QUA] Mã ${code} đã được nhận trước đó.`);
                } else if (popupText.includes('thành công')) {
                    console.log(`--> [THÀNH CÔNG] Mã ${code} đổi thành công!`);
                } else {
                    console.log(`--> [THÔNG BÁO] ${popupText}`);
                }
            }

            // CỐ GẮNG ĐÓNG POPUP
            await page.keyboard.press('Escape');
            const closeSelectors = ['.pop-close', '.close-btn', '.btn-confirm', '.btn-close', '.dialog-close'];
            for (const selector of closeSelectors) {
                const btn = await page.$(selector);
                if (btn && await btn.isVisible()) {
                    await btn.click();
                    break;
                }
            }

            // CHỜ LỚP MỜ (OVERLAY) BIẾN MẤT HOÀN TOÀN
            await page.waitForFunction(() => {
                const overlay = document.querySelector('#_overlay_, .overlay, .modal-backdrop');
                return !overlay || window.getComputedStyle(overlay).display === 'none' || window.getComputedStyle(overlay).visibility === 'hidden';
            }, { timeout: 5000 }).catch(() => {});

            await page.waitForTimeout(1000);

        } catch (error) {
            console.error(`Lỗi khi nhập mã ${code}:`, error.message);
        }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n--------------------------------------------------');
    console.log('HOÀN THÀNH: Đã chạy hết danh sách Giftcode!');
    console.log(`Tổng thời gian: ${elapsed} giây`);
    console.log('--------------------------------------------------');
    await askQuestion('Nhấn Enter để đóng trình duyệt...');
    await browser.close();
}

run();
