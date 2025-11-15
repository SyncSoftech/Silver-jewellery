// import React, { useState } from 'react'
// import Link from 'next/link'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';

// const Signup = () => {
//     const router = useRouter()
//     useEffect(()=>{
//         if(localStorage.getItem('token')){
//             router.push('/')
//         }
        
//     },[])
//     const [name, setName] = useState('')
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')

//     const handleChange = (e) => {
//         if (e.target.name == 'name') {
//             setName(e.target.value)
//         }
//         else if (e.target.name == 'email') {
//             setEmail(e.target.value)
//         }
//         else if (e.target.name == 'password') {
//             setPassword(e.target.value)
//         }
//     }
//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         const data = { name, email, password }

//         let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
//             method: 'Post',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         })
//         let response = await res.json()
//         if(response.success){
//             // localStorage.setItem('token', response.token)
//             router.push('/login')
//         }
//         console.log(response)
//         setEmail('')
//         setName('')
//         setPassword('')
//         toast.success('Your account has been created!', {
//             position: "top-left",
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "light",
//             });

//     }


//     return (
//         <div>
//             <ToastContainer
//                 position="top-left"
//                 autoClose={3000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="light"
//             />
//             <section className="bg-gray-50 dark:bg-gray-900">
//                 <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//                     <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
//                         <img className="w-8 h-8 mr-2" src="/loginlogo.png" alt="logo" />

//                     </a>
//                     <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//                         <div className="p-2 space-y-4 md:space-y-2  sm:p-8">
//                             <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
//                                 Sign Up for an account
//                             </h1>
//                             <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
//                                 Or <Link href={'/login'}><span href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</span></Link>
//                             </p>
//                             <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" method='POST'>
//                                 <div>
//                                     <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
//                                     <input value={name} onChange={handleChange} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your Name" required="" />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
//                                     <input value={email} onChange={handleChange} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email address" required="" />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
//                                     <input value={password} onChange={handleChange} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
//                                 </div>


//                                 <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>

//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </section></div>
//     )
// }

// export default Signup


// import React, { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useRouter } from 'next/router';

// const Signup = () => {
//   const router = useRouter()

//   useEffect(()=>{
//     if (typeof window !== 'undefined' && localStorage.getItem('token')) {
//       router.push('/')
//     }
//   }, [router])

//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleChange = (e) => {
//     const { name: field, value } = e.target
//     if (field === 'name') setName(value)
//     else if (field === 'email') setEmail(value)
//     else if (field === 'password') setPassword(value)
//   }

//   // small client-side email format check (optional)
//   const isValidEmail = (em) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!isValidEmail(email)) {
//       toast.error('Please enter a valid email address', { position: 'top-left', autoClose: 3000 })
//       return
//     }

//     setLoading(true)
//     try {
//       const data = { name, email, password }

//       const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//       })

//       // if your backend uses non-JSON error pages this may throw; we guard for that
//       const response = await res.json().catch(() => null)

//       // Example expected backend responses:
//       // On success: { success: true, token: '...', message: 'Account created' }
//       // On validation fail: { success: false, error: 'Email already exists' }
//       // Or: { success: false, errors: { email: 'Email already exists', password: 'Too short' } }

//       if (res.ok && response && response.success) {
//         toast.success('Your account has been created!', { position: 'top-left', autoClose: 3000 })
//         // redirect to login (or directly log the user in by storing token)
//         router.push('/login')
//       } else {
//         // choose best error message available
//         let errMsg = 'Signup failed. Please try again.'
//         if (response && response.error) errMsg = response.error
//         else if (response && response.message) errMsg = response.message
//         else if (response && response.errors) {
//           // if server returns validation errors object, join them
//           if (typeof response.errors === 'string') errMsg = response.errors
//           else if (typeof response.errors === 'object') {
//             errMsg = Object.values(response.errors).flat().join(', ')
//           }
//         } else if (!res.ok) {
//           // if status is 409 (conflict) commonly used for "email exists"
//           if (res.status === 409) errMsg = 'Email already exists.'
//           else errMsg = `Server returned ${res.status} ${res.statusText}`
//         }

//         toast.error(errMsg, { position: 'top-left', autoClose: 4000 })
//       }

//       // clear fields only on success — optional. If you want to clear always, move outside if block.
//       if (response && response.success) {
//         setEmail('')
//         setName('')
//         setPassword('')
//       }
//       console.log('signup response:', response)
//     } catch (err) {
//       console.error('Signup error:', err)
//       toast.error('Network error. Please check your connection and try again.', { position: 'top-left', autoClose: 4000 })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div>
//       <ToastContainer
//         position="top-left"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//       <section className="bg-gray-50 dark:bg-gray-900">
//         <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//           <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
//             <img className="w-8 h-8 mr-2" src="/loginlogo.png" alt="logo" />
//           </a>
//           <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//             <div className="p-2 space-y-4 md:space-y-2 sm:p-8">
//               <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
//                 Sign Up for an account
//               </h1>
//               <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
//                 Or <Link href={'/login'}><span className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</span></Link>
//               </p>
//               <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" method="POST">
//                 <div>
//                   <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
//                   <input value={name} onChange={handleChange} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Your Name" required />
//                 </div>
//                 <div>
//                   <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
//                   <input value={email} onChange={handleChange} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Email address" required />
//                 </div>
//                 <div>
//                   <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
//                   <input value={password} onChange={handleChange} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
//                 </div>

//                 <button
//                   type="submit"
//                   className={`w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
//                   disabled={loading}
//                 >
//                   {loading ? 'Signing up...' : 'Sign up'}
//                 </button>

//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default Signup

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const Signup = () => {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.push('/')
    }
  }, [router])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name: field, value } = e.target
    if (field === 'name') setName(value)
    else if (field === 'email') setEmail(value)
    else if (field === 'password') setPassword(value)
  }

  const isValidEmail = (em) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address', { position: 'top-left', autoClose: 3000 })
      return
    }

    setLoading(true)
    try {
      const data = { name, email, password }

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const response = await res.json().catch(() => null)

      if (res.ok && response && response.success) {
        toast.success('Your account has been created!', { position: 'top-left', autoClose: 3000 })
        router.push('/login')
      } else {
        let errMsg = 'Signup failed. Please try again.'
        if (response && response.error) errMsg = response.error
        else if (response && response.message) errMsg = response.message
        else if (response && response.errors) {
          if (typeof response.errors === 'string') errMsg = response.errors
          else if (typeof response.errors === 'object') {
            errMsg = Object.values(response.errors).flat().join(', ')
          }
        } else if (!res.ok) {
          if (res.status === 409) errMsg = 'Email already exists.'
          else errMsg = `Server returned ${res.status} ${res.statusText}`
        }

        toast.error(errMsg, { position: 'top-left', autoClose: 4000 })
      }

      if (response && response.success) {
        setEmail('')
        setName('')
        setPassword('')
      }

      console.log('signup response:', response)
    } catch (err) {
      console.error('Signup error:', err)
      toast.error('Network error. Please check your connection and try again.', { position: 'top-left', autoClose: 4000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <section
        className="min-h-screen relative overflow-hidden"
        style={{ 
          background: 'radial-gradient(ellipse at top, #FFF2EF 0%, #F5E6E3 40%, #DBC4BF 100%)'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200 opacity-20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 relative z-10">

          <a href="#" className="flex items-center mb-8 text-2xl font-semibold text-gray-900 transition-transform hover:scale-105">
            <div className="w-12 h-12 mr-3 bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl shadow-lg flex items-center justify-center">
              <img className="w-8 h-8" src="/loginlogo.png" alt="logo" />
            </div>
          </a>

          <div className="w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl md:mt-0 sm:max-w-md xl:p-0 border border-white/20 transition-all hover:shadow-rose-200/50">
            <div className="p-8 space-y-6">

              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-300 to-pink-600 bg-clip-text text-transparent">
                  Create Account
                </h1>
                <p className="text-sm text-gray-600">
                  Already have an account? <Link href="/login"><span className="font-semibold text-rose-600 hover:text-rose-700 transition-colors hover:underline">Login</span></Link>
                </p>
              </div>

              <div className="space-y-5">

                <div className="group">
                  <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-700 group-focus-within:text-rose-600 transition-colors">
                    Full Name
                  </label>
                  <input
                    value={name}
                    onChange={handleChange}
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50/50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 block w-full p-3.5 transition-all outline-none hover:bg-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700 group-focus-within:text-rose-600 transition-colors">
                    Email Address
                  </label>
                  <input
                    value={email}
                    onChange={handleChange}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50/50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 block w-full p-3.5 transition-all outline-none hover:bg-white"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700 group-focus-within:text-rose-600 transition-colors">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={handleChange}
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50/50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 block w-full p-3.5 transition-all outline-none hover:bg-white"
                    placeholder="Create a strong password"
                    required
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className={`w-full text-white bg-gradient-to-r from-rose-300 to-pink-600 hover:from-rose-400 hover:to-pink-600 focus:ring-4 focus:outline-none focus:ring-rose-300 font-semibold rounded-xl text-sm px-5 py-3.5 text-center shadow-lg shadow-rose-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>

              </div>

            </div>
          </div>

          <p className="mt-8 text-sm text-gray-600 text-center max-w-md">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>

        </div>
      </section>
    </div>
  )
}

export default Signup