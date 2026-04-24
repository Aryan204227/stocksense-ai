import https from 'https';

https.get('https://stocksense-ai-r24w.onrender.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body length: ${data.length}`);
    console.log(`Body sample: ${data.substring(0, 200)}`);
  });
}).on('error', err => console.error(err));
