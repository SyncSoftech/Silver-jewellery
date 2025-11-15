// import Link from 'next/link'
// import React, { useEffect, useState } from 'react'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useRouter } from 'next/router';

// function Login() { 
//     const router = useRouter()
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
    
//     useEffect(()=>{
//         if(localStorage.getItem('token')){
//             const redirect = router.query.redirect || '/';
//             router.push(redirect);
//         }
//     },[router.query.redirect])

//     const handleChange = (e) => {
//         if (e.target.name == 'email') {
//             setEmail(e.target.value)
//         }
//         else if (e.target.name == 'password') {
//             setPassword(e.target.value)
//         }
//     }
//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         const data = { email, password }
//         let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
//             method: 'Post',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         })
//         let response = await res.json()
//         console.log(response)
//         setEmail('')
//         setPassword('')
//         if (response.success) {
//             localStorage.setItem('token', response.token)
//             const redirect = router.query.redirect || '/';
//             toast.success('You are successfully logged in!', {
//                 position: "top-left",
//                 autoClose: 1000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//                 theme: "light",
//                 onClose: () => {
//                     router.push(redirect);
//                 }
//             });
//             setTimeout(() => {
//                 router.push(process.env.NEXT_PUBLIC_HOST)

//             }, 1000);
//         } else {
//             toast.error(response.error, {
//                 position: "top-left",
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//                 theme: "light",
//             });

//         }
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
//                                 Sign in to your account
//                             </h1>
//                             <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
//                                 Or <Link href={'/signup'}><span href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</span></Link>
//                             </p>
//                             <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" method='POST'>
//                                 <div>
//                                     <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
//                                     <input value={email} onChange={handleChange} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email address" required="" />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
//                                     <input value={password} onChange={handleChange} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <Link href={'/forgot'}><div href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</div></Link>
//                                 </div>
//                                 <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>

//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </section></div>
//     )
// }

// export default Login



// import Link from 'next/link'
// import React, { useEffect, useRef, useState } from 'react'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useRouter } from 'next/router';

// function Login() {
//     const router = useRouter()
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [loading, setLoading] = useState(false)

//     // AbortController for cancelling previous fetch
//     const abortCtrlRef = useRef(null)
//     // request id to ensure only the latest response is applied
//     const requestIdRef = useRef(0)

//     useEffect(() => {
//         if (localStorage.getItem('token')) {
//             const redirect = router.query.redirect || '/';
//             router.push(redirect);
//         }
//     }, [router.query.redirect, router]);

//     const handleChange = (e) => {
//         if (e.target.name == 'email') {
//             setEmail(e.target.value)
//         }
//         else if (e.target.name == 'password') {
//             setPassword(e.target.value)
//         }
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()

//         // Abort any previous pending request
//         if (abortCtrlRef.current) {
//             try { abortCtrlRef.current.abort() } catch (err) { /* ignore */ }
//         }

//         // create new controller and increment requestId
//         const controller = new AbortController()
//         abortCtrlRef.current = controller
//         const thisRequestId = ++requestIdRef.current

//         setLoading(true)
//         const data = { email, password }

//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(data),
//                 signal: controller.signal
//             })

//             // If this response is not for the latest request, ignore it
//             if (thisRequestId !== requestIdRef.current) return;

//             const response = await res.json()
//             console.log(response)

//             // clear inputs (only if latest)
//             setEmail('')
//             setPassword('')

//             if (response.success) {
//                 localStorage.setItem('token', response.token)
//                 const redirect = router.query.redirect || '/';

//                 toast.success('You are successfully logged in!', {
//                     position: "top-left",
//                     autoClose: 1000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "light",
//                     onClose: () => {
//                         // ensure we're still the latest before redirecting
//                         if (thisRequestId === requestIdRef.current) {
//                             router.push(redirect);
//                         }
//                     }
//                 });

//                 // fallback redirect if toast onClose not invoked for some reason
//                 setTimeout(() => {
//                     if (thisRequestId === requestIdRef.current) {
//                         router.push(process.env.NEXT_PUBLIC_HOST)
//                     }
//                 }, 1000);
//             } else {
//                 toast.error(response.error || 'Login failed', {
//                     position: "top-left",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "light",
//                 });
//             }
//         } catch (err) {
//             // If the request was aborted, don't show an error toast
//             if (err.name === 'AbortError') {
//                 console.log('Previous request aborted')
//             } else {
//                 console.error(err)
//                 toast.error('Network error. Please try again.', {
//                     position: "top-left",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "light",
//                 });
//             }
//         } finally {
//             // Only clear loading if this was the latest request
//             if (thisRequestId === requestIdRef.current) {
//                 setLoading(false)
//                 // clear controller ref since done
//                 abortCtrlRef.current = null
//             }
//         }
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
//                                 Sign in to your account
//                             </h1>
//                             <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
//                                 Or <Link href={'/signup'}><span className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</span></Link>
//                             </p>
//                             <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" method='POST'>
//                                 <div>
//                                     <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
//                                     <input value={email} onChange={handleChange} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email address" required />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
//                                     <input value={password} onChange={handleChange} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <Link href={'/forgot'}><div className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</div></Link>
//                                 </div>
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className={`w-full text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-primary-700'} focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
//                                 >
//                                     {loading ? 'Signing in...' : 'Sign in'}
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     )
// }

// export default Login


import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

function Login() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    // AbortController for cancelling previous fetch
    const abortCtrlRef = useRef(null)
    // request id to ensure only the latest response is applied
    const requestIdRef = useRef(0)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            const redirect = router.query.redirect || '/';
            router.push(redirect);
        }
    }, [router.query.redirect, router]);

    const handleChange = (e) => {
        if (e.target.name == 'email') {
            setEmail(e.target.value)
        }
        else if (e.target.name == 'password') {
            setPassword(e.target.value)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Abort any previous pending request
        if (abortCtrlRef.current) {
            try { abortCtrlRef.current.abort() } catch (err) { /* ignore */ }
        }

        // create new controller and increment requestId
        const controller = new AbortController()
        abortCtrlRef.current = controller
        const thisRequestId = ++requestIdRef.current

        setLoading(true)
        const data = { email, password }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                signal: controller.signal
            })

            // If this response is not for the latest request, ignore it
            if (thisRequestId !== requestIdRef.current) return;

            const response = await res.json()
            console.log(response)

            // clear inputs (only if latest)
            setEmail('')
            setPassword('')

            if (response.success) {
                localStorage.setItem('token', response.token)
                const redirect = router.query.redirect || '/';

                toast.success('You are successfully logged in!', {
                    position: "top-left",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    onClose: () => {
                        // ensure we're still the latest before redirecting
                        if (thisRequestId === requestIdRef.current) {
                            router.push(redirect);
                        }
                    }
                });

                // fallback redirect if toast onClose not invoked for some reason
                setTimeout(() => {
                    if (thisRequestId === requestIdRef.current) {
                        router.push(process.env.NEXT_PUBLIC_HOST)
                    }
                }, 1000);
            } else {
                toast.error(response.error || 'Login failed', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (err) {
            // If the request was aborted, don't show an error toast
            if (err.name === 'AbortError') {
                console.log('Previous request aborted')
            } else {
                console.error(err)
                toast.error('Network error. Please try again.', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } finally {
            // Only clear loading if this was the latest request
            if (thisRequestId === requestIdRef.current) {
                setLoading(false)
                // clear controller ref since done
                abortCtrlRef.current = null
            }
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
                    
                    <div className="w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl md:mt-0 sm:max-w-md xl:p-0 border border-white/20 transition-all ">
                        <div className="p-8 space-y-6">
                            
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-300 to-pink-600 bg-clip-text text-transparent">
                                    Welcome Back
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Don't have an account? <Link href={'/signup'}><span className="font-semibold text-rose-600 hover:text-rose-700 transition-colors hover:underline">Sign up</span></Link>
                                </p>
                            </div>
                            
                            <div className="space-y-5">
                                
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
                                        placeholder="Enter your password" 
                                        className="bg-gray-50/50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 block w-full p-3.5 transition-all outline-none hover:bg-white" 
                                        required 
                                    />
                                </div>
                                
                                <div className="flex items-center justify-end">
                                    <Link href={'/forgot'}>
                                        <div className="text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors hover:underline">
                                            Forgot password?
                                        </div>
                                    </Link>
                                </div>
                                
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`w-full text-white bg-gradient-to-r from-rose-300 to-pink-600 hover:from-rose-400 hover:to-pink-600 focus:ring-4 focus:outline-none focus:ring-rose-300 font-semibold rounded-xl text-sm px-5 py-3.5 text-center shadow-lg shadow-rose-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </span>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                                
                            </div>
                            
                        </div>
                    </div>
                    
                    <p className="mt-8 text-sm text-gray-600 text-center max-w-md">
                        Secure login powered by encryption
                    </p>
                    
                </div>
            </section>
        </div>
    )
}

export default Login