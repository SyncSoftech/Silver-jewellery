

import React from 'react'
import Link from 'next/link'
import Product from "@/models/Product"
import mongoose from "mongoose";

const Necklaces = ({ Products }) => {
  return (
     <div className='min-h-screen ' style={{
    background: 'radial-gradient(circle, #FFF2Ef,#E0CAC5)',
  }} >
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4 justify-center">

            {Object.keys(Products).map((item) => {

              return <div passHref={true} key={Products[item]._id} className="lg:w-1/5 md:w-1/2 p-2 w-full cursor-pointer shadow-lg m-5 bg-white overflow-hidden" >
                <Link href={`/product/${Products[item].slug}`}>
                  <span className="block relative rounded overflow-hidden " >
                    <img alt="ecommerce" className="object-cover " src={Products[item].img} />
                  </span>
                </Link>
                <Link href={`/product/${Products[item].slug}`}>
                  <div className="mt-4 text-left p-2 ">
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Necklaces</h3>
                    <h2 className="text-gray-900 title-font text-lg font-medium mb-2">{Products[item].title}</h2>
                    <p className="mt-1 font-semibold text-gray-900">₹{Products[item].price}</p>
                    <div className="mt-3">
                      {Products[item].size.includes('Free') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>Free</span>}
                      {Products[item].size.includes('S') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>S</span>}
                      {Products[item].size.includes('M') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>M</span>}
                      {Products[item].size.includes('L') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>L</span>}
                      {Products[item].size.includes('XL') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>XL</span>}
                      {Products[item].size.includes('XXL') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>XXL</span>}
                    </div>
                    <div className="mt-3 flex items-center">
                      {Products[item].color.includes('Silver') && <button className="border-2 border-gray-400 ml-1 bg-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {Products[item].color.includes('Black') && <button className="border-2 border-gray-400 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
                      {Products[item].color.includes('Red') && <button className="border-2 border-gray-400 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {Products[item].color.includes('Blue') && <button className="border-2 border-gray-400 ml-1 bg-blue-600 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {Products[item].color.includes('Navy Blue') && <button className="border-2 border-gray-400 ml-1 bg-blue-950 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {Products[item].color.includes('Green') && <button className="border-2 border-gray-400 ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                    </div>
                  </div>
                </Link>
              </div>
            })}

          </div>
        </div>
      </section>
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }
  let Products = await Product.find({ category: 'Necklaces' })
  let Necklaces = {}
  for (let item of Products) {
    if (item.title in Necklaces) {
      if (!Necklaces[item.title].color.includes(item.color) && item.availableQty > 0) {
        Necklaces[item.title].color.push(item.color)
      }
      if (!Necklaces[item.title].size.includes(item.size) && item.availableQty > 0) {
        Necklaces[item.title].size.push(item.size)
      }
    }
    else {
      Necklaces[item.title] = JSON.parse(JSON.stringify(item))
      if (item.availableQty > 0) {
        Necklaces[item.title].color = [item.color]
        Necklaces[item.title].size = [item.size]
      }
    }
  }

  return {
    props: { Products: JSON.parse(JSON.stringify(Necklaces)) },
  }
}

export default Necklaces