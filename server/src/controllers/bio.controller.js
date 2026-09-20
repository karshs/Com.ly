const BioProfile = require('../models/bioProfile.model');
const User = require('../models/user.model');
const { isValidUrl } = require('../utils/generateShortCode');


const getMyBioProfile = async (req, res) => {
  try {
    let profile = await BioProfile.findOne({ owner: req.user._id });

    if (!profile) {
      profile = await BioProfile.create({
        owner: req.user._id,
        displayName: req.user.username,
        bio: 'Welcome to my link hub!',
        theme: 'minimal-light',
        links: [],
      });
    }

    res.status(200).json({
      profile: {
        id: profile._id,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        theme: profile.theme,
        links: profile.links,
        username: req.user.username,
      },
    });
  } catch (error) {
    console.error('Get Bio Profile Error:', error);
    res.status(500).json({ error: 'Server error while fetching bio profile' });
  }
};


async function updateMyBioProfile(req, res) {
  try {
    const { displayName, bio, avatarUrl, theme, links } = req.body;
    const currentUserId = req.user._id;

    const validThemes = ['minimal-light', 'dark-slate', 'gradient'];
    if (theme && !validThemes.includes(theme)) {
      return res.status(400).json({
        error: {
          message: `Invalid theme selection. Choose from: ${validThemes.join(', ')}`,
          code: 'INVALID_THEME'
        }
      });
    }

    if (links && Array.isArray(links)) {
      for (let i = 0; i < links.length; i++) {
        const item = links[i];

        if (!item.label || !item.url) {
          return res.status(400).json({
            error: { message: 'Each social button link item must have both a label and a destination URL', code: 'VALIDATION_ERROR' }
          });
        }

        let itemUrl = item.url.trim();
        if (!itemUrl.startsWith('http://') && !itemUrl.startsWith('https://')) {
          itemUrl = 'https://' + itemUrl;
        }
        item.url = itemUrl;
      }
    }

    
    let profileRecord = await BioProfile.findOne({ owner: currentUserId });

    if (!profileRecord) {
      profileRecord = new BioProfile({ owner: currentUserId });
    }

    if (displayName !== undefined) profileRecord.displayName = displayName;
    if (bio !== undefined) profileRecord.bio = bio;
    if (avatarUrl !== undefined) profileRecord.avatarUrl = avatarUrl;
    if (theme !== undefined) profileRecord.theme = theme;
    if (links !== undefined) profileRecord.links = links;

    const savedProfile = await profileRecord.save();

    return res.status(200).json({
      message: 'Bio profile layout updated successfully',
      profile: savedProfile
    });

  } catch (error) {
    console.error('Update Bio Profile Error:', error);
    return res.status(500).json({
      error: {
        message: error.message || 'Server error occurred while processing bio profile customization updates.',
        code: 'SERVER_ERROR'
      }
    });
  }
}



// ==========================================
// 3. GET PUBLIC BIO PROFILE (Public endpoint for /bio/:username)
// ==========================================
// A public, unauthenticated endpoint to display a user's landing link hub
async function getPublicBioProfile(req, res) {
  try {
    const targetUsername = req.params.username;

    if (!targetUsername) {
      return res.status(400).json({
        error: { message: 'Username parameter is required', code: 'VALIDATION_ERROR' }
      });
    }

    const userRecord = await User.findOne({ username: targetUsername.toLowerCase() });
    
    if (!userRecord) {
      return res.status(404).json({
        error: { message: `User account "@${targetUsername}" could not be found`, code: 'USER_NOT_FOUND' }
      });
    }

    const profileRecord = await BioProfile.findOne({ owner: userRecord._id });
    
    if (!profileRecord) {
      return res.status(404).json({
        error: { message: `The bio link page for "@${targetUsername}" has not been initialized yet.`, code: 'PROFILE_NOT_FOUND' }
      });
    }

    const rawLinksList = profileRecord.links || [];
    const activeLinksOnly = [];

    for (let i = 0; i < rawLinksList.length; i++) {
      const liveLinkItem = rawLinksList[i];
      
      if (liveLinkItem.isActive !== false) {
        activeLinksOnly.push(liveLinkItem);
      }
    }

    activeLinksOnly.sort(function(itemA, itemB) {
      return itemA.order - itemB.order; 
    });

    return res.status(200).json({
      profile: {
        username: userRecord.username,
        displayName: profileRecord.displayName || userRecord.username,
        bio: profileRecord.bio || '',
        avatarUrl: profileRecord.avatarUrl || '',
        theme: profileRecord.theme || 'minimal-light',
        links: activeLinksOnly
      }
    });

  } catch (error) {
    console.error('Get Public Bio Profile Error:', error);
    return res.status(500).json({
      error: {
        message: 'Internal server error while retrieving public landing hub data profile.',
        code: 'SERVER_ERROR'
      }
    });
  }
}

module.exports = { getPublicBioProfile };


module.exports = {
  getMyBioProfile,
  updateMyBioProfile,
  getPublicBioProfile,
};
