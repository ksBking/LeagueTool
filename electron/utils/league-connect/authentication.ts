import cp from 'child_process';
import util from 'util';

const exec = util.promisify<typeof cp.exec.__promisify__>(cp.exec);

export interface Credentials {
  port: number;
  token: string;
  pid: number;
}

export interface AuthenticationOptions {
  awaitConnection?: boolean;
}

export class ClientNotFoundError extends Error {
  constructor() {
    super('league client process could not be located');
  }
}

export async function authenticate(options?: AuthenticationOptions): Promise<Credentials> {
  async function tryAuthenticate() {
    const command = `Get-CimInstance -Query "SELECT * from Win32_Process WHERE name LIKE 'LeagueClientUx.exe'" | Select-Object CommandLine | fl`;
    try {
      const { stdout: rawStdout } = await exec(command, { shell: 'powershell' });
      const stdout = rawStdout.replace(/\s/g, '');
      const port = stdout.match(/--app-port=([0-9]+)/);
      const password = stdout.match(/--remoting-auth-token=([\w-_]+)/);
      const pid = stdout.match(/--app-pid=([0-9]+)/);
      if (port && password && pid) {
        return {
          port: Number(port[1]),
          pid: Number(pid[1]),
          token: password[1],
        };
      } else {
        throw new ClientNotFoundError();
      }
    } catch {
      throw new ClientNotFoundError();
    }
  }

  if (options?.awaitConnection) {
    return new Promise(function self(resolve, reject) {
      tryAuthenticate()
        .then(result => resolve(result))
        .catch(() => setTimeout(self, 2500, resolve, reject));
    });
  } else {
    return tryAuthenticate();
  }
}
