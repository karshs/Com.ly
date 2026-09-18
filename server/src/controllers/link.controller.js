const Link = require('../models/link.model');
const Click = require('../models/click.model');
const { generateShortCode, isValidUrl } = require('../utils/generateShortCode');

const hashIp = require('../utils/hashIp'); 
const detectDevice = require('../utils/detectDevice');

// List of system-reserved words that cannot be used as custom slugs
const RESERVED_SLUGS = ['api', 'health', 'auth', 'r', 'bio', 'dashboard', 'login', 'signup', 'me'];


const createLink = async (req, res) => {
  try {
    let { originalUrl, customSlug } = req.body;

  
    if (!originalUrl) {
      return res.status(400).json({ error: 'Destination URL is required' });
    }

    // Auto-prepend https:// if protocol was omitted
    if(!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
      originalUrl = 'https://' + originalUrl;
    }

    
    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ error: 'Please provide a valid destination URL (e.g. https://example.com)' });
    }

    let finalShortCode;

    
    if (customSlug) {
      const formattedSlug = customSlug.trim().toLowerCase();

    
      if (RESERVED_SLUGS.includes(formattedSlug)) {
        return res.status(400).json({ error: `Slug "${formattedSlug}" is a reserved system keyword` });
      }

      const existingLink = await Link.findOne({ shortCode: formattedSlug });
      if (existingLink) {
        return res.status(409).json({ error: 'This custom slug is already taken. Please choose another one.' });
      }

      finalShortCode = formattedSlug;
    } else {
      // We Auto-generate 6-char code 
      const candidateCode = generateShortCode(6);
      const collisionCheck = await Link.findOne({ shortCode: candidateCode });

      if (collisionCheck || RESERVED_SLUGS.includes(candidateCode)) {
        finalShortCode = candidateCode + Date.now().toString().slice(-3);
      } else {
        finalShortCode = candidateCode;
      }
    }

    const newLink = await Link.create({
      owner: req.user._id,
      originalUrl,
      shortCode: finalShortCode,
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    res.status(201).json({
      message: 'Short link created successfully',
      link: {
        id: newLink._id,
        originalUrl: newLink.originalUrl,
        shortCode: newLink.shortCode,
        shortUrl: `${baseUrl}/r/${newLink.shortCode}`,
        clicks: newLink.clicks,
        createdAt: newLink.createdAt,
      },
    });
  } catch (error) {
    console.error('Create Link Error:', error);
    res.status(500).json({ error: error.message || 'Server error while creating link' });
  }
};


const getUserLinks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search ? req.query.search.trim() : '';
    const skip = (page - 1) * limit;

    // Base query: Only links created by the authenticated user
    const query = { owner: req.user._id };

    if (search) {
      query.$or = [
        { shortCode: { $regex: search, $options: 'i' } },
        { originalUrl: { $regex: search, $options: 'i' } },
      ];
    }

    // Run query and total count in parallel for speed
    const [links, total] = await Promise.all([
      Link.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Link.countDocuments(query),
    ]);

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    const formattedLinks = links.map((link) => ({
      id: link._id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      shortUrl: `${baseUrl}/r/${link.shortCode}`,
      clicks: link.clicks,
      isActive: link.isActive,
      createdAt: link.createdAt,
    }));

    res.status(200).json({
      links: formattedLinks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get User Links Error:', error);
    res.status(500).json({ error: 'Server error while fetching links' });
  }
};


const getLinkById = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Verify ownership
    if (link.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to view this link' });
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    res.status(200).json({
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl: `${baseUrl}/r/${link.shortCode}`,
        clicks: link.clicks,
        createdAt: link.createdAt,
      },
    });
  } catch (error) {
    console.error('Get Link By ID Error:', error);
    res.status(500).json({ error: 'Server error while fetching link' });
  }
};


const deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    if (link.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to delete this link' });
    }

    await Link.findByIdAndDelete(req.params.id);

    await Click.deleteMany({ link: req.params.id });

    res.status(200).json({ message: 'Link and associated analytics deleted successfully' });
  } catch (error) {
    console.error('Delete Link Error:', error);
    res.status(500).json({ error: 'Server error while deleting link' });
  }
};

const redirectLink = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const link = await Link.findOne({
      shortCode: shortCode.toLowerCase(),
      isActive: true,
    });

    if (!link) {
      return res.status(404).json({
        error: 'Short link not found or has been deactivated',
      });
    }

    // 302 redirect
    res.redirect(302, link.originalUrl);

    // 3.record click telemetry
    setImmediate(async () => {
      try {
        
        await Link.findByIdAndUpdate(link._id, { $inc: { clicks: 1 } });

        const userAgent = req.headers['user-agent'] || '';
        const rawReferrer = req.headers['referer'] || req.headers['referrer'] || 'direct';
        
        let referrer = 'direct';
        if (rawReferrer !== 'direct') {
          try {
            const refUrl = new URL(rawReferrer);
            referrer = refUrl.hostname.replace(/^www\./, '');
          } catch (e) {
            referrer = rawReferrer.substring(0, 100);
          }
        }

        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
        const ipHash = hashIp(clientIp);
        const device = detectDevice(userAgent);

        await Click.create({
          link: link._id,
          timestamp: new Date(),
          referrer,
          device,
          ipHash,
        });
      } catch (loggingError) {
        console.error('Async Telemetry Logging Error:', loggingError);
      }
    });
  } catch (error) {
    console.error('Redirect Error:', error);
    res.status(500).json({ error: 'Server error during redirection' });
  }
};


module.exports = {
  createLink,
  getUserLinks,
  getLinkById,
  deleteLink,
  redirectLink,
};
