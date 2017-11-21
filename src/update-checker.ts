import axios, { AxiosResponse } from 'axios';
import * as semver from 'semver';

import { EventEmitter } from 'events';
import { setTimeout } from 'timers';

const CHECK_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours
const GITHUB_BASE_URL = 'https://api.github.com';
const GITHUB_REPO = 'jsynowiec/airqmon';

const name: string = require('../package.json').name;
const currentVer: string = require('../package.json').version;

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
  on(event: 'update-available', listener: (version: string,
                                           url: string) => void): this;
  once(event: 'update-available', listener: (version: string,
                                             url: string) => void): this;
  addListener(event: 'update-available', listener: (version: string,
                                                    url: string) => void): this;
  removeListener(event: 'update-available', listener: (version: string,
                                                       url: string) => void): this;
  /**
   * Asks the server whether there is an update.
   */
  checkForUpdates(): void;
}

class UpdateChecker extends EventEmitter implements IUpdateChecker {
  private checkTimer: NodeJS.Timer;
  private latestKnownVersion: string = currentVer;
  private retries: number = 0;

  protected updateAvailable: boolean = false;

  protected updateUrl?: string;

  constructor() {
    super();

    this.scheduleCheck(10 * 1000);
  }

  private getRetryBackoff() {
    return Math.min(Math.pow(2, this.retries) * 30 * 1000, CHECK_INTERVAL / 2);
  }

  private retryWithBackoff() {
    this.scheduleCheck(this.getRetryBackoff());
    this.retries += 1;
  }

  private scheduleCheck(delay: number = CHECK_INTERVAL) {
    this.checkTimer = setTimeout(this.checkForUpdates.bind(this), delay);
  }

  checkForUpdates() {
    axios({
      url: `${GITHUB_BASE_URL}/repos/${GITHUB_REPO}/releases`,
    }).then((result: AxiosResponse<IGitHubRelease[]>) => {
      if (result.status === 200) {
        const availableUpdates = result.data
          .filter(elem => semver.gt(elem.tag_name, currentVer))
          .sort((r1, r2) => semver.compare(r1.tag_name, r2.tag_name));

        if (availableUpdates.length > 0) {
          const { tag_name: version, assets } = availableUpdates[0];

          // Notify only about newer updates
          if (semver.gt(version, this.latestKnownVersion)) {
            this.latestKnownVersion = version;

            this.updateAvailable = true;
            this.updateUrl = assets.find((asset) => {
              return asset.content_type === 'application/zip' && asset.name === `${name}-mac.zip`;
            }).browser_download_url || null;

            this.emit('update-available', ...[
              version,
              this.updateUrl,
            ]);
          }
        }

        this.retries = 0;
        this.scheduleCheck();
      } else {
        this.retryWithBackoff();
      }
    }).catch((error) => {
      console.log(error.message);
      // Check again with backoff on subsequent retries
      this.retryWithBackoff();
    });
  }
}

export default new UpdateChecker() as IUpdateChecker;
