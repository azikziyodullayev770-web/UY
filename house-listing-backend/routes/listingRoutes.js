const express = require('express');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing
} = require('../controllers/listingController');

const router = express.Router();

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getListings)
  .post(protect, upload.array('images', 5), createListing);

router.route('/:id')
  .get(getListing)
  .put(protect, upload.array('images', 5), updateListing)
  .delete(protect, deleteListing);

module.exports = router;
