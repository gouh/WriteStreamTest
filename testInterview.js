const https = require('https');
let fs = require('fs');
const crypto = require('crypto');

const endpoint = 'https://coderbyte.com/api/challenges/json/age-counting';
const mainAge = '32';
const hashType = 'sha1';
const outputFileName = 'output.txt';
const encoding = 'utf-8';
const emptyValueReplacement = '';

const messageExecution = 'Ejecutando test de entrevista...';
const printingMatchValues = 'Valores que coinciden con age ' + mainAge;
const messageOutput = 'Valor encriptado en sha1: ';

let processString = (contentString) => {
    let elements = contentString.split(',');
    let keyValues = [];
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        const isKey = !element.includes(' age=');
        if (isKey) {
            // Get Key value
            keyValue = element.replace(' key=', emptyValueReplacement);
            keyValue = keyValue.replace('key=', emptyValueReplacement);
            // Get Age value
            let age = elements[index + 1].replace(' age=', emptyValueReplacement);
            if (age === mainAge) {
                keyValues.push([keyValue]);
            }
        }
    }
    return keyValues;
};

let writeStream = (keyValues) => {
    const writeStream = fs.createWriteStream(outputFileName);
    for (let index = 0; index < keyValues.length; index++) {
        writeStream.write(`${keyValues[index]}\n`)
    }
    writeStream.on('finish', () => {
        const buffer = fs.readFileSync(outputFileName);
        const hash = crypto.createHash(hashType);
        hash.update(buffer);
        const hex = hash.digest('hex');
        console.info(messageOutput, hex);
    });
    writeStream.end();
};


let executeInterviewTest = () => {
    console.info(messageExecution);
    https.get(endpoint, (resp) => {
        resp.setEncoding(encoding);
        let body = '';

        resp.on('data', (chunk) => {
            body += chunk;
        });

        resp.on('end', () => {
            let keyValues = processString(JSON.parse(body).data)
            console.info(printingMatchValues);
            console.table(keyValues);
            writeStream(keyValues);
        });
    });
}

executeInterviewTest();