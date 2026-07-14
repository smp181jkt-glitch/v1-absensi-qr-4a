const WEBAPP =
"https://script.google.com/macros/s/AKfycbzScCPxNEXGGyo1X0ArFx_WYYzYgu5qLowcRo7TNmrmbKH3gNVEWWKzcUFrWcLKPTHr/exec";

const hasil=document.getElementById("hasil");
const tombol=document.getElementById("scanBtn");

let scanner;
let sedangScan=false;

tombol.onclick=function(){

if(sedangScan)return;

scanner=new Html5Qrcode("reader");

scanner.start(

{facingMode:"environment"},

{
fps:10,
qrbox:250
},

success,
error

);

sedangScan=true;

tombol.style.display="none";

}

function success(qr){

scanner.stop();

hasil.innerHTML="Mengirim data...";

fetch(WEBAPP+"?no="+encodeURIComponent(qr))

.then(r=>r.json())

.then(data=>{

if(data.sukses){

hasil.className="berhasil";

hasil.innerHTML=
"✅<br><br>"+data.nama+
"<br><br>"+data.pesan;

}else{

hasil.className="gagal";

hasil.innerHTML=
"❌<br><br>"+data.pesan;

}

setTimeout(()=>{

hasil.className="";

hasil.innerHTML="Silakan scan QR berikutnya";

tombol.style.display="block";

sedangScan=false;

},3000);

})

.catch(()=>{

hasil.className="gagal";

hasil.innerHTML="Server tidak dapat dihubungi";

tombol.style.display="block";

sedangScan=false;

});

}

function error(){

}