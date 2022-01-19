// modul kontak js
const fs = require("fs");


const path = "./data";
const file = path + "/data.json";


// cek file
if(!fs.existsSync(path)){
    fs.mkdirSync(path);
}

if(!fs.existsSync(file)){
    fs.writeFileSync(file,"[]");
}

// function

// ----- mengambil semua nama kontak ---
function getKontak(){
    const kontak = fs.readFileSync(file,"utf-8");
    return JSON.parse(kontak);
}

// ------ mengambil nama kontak ----
function findKontak(nama){

    const kontak = getKontak();
    const detail = kontak.filter(v => v.nama.toLowerCase() == nama.toLowerCase());

    return detail;
}

// --------- menambahkan kontak ----

function addKontak(data){
    const kontak = getKontak();

    kontak.push(data);

    save(kontak);
}
function save(data){
    // const kontak = getKontak();
    fs.writeFileSync(file,JSON.stringify(data));
}

// -------- menghapus kontak ----
function deleteKontak(nama){
    
    const kontak = getKontak();

    const newKontak = kontak.filter( v => v.nama != nama);

    save(newKontak);
}

// menghapus semua kontak
function deleteAll(){
    const data = [];

    save(data);
}



// ---------- cek duplikat -------
function cekDuplikat(nama){
    
    const cek = findKontak(nama);

    if(cek.length != 0){
        return true;
    }else{
        return false;
    }

}


// export
module.exports = {
    getKontak,
    findKontak,
    addKontak,
    deleteKontak,
    deleteAll,
    cekDuplikat
}