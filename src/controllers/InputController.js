export class InputController {
    constructor() {
        this.keys = {};
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true; // แปลงทุกคีย์ให้เป็นตัวพิมพ์เล็ก
        });

        window.addEventListener('keyup', (e) => {
            delete this.keys[e.key.toLowerCase()]; // ลบคีย์ออกเมื่อปล่อยปุ่ม
        });
    }

    isKeyPressed(key) {
        // ตรวจสอบทั้งคีย์อังกฤษและไทย
        return this.keys[key] || this.keys[this.translateKey(key)];
    }

    // ฟังก์ชันสำหรับแปลงคีย์ภาษาอังกฤษเป็นไทย
    translateKey(key) {
        const translations = {
            'a': 'A',
            'ฟ': 'ฤ',
            'd': 'D',
            'ก': 'ฏ',
        };
        return translations[key] || key;
    }
}
