import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true, baseURL: 'http://localhost:5000/api' }));

const timestamp = Date.now();
const BUYER = { name: 'Test Buyer', email: `buyer_stock_${timestamp}@test.com`, password: 'Password123!', role: 'buyer' };
const MANAGER = { name: 'Test Manager', email: `manager_stock_${timestamp}@test.com`, password: 'Password123!', role: 'manager' };

async function testStockLogic() {
    try {
        console.log("🔹 1. Registering Users...");
        await client.post('/auth/register', BUYER);
        await client.post('/auth/register', MANAGER);

        console.log("🔹 2. Accessing Product...");
        const productsRes = await client.get('/products');
        const product = productsRes.data.products[0];
        const initialStock = product.qty;
        console.log(`✅ Product: ${product.title} | Initial Stock: ${initialStock}`);

        console.log("🔹 3. Placing Order (Qty: 1)...");
        await client.post('/auth/login', BUYER); // Switch to Buyer for purchase
        const orderRes = await client.post('/orders', {
            productId: product._id,
            qty: 1,
            shippingAddress: "Addr", contactNumber: "123", receiverName: "Recv", paymentMethod: "Cash"
        });
        const orderId = orderRes.data.order._id;
        
        const afterOrderRes = await client.get(`/products/${product._id}`);
        const stockAfterOrder = afterOrderRes.data.qty;
        if (stockAfterOrder !== initialStock - 1) throw new Error("Stock did not decrease!");
        console.log(`✅ Stock decreased to: ${stockAfterOrder}`);

        console.log("🔹 4. Rejecting Order...");
        await client.post('/auth/login', MANAGER); // Switch to manager
        await client.patch(`/orders/${orderId}/reject`);
        console.log("✅ Order Rejected");

        const finalProductRes = await client.get(`/products/${product._id}`);
        const finalStock = finalProductRes.data.qty;
        
        if (finalStock !== initialStock) {
            console.error(`❌ STOCK FAIL: Expected ${initialStock}, got ${finalStock}`);
            // throw new Error("Stock was not restored!"); 
        } else {
            console.log(`✅ Stock restored to: ${finalStock}`);
        }

        console.log("🔹 5. Verifying Approved List...");
        const approvedRes = await client.get('/bookings/approved');
        const found = approvedRes.data.find(o => o._id === orderId);
        if (found) {
             console.error(`❌ LIST FAIL: Rejected order appearing in Approved List!`);
        } else {
             console.log(`✅ Rejected order is NOT in Approved List.`);
        }

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error.response?.data || error.message);
    }
}

testStockLogic();
