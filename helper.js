const fs = require('fs');

export default function createHTML(dataHTML){
    return new Promise((resolve, reject) => {
        fs.readFile(dataHTML, 'utf8', (err, data) => {
            if(err) {
                reject(err);
            }
            resolve(data);
        });
    });
}