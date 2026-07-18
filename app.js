// 1. Konfigurasi
const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbziYrjjBKv0zcdxee5paQVXBmDLbaF7FTYijWyLJAMwlRbdwjA_e3bHH2keicMjK0y4/exec";
const html5QrCode = new Html5QrCode("reader");

document.getElementById('scanBtn').addEventListener('click', async () => {
    const scanBtn = document.getElementById('scanBtn');
    const hasil = document.getElementById('hasil');

    scanBtn.disabled = true;
    hasil.innerText = "Membuka kamera...";

    try {
        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            async (decodedText) => {
                // Berhenti segera
                await html5QrCode.stop();
                scanBtn.disabled = false;
                hasil.innerText = "Data terdeteksi, mengirim ke server...";

                try {
                    const response = await fetch(`${URL_WEB_APP}?action=scan&id=${encodeURIComponent(decodedText)}`);
                    const data = await response.json();

                    if (data.success) {
                        hasil.innerHTML = `✅ <b>Berhasil!</b><br>Nama: ${data.nama}<br>${data.message}`;
                    } else {
                        hasil.innerHTML = `⚠️ <b>Gagal!</b><br>${data.message}`;
                    }
                } catch (err) {
                    hasil.innerText = "Gagal terhubung ke server.";
                }
            },
            (errorMessage) => { /* Abaikan error scanning */ }
        );
    } catch (err) {
        scanBtn.disabled = false;
        hasil.innerText = "Kamera tidak dapat diakses.";
        console.error("Camera Error:", err);
    }
});
