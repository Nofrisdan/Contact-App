// core modules
// thirdparty modules
const express = require("express");
const layout = require("express-ejs-layouts"); 
const { body, validationResult, check } = require('express-validator'); // middleware express yang berfungsi untuk memvalidasi 
const 
    session = require("express-session"), //berfungsi untuk membuat session
    cookie = require("cookie-parser"), // berfungsi untuk membuat cookie
    flash = require("connect-flash");  //berfungsi untuk membuat flas

// utils modules
const utils = require("./Utils/Kontak");

// initialize
const port = 3000;
const app = express();

// set layout ejs
app.set("view engine","ejs");
app.set("layout","layout/layout");


// konfigurasi flash, cookie, session
// setcookie
app.use(cookie('secret'));
// setsession
app.use(session({
    cookie:{maxAge : 60000},
    secret : 'secret',
    resave : true,
    saveUninitialized :true

}));
// setflash
app.use(flash());

// use
app.use(layout); //third-party middle ware

// file static
// app.use(express.static("public")); //built-in middleware
app.use("/bs4css",express.static( __dirname + "/public/bs4/css"));
app.use("/bs4js",express.static(__dirname + "/public/bs4/js"));
app.use("/img",express.static(__dirname + "/public/img"));

//app.use(express.json()); //body parsing middle ware type json
app.use(express.urlencoded({extended:true})); // body parsing middle ware type application/x-www-form-urlencoded

// configure routes
app.get("/",(req,res) => {
    res.render("index",{
        page:"Halaman Dashboard",
        menu:"dashboard"
    })
})

// routes about
app.get("/about",(req,res) => {
    res.render("about",{
        page:"Halaman About",
        menu:"about"
    })
})

// routes kontak
app.get("/kontak",(req,res) => {

    // console.log(utils.getKontak().length);
    res.render("kontak",{
        page:"Halaman kontak",
        menu:"kontak",
        data : utils.getKontak(),
        msg : req.flash('msg')
    })
})

app.get("/kontak/detail/:nama",(req,res) => {

    res.render("detail",{
        page:"Halaman Detail",
        menu:"kontak",
        data : utils.findKontak(req.params.nama)
    })
})

app.get("/kontak/tambah",(req,res)=> {
    res.render("form-tambah-kontak",{

        page:"Halaman Tambah Kontak",
        menu:"kontak"
    })
})


// INCLUDE EXPRESS-VALIDATOR
app.post("/kontak/tambah-data",
//express-validator
[
    //custom
    body('nama').custom( v => {
        const duplikat = utils.cekDuplikat(v);

        if(duplikat){
            throw new Error("Nama yang anda masukkan sudah terdaftar");
        }

        return true;
    }),

    // check automatic
    check("email").isEmail().withMessage("Email Yang Anda Masukkan Tidak Valid"),
    check("nohp").isMobilePhone("id-ID").withMessage("No HandPhone Yang anda masukkan tidak valid")
],
(req,res) => {

    // handler
    const err = validationResult(req);

    if(!err.isEmpty()){
        // return res.status(400)
        // .json( {error: err.array() } );

        res.render("form-tambah-kontak",{
            page:"Halaman Tambah Kontak",
            menu:"kontak",
            errors : err.array()
        })

    }else{
        // tambahkan kontak
        utils.addKontak(req.body);

        // set flash
        req.flash("msg","Data Kontak Berhasil di tambahkan");

        // redirect
        res.redirect("/kontak");
    }
    
})

app.get("/kontak/hapussemua",(req,res) => {
    utils.deleteAll();
    res.redirect("/kontak");
})

app.get("/kontak/hapus/:nama",(req,res) => {
    utils.deleteKontak(req.params.nama);
    // set flash
    req.flash("msg","Data Kontak Berhasil di tambahkan");

    // redirect
    res.redirect("/kontak");
    // const data = utils.deleteKontak(req.params.nama)
})

// testing
app.get("/testing",(req,res) => {
    
    // cookie yang belum ditanda tangani
    console.log("Cookies-blm-ttd :",req.cookies);

    // cookie telah ditanda tangani
    console.log("Signed Cookie : ",req.signedCookies);

    res.send("berhasil dibuatkan silahkan lihat di log");

})



// app.post("/kontak")
app.listen(port,() => {
    console.log(`Listen to localhost:${port}`);
})
