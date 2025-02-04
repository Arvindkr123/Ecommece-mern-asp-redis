import cloudinary from "../lib/cloudinary.js";
import ProductModels from "../models/products.models.js"
import { redisClient } from './../lib/redis.lib.js';

export const getAllProductControllers = async (req, res, next) => {
    try {
        const products = await ProductModels.find({})
        res.json({
            products
        })
    } catch (error) {
        res.status(500).json({
            message: 'server error',
            error: error.message
        })
    }
}

export const getFeaturedProductControllers = async (req, res, next) => {
    try {
        // const products = await ProductModels.find({})
        // res.json({
        //     products
        // })

        let featuredProducts = await redisClient.get("featured_products");

        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts))
        }

        featuredProducts = await ProductModels.find({ isFeatured: true }).lean();

        if (!featuredProducts) {
            return res.status(404).json({
                message: 'no featured product found'
            })
        }

        await redisClient.set('featured_products', JSON.stringify(featuredProducts))

        res.json(
            featuredProducts
        );

    } catch (error) {
        res.status(500).json({
            message: 'server error',
            error: error.message
        })
    }
}


export const createProductControllers = async (req, res, next) => {
    try {
        const { name, description, price, image, category } = req.body;
        console.log(req)

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" })
        }

        const product = await ProductModels.create({
            name,
            description,
            price,
            category,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : ""
        })

        res.status(201).json(product)


    } catch (error) {
        res.status(500).json({
            message: 'server error',
            error: error.message
        })
    }
}


export const deleteProductController = async (req, res, next) => {
    try {
        const product = await ProductModels.findById(req.params.id);

        if (!product) {
            return res.status(400).json({
                message: 'Product not found',
            })
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];

            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
            } catch (error) {
                console.log('error deleting image from cloudinary', error);
            }
        }

        await product.deleteOne();

        res.status(200).json({ message: 'product deleted successfully' })
    } catch (error) {
        res.status(500).json({
            message: 'server error',
            error: error.message
        })
    }
}


export const getRecommendationsProductControllers = async () => {
    try {
        const products = await ProductModels.aggregate(
            [{
                $sample: { size: 3 }
            }, {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }]
        );

        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: 'server error',
            error: error.message
        })
    }
}

export const getProductByCategoryControllers = async (req, res, next) => {
    try {
        const { category } = req.params;
        const products = await ProductModels.find({ category })
        res.json(products)
    } catch (error) {
        res.status(500).json({
            message: 'server error',
            error: error.message
        })
    }
}

export const toggleProductFeatureController = async (req, res, next) => {
    try {
        const product = await ProductModels.findById(req.params.id);

        if (!product) {
            return res.status(400).json({ message: 'product not found' })
        } else {

            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeatureProductToCache();

            res.json(updatedProduct)
        }

    } catch (error) {
        res.status(500).json({
            message: 'server error',
            error: error.message
        })
    }
}

async function updateFeatureProductToCache() {
    try {
        const featuredProducts = await ProductModels.find({ isFeatured: true }).lean()
        await redisClient.set("featured_products", JSON.stringify(featuredProducts));

    } catch (error) {
        console.log('error in update cache featured products');
    }

}