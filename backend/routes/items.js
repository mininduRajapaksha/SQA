const router = require("express").Router();
const Item = require("../models/items");
const multer = require('multer');
const path = require('path');
const { upload } = require('../server');
const fs = require('fs');


//add items
router.post("/add", upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        
        const newItem = new Item({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            imageUrl: imageUrl,
            stockQuantity: req.body.stockQuantity
        });

        newItem.save()
            .then(() => res.status(201).json({
                message: "Item added successfully!",
                item: newItem
            }))
            .catch(err => {
                // Clean up uploaded file if database save fails
                fs.unlinkSync(req.file.path);
                res.status(400).json("Error: " + err);
            });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
});

//get all items
router.route("/").get((req, res)=>{
    Item.find()
    .then(items=>res.json(items))
    .catch((e)=>res.status(400).json('error: '+e));
})

//get item by id
router.route("/:id").get((req, res)=>{
    Item.findById(req.params.id)
    .then(item=>res.json(item))
    .catch(err=>res.status(400).json('Error: '+err));
})

router.get('/seller/:sellerId', async (req, res) => {
    try {
      const items = await Item.find({ sellerId: req.params.sellerId });
      res.json(items);
    } catch (error) {
      res.status(400).json('Error: ' + error);
    }
  });

// //update item
// router.route("/update/:id").put((req, res)=>{
//     Item.findById(req.params.id)
//     .then(
//         item=>{
//             item.name = req.body.name;
//             item.description = req.body.description;
//             item.price = req.body.price;
//             item.category = req.body.category;
//             item.imageUrl = req.body.imageUrl;
//             item.stockQuantity = req.body.stockQuantity;
//             // item.sellerId = req.body.sellerId;

//             item.save()
//             .then(()=>res.json("Item updated!"))
//             .catch(err=>res.status(400).json('Error: '+err));
//         }
//     )
//     .catch(err=>res.status(400).json('Error: '+err));
// })
// Update item
router.route("/update/:id").put(upload.single('image'), async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        item.name = req.body.name;
        item.description = req.body.description;
        item.price = req.body.price;
        item.category = req.body.category;
        item.stockQuantity = req.body.stockQuantity;

        // Handle image update
        if (req.file) {
            // Delete old image if exists
            if (item.imageUrl) {
                const oldImagePath = item.imageUrl.split('/uploads/')[1];
                const fullPath = path.join(__dirname, '../uploads', oldImagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }
            
            // Update with new image
            item.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const updatedItem = await item.save();
        res.json({ message: "Item updated successfully!", item: updatedItem });
    } catch (error) {
        // Clean up uploaded file if save fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ message: error.message });
    }
});
// //delete item
// router.route("/delete/:id").delete((req, res)=>{
//     Item.findByIdAndDelete(req.params.id)
//     .then(()=>res.jason("Item deleted!"))
//     .catch(err=>res.status(400).json('Error: '+err));
// })

//delete item and image
router.route("/delete/:id").delete(async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Extract filename from imageUrl
        const imageUrl = item.imageUrl;
        if (imageUrl) {
            const filename = imageUrl.split('/uploads/').pop();
            const filePath = path.join(__dirname, '../uploads', filename);
            
            // Delete file if exists
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete item from database
        await Item.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Item deleted successfully" });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ 
            message: "Error deleting item", 
            error: error.message 
        });
    }
});

//get items by seller id
router.route("/seller/:id").get((req, res)=>{
    Item.find({sellerId:req.params.id})
    .then(items=>res.json(items))
    .catch(err=>res.status(400).json('Error: '+err));
})

module.exports = router;