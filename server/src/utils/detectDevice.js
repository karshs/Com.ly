
function detectDevice(userAgent) {
  if (!userAgent) {
    return 'Unknown';
  }

  const ua = userAgent.toLowerCase();


  if (ua.includes('ipad') || ua.includes('tablet') || ua.includes('playbook')) {
    return 'Tablet';
  }

  if (ua.includes('iphone') || ua.includes('android') || ua.includes('ipod') || ua.includes('mobile')) {
    return 'Mobile';
  }

  return 'Desktop';
}

module.exports = detectDevice;
