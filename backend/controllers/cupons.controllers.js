import CuponsModels from "../models/cupons.models.js"

export const getAllCuponController = async (req, res, next) => {
    try {
        const cupon = await CuponsModels.findOne({
            userId: req.user._id, isActive: true
        });

        res.json(cupon || null)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
export const validateCupon = async (req, res, next) => {
    try {
        const { code } = req.body;
        const cupon = await CuponsModels.findOne({
            code: code,
            userId: req.user._id, isActive: true
        });

        if (cupon.expiratonDate < new Date()) {
            cupon.isActive = false;
            await cupon.save();
            return res.status(404).json({
                message: 'cupon expired'
            })
        }

        res.json({
            message: 'Coupon is valid',
            code: cupon.code,
            discountPercentage: cupon.discountPercentage
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}