	/**
	A custom exception class for Sideshow

	@class SSException
	@extends Error
	@param {String} code                                  The error code
	@param {String} message                               The error message
	**/
	function SSException(code, message) {
	    this.name = "SSException";
	    this.message = "[SIDESHOW_E#" + ("00000000" + code).substr(-8) + "] " + message;
	}

	SSException.prototype = new Error();
	SSException.prototype.constructor = SSException;
