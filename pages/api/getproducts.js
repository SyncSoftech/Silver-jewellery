// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Product from "@/models/Product"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {
    let Products = await Product.find()
    let allProducts = {}
    for (let item of Products) {
        if (item.title in allProducts) {
            if (!allProducts[item.title].color.includes(item.color) && item.availableQty > 0) {
                allProducts[item.title].color.push(item.color)
            }
            if (!allProducts[item.title].size.includes(item.size) && item.availableQty > 0) {
                allProducts[item.title].size.push(item.size)
            }
        }
        else {
            allProducts[item.title] = JSON.parse(JSON.stringify(item))
            if (item.availableQty > 0) {
                allProducts[item.title].color = [item.color]
                allProducts[item.title].size = [item.size]
            }
        }
    }
    res.status(200).json({ allProducts })


}

export default connectDb(handler)