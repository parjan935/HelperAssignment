import QRCode from 'qrcode'

async function generateQRCode(helper: {}): Promise<string> {
    const jsonString = JSON.stringify(helper);

    try {
        const qrCodeDataUrl = await QRCode.toDataURL(jsonString);
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Failed to generate QR code:', error);
        throw error;
    }
}

export default generateQRCode;