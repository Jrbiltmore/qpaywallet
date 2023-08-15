// FinancialPlatformConnector.js

/*
   FinancialPlatformConnector.js - Module for interacting with various financial platforms' APIs.
   Author: Jacob Thomas
   Contact: jacobredmond@petzorbit.com
*/

const axios = require('axios');
const apiKey = process.env.FINANCIAL_PLATFORM_API_KEY;

class FinancialPlatformConnector {
    constructor(platform) {
        this.platform = platform;
        this.baseUrl = this.getBaseUrlForPlatform(platform);
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    getBaseUrlForPlatform(platform) {
        // Define and return the base URL for the specific financial platform
        // Example logic:
        if (platform === 'plaid') {
            return 'https://api.plaid.com';
        } else if (platform === 'stripe') {
            return 'https://api.stripe.com';
        }
        // Add more cases for other platforms
        throw new Error('Unsupported financial platform.');
    }

    async makeRequest(endpoint, method = 'GET', data = {}, params = {}) {
        try {
            const response = await this.client.request({
                url: endpoint,
                method,
                data,
                params
            });
            return response.data;
        } catch (error) {
            const errorMessage = `Error making ${method} request to ${this.platform}: ${error.message}`;
            throw new Error(errorMessage);
        }
    }

    async createCustomer(customerData) {
        return this.makeRequest('/customers', 'POST', customerData);
    }

    async fetchTransactions(customerId, startDate, endDate) {
        const queryParams = {
            startDate,
            endDate
        };
        return this.makeRequest(`/customers/${customerId}/transactions`, 'GET', {}, queryParams);
    }

    // Add more methods as needed

}

module.exports = FinancialPlatformConnector;
