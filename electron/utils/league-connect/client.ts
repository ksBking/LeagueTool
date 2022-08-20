import { EventEmitter } from 'events';
import { authenticate, type Credentials } from './authentication.js';

export declare interface LeagueClient {
  on(event: 'connect', callback: (credentials: Credentials) => void): this;
  on(event: 'disconnect', callback: () => void): this;
}

export class LeagueClient extends EventEmitter {
  private isListening = false;
  public credentials: Credentials | null = null;

  constructor() {
    super();
  }

  start() {
    if (!this.isListening) {
      this.isListening = true;
      this.onTick();
    }
  }

  /**
   * Stop listening for client stop/start
   */
  stop() {
    this.isListening = false;
  }

  private async onTick() {
    if (this.isListening) {
      if (this.credentials) {
        // Current credentials are valid
        if (!processExists(this.credentials.pid)) {
          // No such process, emit disconnect and
          // invalidate credentials
          this.emit('disconnect');
          this.credentials = null;
          // Re-queue onTick to listen for credentials
          this.onTick();
        } else {
          // Process still lives, queue onTick
          setTimeout(() => {
            this.onTick();
          }, 2500);
        }
      } else {
        // Current credentials were invalidated, wait for
        // client to come back up
        const credentials = await authenticate({ awaitConnection: true });
        this.credentials = credentials;
        this.emit('connect', credentials);
        setTimeout(() => {
          this.onTick();
        }, 2500);
      }
    }
  }
}

function processExists(pid: number): boolean {
  try {
    // `man 1 kill`: if sig is 0, then no signal is sent, but error checking
    // is still performed.
    return process.kill(pid, 0);
  } catch (err) {
    return err?.code === 'EPERM';
  }
}
