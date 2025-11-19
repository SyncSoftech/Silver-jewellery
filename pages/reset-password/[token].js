
// import { useState } from "react";
// import { useRouter } from "next/router";

// const ResetPasswordPage = () => {
//   const router = useRouter();
//   const { token } = router.query;

//   const [newPassword, setNewPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const handleReset = async (e) => {
//     e.preventDefault();

//     const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/reset-password`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ token, password: newPassword })
//     });

//     const data = await res.json();
//     if (data.success) {
//       setMessage("✅ Password reset successfully. You can now log in.");
//       setSubmitted(true);
//       router.push('/login')
//     } else {
//       setMessage(`❌ ${data.error || "Something went wrong."}`);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
//         <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Reset Password</h1>
//         <form onSubmit={handleReset} className="space-y-4">
//           <div>
//             <input
//               type="password"
//               placeholder="Enter your new password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//               disabled={submitted}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={submitted}
//             className={`w-full py-2 px-4 rounded-md text-white ${submitted ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
//           >
//             {submitted ? 'Password Reset' : 'Reset Password'}
//           </button>
//         </form>
//         {message && (
//           <p className={`mt-4 text-center ${message.startsWith("✅") ? 'text-green-600' : 'text-red-600'}`}>
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordPage;


import { useState } from "react";
import { useRouter } from "next/router";

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/reset-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token, password: newPassword })
    });

    const data = await res.json();
    if (data.success) {
      setMessage("✅ Password reset successfully. You can now log in.");
      setSubmitted(true);
      router.push('/login')
    } else {
      setMessage(`❌ ${data.error || "Something went wrong."}`);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen"
      style={{ background: 'radial-gradient(circle, #FFF2EF, #DBC4BF)' }}
    >
      <div className="w-full max-w-md p-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Reset Password
        </h1>
        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={submitted}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all bg-white/90 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={submitted}
            className={`w-full py-3 px-4 rounded-xl text-white font-semibold ${submitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 transform hover:scale-[1.02] active:scale-[0.98]'} focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 shadow-lg transition-all`}
          >
            {submitted ? 'Password Reset' : 'Reset Password'}
          </button>
        </form>
        {message && (
          <div className={`mt-6 p-4 rounded-xl text-center font-medium ${message.startsWith("✅") ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;