// Example usage with integrated architecture and features
const express = require('express');
const bodyParser = require('body-parser');
const PaymentAPIWrapper = require('./PaymentAPIWrapper');

const app = express();
app.use(bodyParser.json());

// Initialize PaymentAPIWrapper instances for different payment platforms
const visaAPI = new PaymentAPIWrapper('visa');
const mastercardAPI = new PaymentAPIWrapper('mastercard');

// Endpoint to process payments
app.post('/process-payment', async (req, res) => {
    const paymentData = req.body.paymentData; // Assuming the payment data is in the request body

    try {
        // Make payments using the PaymentAPIWrapper instances
        const visaPaymentResult = await visaAPI.makePayment(paymentData);
        const mastercardPaymentResult = await mastercardAPI.makePayment(paymentData);

        // You can add more business logic here, like updating your database, sending notifications, etc.

        res.status(200).json({
            visaResult: visaPaymentResult,
            mastercardResult: mastercardPaymentResult
        });
    } catch (error) {
        console.error('Payment Error:', error.message);
        res.status(500).json({ error: 'An error occurred while processing the payment.' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
