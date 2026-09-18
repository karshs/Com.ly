const crypto = require('crypto');

// A simple, readable IP hasher for beginners
function hashIp(ipAddress) {
  if (!ipAddress) {
    return 'unknown';
  }

  // Normalize localhost (IPv6 vs IPv4 formats)
  let normalizedIp = ipAddress;
  if (ipAddress === '::1' || ipAddress === '127.0.0.1') {
    normalizedIp = '127.0.0.1';
  }

  const salt = process.env.IP_SALT || 'comly_default_salt';

  const combinedString = normalizedIp + salt;

  const hashEngine = crypto.createHash('sha256'); 
  hashEngine.update(combinedString);              
  const finalHexHash = hashEngine.digest('hex');  

  return finalHexHash;
}

module.exports = hashIp;
