export async function getBrowserInfo() {
  const ua = navigator.userAgent;
  const uaData = (navigator as any).userAgentData;
  let browser = 'Unknown';
  let os = 'Unknown';
  let buildNumber = 0;
  let version = 'Unknown';
  let platform = 'Unknown';
  let platformVersion = 'Unknown';
  let isBrave = false;

  // 🦁 Detect Brave (safe async detection)
  if ((navigator as any).brave && (await (navigator as any).brave.isBrave())) {
    isBrave = true;
  }

  // 🌐 Browser detection
  if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';
  if (isBrave) browser = 'Brave';

  // 🪟 OS detection
  if (ua.includes('Windows NT 10.0')) {
    os = 'Windows';
    // 🧮 Try to fetch build number if available
    try {
      const highEntropy = uaData
        ? await uaData.getHighEntropyValues(['platformVersion'])
        : null;

      platform = uaData?.platform || 'Windows';
      platformVersion = highEntropy?.platformVersion || 'unknown';

      // Map platformVersion (example: "15.0.0") to build number if possible
      const major = parseInt(platformVersion.split('.')[0], 10);
      if (major >= 13) {
        // heuristic mapping
        buildNumber = major * 1000; // dummy approximation
        os = major >= 13 ? 'Windows 11' : 'Windows 10';
      }
    } catch (e) {
      os = 'Windows (version unknown)';
    }
  } else if (ua.includes('Mac')) {
    os = 'macOS';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  }

  // 🔢 Extract browser version
  const versionMatch = ua.match(/(Chrome|Firefox|Edg)\/(\d+)/);
  if (versionMatch) version = versionMatch[2];

  return {
    browser,
    isBrave,
    os,
    buildNumber,
    platform,
    platformVersion,
    userAgent: ua,
    version,
  };
}
