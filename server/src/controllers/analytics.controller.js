const mongoose = require('mongoose');
const Link = require('../models/link.model');
const Click = require('../models/click.model');

// Helper to verify user owns the link before querying its analytics
const verifyLinkOwnership = async (linkId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(linkId)) {
    return { error: 'Invalid Link ID format', status: 400 };
  }

  const link = await Link.findById(linkId);
  if (!link) {
    return { error: 'Link not found', status: 404 };
  }

  if (link.owner.toString() !== userId.toString()) {
    return { error: 'Unauthorized to view analytics for this link', status: 403 };
  }

  return { link };
};


const getLinkOverview = async (req, res) => {
  try {
    const linkId = req.params.linkId;

    const authCheck = await verifyLinkOwnership(linkId, req.user._id);
    if (authCheck.error) {
      return res.status(authCheck.status).json({ error: authCheck.error });
    }

    const objectLinkId = new mongoose.Types.ObjectId(linkId);

    const allClicks = await Click.find({ link: objectLinkId });

    if (allClicks.length === 0) {
      return res.status(200).json({
        link: {
          id: authCheck.link._id,
          shortCode: authCheck.link.shortCode,
          originalUrl: authCheck.link.originalUrl,
          createdAt: authCheck.link.createdAt
        },
        overview: {
          totalClicks: 0,
          uniqueVisitors: 0,
          topDevice: 'N/A',
          topReferrer: 'N/A'
        }
      });
    }

    const totalClicks = allClicks.length;

    const uniqueIpHashes = new Set();
    const deviceCounts = {};
    const referrerCounts = {};

    for (let i = 0; i < allClicks.length; i++) {
      const currentClick = allClicks[i];

      // Track unique IP entries
      uniqueIpHashes.add(currentClick.deviceType); 

      
      const dev = currentClick.deviceType || 'Unknown';
      if (!deviceCounts[dev]) {
        deviceCounts[dev] = 1;
      } else {
        deviceCounts[dev] += 1;
      }

      
      const ref = currentClick.referrer || 'direct';
      if (!referrerCounts[ref]) {
        referrerCounts[ref] = 1;
      } else {
        referrerCounts[ref] += 1;
      }
    }

    let topDevice = 'N/A';
    let maxDeviceCount = 0;
    for (const key in deviceCounts) {
      if (deviceCounts[key] > maxDeviceCount) {
        maxDeviceCount = deviceCounts[key];
        topDevice = key;
      }
    }

    let topReferrer = 'N/A';
    let maxReferrerCount = 0;
    for (const key in referrerCounts) {
      if (referrerCounts[key] > maxReferrerCount) {
        maxReferrerCount = referrerCounts[key];
        topReferrer = key;
      }
    }


    res.status(200).json({
      link: {
        id: authCheck.link._id,
        shortCode: authCheck.link.shortCode,
        originalUrl: authCheck.link.originalUrl,
        createdAt: authCheck.link.createdAt,
      },
      overview: {
        totalClicks: totalClicks,
        uniqueVisitors: uniqueIpHashes.size, 
        topDevice: topDevice,
        topReferrer: topReferrer
      },
    });
  } catch (error) {
    console.error('Analytics Overview Error:', error);
    res.status(500).json({ error: 'Server error while fetching overview stats' });
  }
};


async function getClicksOverTime(req, res) {
  try {
    const linkId = req.params.linkId;

    const authCheck = await verifyLinkOwnership(linkId, req.user._id);
    if (authCheck.error) {
      return res.status(authCheck.status).json({
        error: { message: authCheck.error, code: 'FORBIDDEN_ACCESS' }
      });
    }

    const objectLinkId = new mongoose.Types.ObjectId(linkId);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    
    const rawClicks = await Click.find({
      link: objectLinkId,
      timestamp: { $gte: thirtyDaysAgo }
    });

    
    const dailyCounts = {};

    for (let i = 0; i < rawClicks.length; i++) {
      const click = rawClicks[i];
      
      // Convert the full timestamp date object into a clean standard YYYY-MM-DD string text
      // click.timestamp.toISOString() looks like: "2026-09-19T21:44:00.000Z"
      // .split('T')[0] cuts it at the 'T' and leaves exactly: "2026-09-19"
      const dateString = click.timestamp.toISOString().split('T')[0];

      if (!dailyCounts[dateString]) {
        dailyCounts[dateString] = 1; 
      } else {
        dailyCounts[dateString] += 1; 
      }
    }

    const formattedData = [];
    for (const dateKey in dailyCounts) {
      formattedData.push({
        date: dateKey,
        clicks: dailyCounts[dateKey]
      });
    }

    // Manual Chronological Sort: Arrange dates oldest to newest 
    // This replicates the native database '$sort' operation safely in JS
    formattedData.sort(function(a, b) {
      return new Date(a.date) - new Date(b.date);
    });

    return res.status(200).json({
      data: formattedData
    });

  } catch (error) {
    console.error('Time Series Error:', error);
    return res.status(500).json({
      error: {
        message: 'Server error while fetching time series data statistics dashboard.',
        code: 'SERVER_ERROR'
      }
    });
  }
}




async function getDeviceDistribution(req, res) {
  try {
    const linkId = req.params.linkId;

    const authCheck = await verifyLinkOwnership(linkId, req.user._id);
    if (authCheck.error) {
      return res.status(authCheck.status).json({
        error: { message: authCheck.error, code: 'FORBIDDEN_ACCESS' }
      });
    }

    const objectLinkId = new mongoose.Types.ObjectId(linkId);

    const allClicks = await Click.find({ link: objectLinkId });

    
    const deviceFrequencyMap = {};

    for (let i = 0; i < allClicks.length; i++) {
      const clickRecord = allClicks[i];
      
      // Look up deviceType field (Mandatory telemetry key constraint!)
      const deviceName = clickRecord.deviceType || 'Unknown';

      if (!deviceFrequencyMap[deviceName]) {
        deviceFrequencyMap[deviceName] = 1; // Seed initial click count
      } else {
        deviceFrequencyMap[deviceName] += 1; // Increment running click counter
      }
    }

  
    const formattedDeviceData = [];
    for (const deviceKey in deviceFrequencyMap) {
      formattedDeviceData.push({
        device: deviceKey,
        count: deviceFrequencyMap[deviceKey]
      });
    }

    
    formattedDeviceData.sort(function(a, b) {
      return b.count - a.count;
    });

    return res.status(200).json({
      data: formattedDeviceData
    });

  } catch (error) {
    console.error('Device Distribution Error:', error);
    return res.status(500).json({
      error: {
        message: 'Server error while calculating device distribution statistics dashboard charts.',
        code: 'SERVER_ERROR'
      }
    });
  }
}



async function getTopReferrers(req, res) {
  try {
    const linkId = req.params.linkId;

    const authCheck = await verifyLinkOwnership(linkId, req.user._id);
    if (authCheck.error) {
      return res.status(authCheck.status).json({
        error: { message: authCheck.error, code: 'FORBIDDEN_ACCESS' }
      });
    }

    const objectLinkId = new mongoose.Types.ObjectId(linkId);

    const allClicks = await Click.find({ link: objectLinkId });

    
    const referrerFrequencyMap = {};

    for (let i = 0; i < allClicks.length; i++) {
      const clickRecord = allClicks[i];
      
      // Extract referrer field string (defaults to 'direct' if blank)
      const sourceName = clickRecord.referrer || 'direct';

      if (!referrerFrequencyMap[sourceName]) {
        referrerFrequencyMap[sourceName] = 1; // Seed initial click count
      } else {
        referrerFrequencyMap[sourceName] += 1; // Increment running click counter
      }
    }

    
    const formattedReferrerList = [];
    for (const sourceKey in referrerFrequencyMap) {
      formattedReferrerList.push({
        referrer: sourceKey,
        count: referrerFrequencyMap[sourceKey]
      });
    }

    
    formattedReferrerList.sort(function(a, b) {
      return b.count - a.count;
    });

    
    const topTenReferrers = formattedReferrerList.slice(0, 10);

   
    return res.status(200).json({
      data: topTenReferrers
    });

  } catch (error) {
    console.error('Top Referrers Error:', error);
    return res.status(500).json({
      error: {
        message: 'Server error while calculating top traffic referrers metrics dashboard.',
        code: 'SERVER_ERROR'
      }
    });
  }
}


module.exports = {
  getLinkOverview,
  getClicksOverTime,
  getDeviceDistribution,
  getTopReferrers,
};
