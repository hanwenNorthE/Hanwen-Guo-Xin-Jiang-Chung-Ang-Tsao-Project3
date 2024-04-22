// import React, { useState } from 'react';
// import axios from 'axios';

// // const API_URL = 'http://localhost:5000/api';


// function RegistrationPage() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/users/login', {
//         name:name,
//         email:email,
//         password:password
//       });
//       console.log(response.data); 
//       // 处理成功的注册，例如重定向到登录页面
//     } catch (error) {
//       if (error.response) {
//         // 请求已发出，但服务器返回状态码不在 2xx 范围内
//         console.log('服务器返回错误状态码：', error.response.status);
//         console.log('服务器返回的数据：', error.response.data);
//       } else if (error.request) {
//         // 请求已发出，但没有收到响应
//         console.log('请求未收到响应：', error.request);
//       } else {
//         // 发送请求时发生错误
//         console.log('请求发送时发生错误：', error.message);
//       }
//       setError('服务器请求失败！'); // 更新错误状态
//     }
//   };

//   return (
//     <div>
//       <h2>注册</h2>
//       {error && <p>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>姓名：</label>
//           <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
//         </div>
//         <div>
//           <label>电子邮件：</label>
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//         </div>
//         <div>
//           <label>密码：</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         </div>
//         <button type="submit">注册</button>
//       </form>
//     </div>
//   );
// }

// export default RegistrationPage;




// RegistrationForm.js

import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/signup', formData);
      console.log(response.data); // Assuming backend sends back user data upon successful registration
      // Optionally: Redirect user to another page or show a success message
    } catch (error) {
      console.log("Fail")
      console.error('Registration failed:', error.response.data.error);
      // Optionally: Display an error message to the user
    }
  };

  return (
    <div>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;

