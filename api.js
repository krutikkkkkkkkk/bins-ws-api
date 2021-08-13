const express = require('express')
const fetch = require('node-fetch')
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const app = express()

app.get('/',(req,res) => {
    res.status(200).send("api/{bin}")
})

app.get('/api/:bin', (req, res)=> {
    const bin = req.params.bin
    const api = `https://bins.ws/search?bins=${bin}`;
    try{
        fetch(api)
        .then(  response => response.text())
        .then(data => {
            data = new JSDOM(data);
            binData = data.window.document.querySelector(".page tbody tr").textContent
            let binInfo = binData.split("\n")
            binInfo = binInfo.filter(i=>i)
            let binObject = {
                bin : binInfo[0],
                type: binInfo[1],
                level: binInfo[2],
                brand: binInfo[3],
                bank: binInfo[4],
                country: binInfo[5]
            }
            res.send(binObject)
          })
          .catch(error => {console.error('Error:', error)
          let object = {
            result: false,
            message: "Invalid BIN"
        }
        res.status(200).send(object)
     })
    }
    
    catch(error){
        let object = {
            result: false,
            message: error.message
        }
        res.send(object)
    }  
})


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });