const WEBAPP = "https://script.google.com/macros/s/AKfycbzScCPxNEXGGyo1X0ArFx_WYYzYgu5qLowcRo7TNmrmbKH3gNVEWWKzcUFrWcLKPTHr/exec";

const hasil = document.getElementById("hasil");
const tombol = document.getElementById("scanBtn");

let html5QrCode;
let scanning = false;

tombol.addEventListener("click", startScanner);

function startScanner() {

    if (scanning) return;

    scanning = true;

    tombol.style.display = "none";

    hasil.innerHTML = "Membuka kamera...";

    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        {
            facingMode: "environment"
        },
        {
            fps: 10,
            qrbox: 250
        },
        onScanSuccess
    );

}

function onScanSuccess(decodedText) {

    html5QrCode.stop();

    hasil.innerHTML = "Mengirim absensi...";

    const url =
        WEBAPP +
        "?action=scan&id=" +
        encodeURIComponent(decodedText);

    fetch("https://script.google.com/macros/s/AKfycbyl9HGsJhMxHRl0aE1rMyrr7kqu-rex2CpQ0Utk5P-GlLjvWUAqk8zoZTukWsvTFpTz/exec")
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                hasil.className = "berhasil";

                hasil.innerHTML =
                    "✅<br><br>" +
                    data.nama +
                    "<br><br>" +
                    data.message;

            } else {

                hasil.className = "gagal";

                hasil.innerHTML =
                    "❌<br><br>" +
                    data.nama +
                    "<br><br>" +
                    data.message;

            }

            setTimeout(() => {

                hasil.className = "";

                hasil.innerHTML = "Silakan scan QR berikutnya";

                tombol.style.display = "block";

                scanning = false;

            }, 2500);

        })
        .catch(err => {

            console.log(err);

            hasil.className = "gagal";

            hasil.innerHTML =
                "❌<br>Server tidak dapat dihubungi";

            tombol.style.display = "block";

            scanning = false;

        });

}
