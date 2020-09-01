/**
 * Utils.js
 * @description A class that contains a set of static functions that can be used throughout the app
 * @author travsr
 */

 class Utils {

    /**
     * Return the platform (firefox vs chrome)
     */
    static getPlatform() {
        if(typeof browser !== "undefined") {
            return "firefox";
        }
        else if(typeof chrome !== "undefined") {
            return "chrome";
        }
        else {
            return "unknown";
        }
    }

    /** 
     * Return the api object
     */
    static getPlatform() {
        if(typeof browser !== "undefined") {
            return browser;
        }
        else if(typeof chrome !== "undefined") {
            return chrome;
        }
        else {
            return {};
        }
    }
    
 }