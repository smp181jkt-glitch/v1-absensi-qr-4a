const WEBAPP ="https://script.google.com/macros/s/AKfycbzaTmvlD9W5f7yg2iBpaSPBCRsuUNZbQNXY2ZTP0WzZVgk1Gx8nY7oE_xvaXPuYyOyJ/exec";

const hasil = document.getElementById("hasil");
const tombol = document.getElementById("scanBtn");

let html5QrCode;
let scanning = false;


tombol.addEventListener("click", startScanner);


function startScanner(){

    if(scanning) return;

    scanning=true;

    tombol.style.display="none";

    hasil.innerHTML="Membuka kamera...";


    html5QrCode = new Html5QrCode("reader");


    Html5QrCode.getCameras()
    .then(cameras=>{


        if(cameras.length===0){

            throw "Kamera tidak ditemukan";

        }


        // pilih kamera belakang jika ada
        let cameraId = cameras[cameras.length-1].id;


        html5QrCode.start(
            cameraId,
            {
                fps:10,
                qrbox:250
            },
            onScanSuccess
        );


    })
    .catch(err=>{


        console.log(err);

        hasil.innerHTML =
        "❌ Kamera tidak bisa dibuka<br><br>" +
        err;


        tombol.style.display="block";

        scanning=false;


    });


}



function onScanSuccess(decodedText){


    html5QrCode.stop();


    hasil.innerHTML="Mengirim absensi...";


    const url =
    WEBAPP+
    "?action=scan&id="+
    encodeURIComponent(decodedText);



    fetch(url)

    .then(res=>res.json())

    .then(data=>{


        if(data.success){


            hasil.className="berhasil";

            hasil.innerHTML=
            "✅<br><br>"+
            data.nama+
            "<br><br>"+
            data.message;


        }else{


            hasil.className="gagal";

            hasil.innerHTML=
            "❌<br><br>"+
            data.message;


        }


        setTimeout(()=>{


            hasil.className="";

            hasil.innerHTML="Silakan scan QR berikutnya";

            tombol.style.display="block";

            scanning=false;


        },2500);



    })


    .catch(err=>{


        console.log(err);


        hasil.className="gagal";

        hasil.innerHTML=
        "❌ Server tidak dapat dihubungi";


        tombol.style.display="block";

        scanning=false;


    });


}
