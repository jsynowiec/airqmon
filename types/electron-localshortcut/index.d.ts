declare module 'electron-localshortcut' {
  import { BrowserWindow } from "electron";

  /**
   * Registers the shortcut acceleratoron the BrowserWindow instance.
   */
  function register(win: BrowserWindow, accelerator: string, callback: () => void): void;

  /**
   * Unregisters the shortcut of accelerator registered on the BrowserWindow instance.
   */
  function unregister(win: BrowserWindow, accelerator: string): void;

  /**
   * Returns true or false depending on whether the shortcut accelerator is registered on window.
   */
  function isRegistered(win: BrowserWindow, accelerator: string): boolean;

  /**
   * Unregisters all of the shortcuts registered on any focused BrowserWindow instance. This method
   * does not unregister any shortcut you registered on a particular window instance.
   */
  function unregisterAll(win: BrowserWindow): void;

  /**
   * Enable all of the shortcuts registered on the BrowserWindow instance that you had previously
   * disabled calling disableAll method.
   */
  function enableAll(win: BrowserWindow): void;

  /**
   * Disable all of the shortcuts registered on the BrowserWindow instance.
   */
	function disableAll(win: BrowserWindow): void;
}
