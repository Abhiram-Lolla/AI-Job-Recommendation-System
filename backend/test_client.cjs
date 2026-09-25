const http = require('http');
const fs = require('fs');

fs.writeFileSync('dummy.pdf', 'dummy pdf content');

const loginPayload = JSON.stringify({ username: 'test@example.com', password: 'password123' });

const loginOptions = {
  hostname: '127.0.0.1',
  port: 8000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginPayload)
  }
};

const reqLogin = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const token = JSON.parse(data).access_token;
    if (!token) {
        console.error('Login failed, trying to register...');
        const registerPayload = JSON.stringify({ name: 'Test', email: 'test@example.com', password: 'password123' });
        const regOptions = { ...loginOptions, path: '/api/v1/auth/register', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(registerPayload) } };
        const reqReg = http.request(regOptions, (res) => {
            let regData = '';
            res.on('data', chunk => regData += chunk);
            res.on('end', () => {
                console.log('Registered. Now you can run it again.');
            });
        });
        reqReg.write(registerPayload);
        reqReg.end();
        return;
    }
    console.log('Logged in. Token:', token.substring(0, 10) + '...');
    
    // Now upload
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const payload = '--' + boundary + '\r\n' +
                    'Content-Disposition: form-data; name="file"; filename="dummy.pdf"\r\n' +
                    'Content-Type: application/pdf\r\n\r\n' +
                    'dummy pdf content\r\n' +
                    '--' + boundary + '--\r\n';

    const options = {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/v1/resume/upload',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': 'Bearer ' + token
      }
    };

    const reqUpload = http.request(options, (res) => {
      let upData = '';
      res.on('data', chunk => upData += chunk);
      res.on('end', () => console.log('Upload Response:', res.statusCode, upData));
    });

    reqUpload.on('error', (e) => console.error('Upload Request error:', e.message));
    reqUpload.write(payload);
    reqUpload.end();
  });
});

reqLogin.on('error', (e) => console.error('Login Request error:', e.message));
reqLogin.write(loginPayload);
reqLogin.end();
