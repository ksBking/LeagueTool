import https from 'https';
import WebSocket, { type ClientOptions } from 'ws';
import { type Credentials } from './authentication.js';

export class LeagueWebSocket extends WebSocket {
  subscriptions = new Map();

  constructor(address: string, options: ClientOptions) {
    super(address, options);

    this.on('open', () => {
      this.send(JSON.stringify([5, 'OnJsonApiEvent']));
    });

    this.on('message', (binary: Buffer) => {
      if (binary.length) {
        try {
          const [, , res] = JSON.parse(binary.toString());
          if (this.subscriptions.has(res.uri)) {
            this.subscriptions.get(res.uri)?.forEach(cb => cb(res.data, res));
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  }

  public subscribe(path: string, effect: (data: never, res?: never) => void) {
    if (!this.subscriptions.has(path)) {
      this.subscriptions.set(path, [effect]);
    } else {
      this.subscriptions.get(path)?.push(effect);
    }
  }

  public unsubscribe(path: string) {
    this.subscriptions.delete(path);
  }
}

export async function createWebSocketConnection(credentials: Credentials): Promise<LeagueWebSocket> {
  let socket: LeagueWebSocket | null = null;
  do {
    try {
      socket = new LeagueWebSocket(`wss://127.0.0.1:${credentials.port}`, {
        headers: { Authorization: 'Basic ' + Buffer.from(`riot:${credentials.token}`).toString('base64') },
        agent: new https.Agent({ rejectUnauthorized: false }),
      });
    } catch (err) {
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
    }
  } while (socket?.readyState !== LeagueWebSocket.OPEN && socket?.readyState !== LeagueWebSocket.CONNECTING);
  return socket;
}
