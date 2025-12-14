const verifyLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: "testmanager@gmail.com",
            password: "Abc123456"
        })
    });

    const data = await response.json();
    
    if (response.ok && data.user) {
        console.log("✅ Login Successful!");
    } else {
        console.log("❌ Login failed:", JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error("❌ Request Failed:", error.message);
  }
};

verifyLogin();
