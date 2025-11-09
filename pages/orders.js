import React from 'react'
import mongoose from 'mongoose'
import Order from '@/models/Order'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function Orders() {
  const router = useRouter()
    useEffect(()=>{
        if(!localStorage.getItem('token')){
            router.push('/')
        }
        
    },[router.query])
  return (
    <div >
      <div className='container mx-auto'>
        <h1 className='font-samibold text-center text-2xl p-8'>My Orders</h1>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table
                  className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                  <thead
                    className="border-b border-neutral-200 font-medium dark:border-white/10">
                    <tr>
                      <th scope="col" className="px-6 py-4">#</th>
                      <th scope="col" className="px-6 py-4">First</th>
                      <th scope="col" className="px-6 py-4">Last</th>
                      <th scope="col" className="px-6 py-4">Handle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600">
                      <td className="whitespace-nowrap px-6 py-4 font-medium">1</td>
                      <td className="whitespace-nowrap px-6 py-4">Mark</td>
                      <td className="whitespace-nowrap px-6 py-4">Otto</td>
                      <td className="whitespace-nowrap px-6 py-4">@mdo</td>
                    </tr>
                    <tr
                      className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600">
                      <td className="whitespace-nowrap px-6 py-4 font-medium">2</td>
                      <td className="whitespace-nowrap px-6 py-4">Jacob</td>
                      <td className="whitespace-nowrap px-6 py-4">Thornton</td>
                      <td className="whitespace-nowrap px-6 py-4">@fat</td>
                    </tr>
                    <tr
                      className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600">
                      <td className="whitespace-nowrap px-6 py-4 font-medium">3</td>
                      <td className="whitespace-nowrap px-6 py-4">Larry</td>
                      <td className="whitespace-nowrap px-6 py-4">Wild</td>
                      <td className="whitespace-nowrap px-6 py-4">@twitter</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }
  
  // Use lean() to get plain JavaScript objects and convert ObjectId and Date to strings
  let orders = await Order.find({}).lean().then(orders => 
    orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
      // Add any other date fields you might have in your Order model
    }))
  );

  return {
    props: { orders: JSON.parse(JSON.stringify(orders)) }, // Double stringify/parse to ensure serialization
  }
}

export default Orders
