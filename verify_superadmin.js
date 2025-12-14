import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true, baseURL: 'http://localhost:5000/api' }));

const timestamp = Date.now();
const BUYER = { name: 'Test Buyer', email: `buyer_super_${timestamp}@test.com`, password: 'Password123!', role: 'buyer' };
const SUPERADMIN = { name: 'Test Super', email: `super_${timestamp}@test.com`, password: 'Password123!', role: 'superadmin' };

async function testSuperadminAccess() {
    try {
        console.log("🔹 1. Registering Buyer & Creating Order...");
        await client.post('/auth/register', BUYER);
        
        const productsRes = await client.get('/products');
        const product = productsRes.data.products[0];
        
        const orderRes = await client.post('/orders', {
            productId: product._id,
            qty: 1,
            shippingAddress: "Addr", contactNumber: "123", receiverName: "Recv", paymentMethod: "Cash"
        });
        const orderId = orderRes.data.order._id;
        console.log(`✅ Order Created: ${orderId}`);

        console.log("🔹 2. Registering Superadmin...");
        // Assuming registration allows 'role' param (development mode usually does)
        await client.post('/auth/register', SUPERADMIN);
        console.log("✅ Superadmin Registered & Logged In");

        console.log("🔹 3. [API] Fetching Pending Orders as Superadmin...");
        const pendingRes = await client.get('/orders/pending');
        const found = pendingRes.data.orders.find(o => o._id === orderId);
        if (!found) throw new Error("Superadmin could not see pending order!");
        console.log("✅ Superadmin can SEE pending orders.");

        console.log("🔹 4. [API] Approving Order as Superadmin...");
        await client.patch(`/orders/${orderId}/approve`);
        console.log("✅ Superadmin APPROVED order successfully.");

        console.log("\n🎉 API TEST PASSED: Superadmin has full access.");

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error.response?.data || error.message);
    }
}

testSuperadminAccess();
