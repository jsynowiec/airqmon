import axios, { AxiosResponse } from 'axios';
import { ipcRenderer } from 'electron';
import { EventEmitter } from 'events';
import * as semver from 'semver';
import { setTimeout, clearTimeout } from 'timers';

import IPC_EVENTS from 'common/ipc-events';

const CHECK_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours
const GITHUB_BASE_URL = 'https://api.github.com';
const GITHUB_REPO = 'jsynowiec/airqmon';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const currentVer: string = require('@root/package.json').version;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const appName: string = require('@root/package.json').name;

interface IGitHubRelease {
  // https://developer.github.com/v3/repos/releases/
  id: number;
  tag_name: string;
  prerelease: boolean;
  published_at: string;
  body: string;
  assets: {
    name: string;
    content_type: string;
    browser_download_url: string;
  }[];
}

interface IUpdateChecker extends EventEmitter {
  /**
   * Emitted when there is an available update.
   */
  on(event: 'update-available', listener: (version: string, url: string) => void): this;
  once(event: 'update-available', listener: (version: string, url: string) => void): this;
  addListener(event: 'update-available', listener: (version: string, url: string) => void): this;
  removeListener(event: 'update-available', listener: (version: string, url: string) => void): this;
  /**
   * Asks the server whether there is an update.
   */
  checkForUpdates(): void;
}

class UpdateChecker extends EventEmitter implements IUpdateChecker {
  private checkTimer: NodeJS.Timer;
  private latestKnownVersion: string = currentVer;
  private retries = 0;

  protected updateAvailable = false;

  protected updateUrl?: string;

  constructor() {
    super();

    ipcRenderer.on(IPC_EVENTS.CONN_STATUS_CHANGED, (_, status: 'oneline' | 'offline') => {
      if (status === 'offline') {
        clearTimeout(this.checkTimer);
      } else {
        this.scheduleCheck(10 * 1000);
      }
    });
  }

  private getRetryBackoff(): number {
    return Math.min(Math.pow(2, this.retries) * 30 * 1000, CHECK_INTERVAL / 2);
  }

  private retryWithBackoff(): void {
    this.scheduleCheck(this.getRetryBackoff());
    this.retries += 1;
  }

  private scheduleCheck(delay: number = CHECK_INTERVAL): void {
    this.checkTimer = setTimeout(this.checkForUpdates.bind(this), delay);
  }

  checkForUpdates(): void {
    axios({
      url: `${GITHUB_BASE_URL}/repos/${GITHUB_REPO}/releases`,
    })
      .then((result: AxiosResponse<IGitHubRelease[]>) => {
        if (result.status === 200) {
          const availableUpdates = result.data
            .filter((elem) => semver.satisfies(elem.tag_name, `>${currentVer}`))
            .sort((r1, r2) => semver.compare(r1.tag_name, r2.tag_name));

          if (availableUpdates.length > 0) {
            const { tag_name: version, assets } = availableUpdates.pop();

            // Notify only about newer updates
            if (semver.gt(version, this.latestKnownVersion)) {
              this.latestKnownVersion = version;

              this.updateAvailable = true;
              this.updateUrl = assets.find((asset) => {
                return (
                  asset.content_type === 'application/zip' && asset.name === `${appName}-mac.zip`
                );
              }).browser_download_url;

              this.emit('update-available', ...[version, this.updateUrl]);
            }
          }

          this.retries = 0;
          this.scheduleCheck();
        } else {
          this.retryWithBackoff();
        }
      })
      .catch((error) => {
        console.log(error.message);
        // Check again with backoff on subsequent retries
        this.retryWithBackoff();
      });
  }
}

export default new UpdateChecker() as IUpdateChecker;
