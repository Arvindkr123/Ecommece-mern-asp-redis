import ProductModels from './../models/products.models.js';
export const addToCartController = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        const existingItem = user?.cartItems?.find(item => item.id === productId);


        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user?.cartItems.push(productId)
        }

        await user.save();

        res.json(user?.cartItems)


    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


export const getCartProductsController = async (req, res, next) => {
    try {
        const products = await ProductModels.find({ _id: { $in: req.user.cartItems } });

        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find(cartItem => cartItem.id === product.id)
            return { ...product.toJSON(), quantity: item.quantity }
        });

        res.json(cartItems);
    } catch (error) {
        console.log("Error in get all cart products user controller", error.message);
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}



export const removeAllFromCartOneProductController = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(item => item.id !== productId)
        }

        await user.save();
        res.json(user.cartItems);

    } catch (error) {
        console.log("Error in remove from cart controller", error.message);
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}


export const updateCartQuantityProductController = async (req, res, next) => {
    try {
        const { id: productId } = req.params;
        const user = req.user;

        const { quantity } = req.body;

        const existingItem = user.cartItems.find(item => item.id === productId)

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(item => item.id !== productId);
                await user.save();
                return res.json(user.cartItems)
            }

            existingItem.quantity = quantity

            await user.save();

            res.json(user.cartItems);
        } else {
            res.status(404).json({
                message: 'product not found'
            })
        }
    } catch (error) {
        console.log("Error in update cart qunatity controller", error.message);
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}