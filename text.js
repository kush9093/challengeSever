import fs from "fs"

if(fs.existsSync(`public/202020@gmail.com`)){
    console.log(fs.existsSync(`public/202020@gmail.com`))
    fs.rmSync(`public/202020@gmail.com`,{ recursive: true, force: true })
}