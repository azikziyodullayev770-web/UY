const Listing = require('../models/Listing');

// @desc    Get all listings (with search, filter, pagination)
// @route   GET /api/listings
// @access  Public
exports.getListings = async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Parse back to object
    const parsedQuery = JSON.parse(queryStr);

    // Search by title or location
    if (req.query.search) {
      parsedQuery.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    query = Listing.find(parsedQuery).populate('createdBy', 'name email');

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Listing.countDocuments(parsedQuery);

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const listings = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: listings.length,
      pagination,
      data: listings
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('createdBy', 'name email');

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    res.status(200).json({ success: true, data: listing });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid ID format' });
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
exports.createListing = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Handle images if uploaded
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const listing = await Listing.create(req.body);

    res.status(201).json({ success: true, data: listing });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
exports.updateListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    // Make sure user is listing owner or admin
    if (listing.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to update this listing' });
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      req.body.images = [...listing.images, ...newImages];
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: listing });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    // Make sure user is listing owner or admin
    if (listing.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
