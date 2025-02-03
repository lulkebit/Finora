const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});

const client = new PlaidApi(configuration);

module.exports = {
    client,
    createLinkToken: async (userId) => {
        try {
            const response = await client.linkTokenCreate({
                user: { client_user_id: userId.toString() },
                client_name: 'Finora',
                products: ['transactions'],
                country_codes: ['DE'],
                language: 'de',
            });
            return response.data;
        } catch (error) {
            console.error('Error creating link token:', error);
            throw error;
        }
    },

    exchangePublicToken: async (publicToken) => {
        try {
            const response = await client.itemPublicTokenExchange({
                public_token: publicToken,
            });
            return response.data;
        } catch (error) {
            console.error('Error exchanging public token:', error);
            throw error;
        }
    },
};
