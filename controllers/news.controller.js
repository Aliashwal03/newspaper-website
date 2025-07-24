const express = require('express')
const router = express.Router()
const Listing = require('../models/post')
const isSignedIn = require('../middleware/is-signed-in')
const upload = require('../config/multer')


// VIEW NEW LISTING FORM
router.get('/new', isSignedIn, (req, res) => {
    res.render('newsListings/new.ejs')
})

// POST FORM DATA TO DATABASE
router.post('/', isSignedIn, upload.single('image'), async (req, res) => {
    try {
        req.body.publisher = req.session.user._id
        req.body.image = {
            url: req.file.path,
            cloudinary_id: req.file.filename
        }
        await Listing.create(req.body)
        res.redirect('/newsListing')
    } catch (error) {
        console.log(error)
        res.send('Something went wrong')
    }
})

// VIEW THE PAGE
router.get('/', async (req, res) => {
    let filter = {}
    let category = null
    if (req.query.category) {
        filter.category = req.query.category
        category = req.query.category

    }
    const foundListings = await Listing.find(filter)
    res.render('newsListings/index.ejs', { foundListings,category })
})
// VIEW A SINGLE LISTING (SHOW PAGE)
router.get('/:listingId', async (req, res) => {
    try {
        const foundListing = await Listing.findById(req.params.listingId).populate('publisher').populate('comments.author')
        console.log(foundListing)
        res.render('newsListings/show.ejs', { foundListing: foundListing })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// DELETE LISTING FROM DATABASE
router.delete('/:listingId', isSignedIn, async (req, res) => {
    // find the listing
    const foundListing = await Listing.findById(req.params.listingId).populate('publisher')
    // check if the logged in user owns the listing
    if (foundListing.publisher._id.equals(req.session.user._id)) {
        // delete the listing and redirect
        await foundListing.deleteOne()
        return res.redirect('/newsListing')
    }
    return res.send('Not authorized')
})

// RENDER THE EDIT FORM VIEW
router.get('/:listingId/edit', isSignedIn, async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId).populate('publisher')

    if (foundListing.publisher._id.equals(req.session.user._id)) {
        return res.render('newsListings/edit.ejs', { foundListing: foundListing} )
    } 
        return res.send('Not authorized')
   

})

router.put('/:listingId', isSignedIn, upload.single('image'), async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId).populate('publisher')
    if (foundListing.publisher._id.equals(req.session.user._id)) {
        // If no new image uploaded, keep the old image
        if (!req.file) {
            req.body.image = foundListing.image
        } else {
            req.body.image = {
                url: req.file.path,
                cloudinary_id: req.file.filename
            }
        }
        await Listing.findByIdAndUpdate(req.params.listingId, req.body, { new: true })
        return res.redirect(`/newsListing/${req.params.listingId}`)
    } 
    return res.send('Not authorized')
})

// POST COMMENT FORM TO THE DATABASE
router.post('/:listingId/comments', isSignedIn, async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId)
    req.body.author = req.session.user._id
    console.log(req.body)
    foundListing.comments.push(req.body)
    await foundListing.save()
    res.redirect(`/newsListing/${req.params.listingId}`)
})

router.delete('/:listingId/comments/:commentId', isSignedIn, async (req, res) => {
    const { listingId, commentId } = req.params;
    const userId = req.session.user._id;

    try {
        const foundListing = await Listing.findById(listingId).populate('publisher').populate('comments.author');

        if (!foundListing) {
            return res.send('Listing not found');
        }

        const comment = foundListing.comments.id(commentId);

        if (!comment) {
            return res.send('Comment not found');
        }

        // Allow if current user is either:
        const isCommentAuthor = comment.author && comment.author._id.equals(userId);
        const isPostAuthor = foundListing.publisher && foundListing.publisher._id.equals(userId);

        if (isCommentAuthor || isPostAuthor) {
            foundListing.comments.pull(comment._id); 
            await foundListing.save();
            return res.redirect(`/newsListing/${listingId}`);
        }

        return res.send('Not authorized to delete this comment');
    } catch (err) {
        console.error(err);
        return res.send('Something went wrong');
    }
});


module.exports = router