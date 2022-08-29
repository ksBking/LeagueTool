import https from 'https';
import type { Credentials } from './authentication.js';

interface options {
  url: string;
  method?: string;
  body?: any;
}

interface res {
  data: any;
  status?: number;
  msg?: string;
}

export async function createHttpRequest(options: options, credentials: Credentials): Promise<res> {
  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        host: '127.0.0.1',
        port: credentials.port,
        path: options.url,
        method: options.method || 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + Buffer.from(`riot:${credentials.token}`).toString('base64'),
        },
        agent: new https.Agent({ rejectUnauthorized: false }),
      },
      res => {
        const chuck: Buffer[] = [];
        res.on('data', (data: Buffer) => chuck.push(data));

        res.on('end', () => {
          console.log('callAPI :', options, JSON.parse(Buffer.concat(chuck).toString()));
          resolve({
            msg: res.statusMessage,
            status: res.statusCode,
            data: JSON.parse(Buffer.concat(chuck).toString()),
          });
        });
      }
    );
    if (options.body) {
      request.write(JSON.stringify(options.body), 'utf8');
    }
    request.on('error', err => reject(err));
    request.end();
  });
}
