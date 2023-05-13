import crypto from "crypto";

export const encrypt = (plainText: any, workingKey: any) => {
  var m = crypto.createHash('md5');
  m.update(workingKey);
  var key = m.digest('base64');
	let key_in_bytes = Buffer.from(key, "base64");
  var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';	
	var cipher = crypto.createCipheriv('aes-128-cbc', key_in_bytes, iv);
	var encoded = cipher.update(plainText,'utf8','hex');
	encoded += cipher.final('hex');
    	return encoded;
};

export const decrypt = (encText: any, workingKey: any) => {
    var m = crypto.createHash('md5');
    m.update(workingKey)
    var key = m.digest('base64');
		let key_in_bytes = Buffer.from(key, "base64");
		var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';	
		var decipher = crypto.createDecipheriv('aes-128-cbc', key_in_bytes, iv);
		var decoded = decipher.update(encText,'hex','utf8');
		decoded += decipher.final('utf8');
    	return decoded;
};
