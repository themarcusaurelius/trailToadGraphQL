require('dotenv').config();
const express = require('express');
const router = express.Router();
const request = require("request");

const STORE = process.env.STORE
const TOKEN = process.env.TOKEN
const SECRET = process.env.SECRET
const ORIGIN = process.env.ORIGIN

router.get('/product', (req,res) => {
    try {
        var options = {
            method: 'POST',
            url: `https://api.bigcommerce.com/stores/${STORE}/v3/storefront/api-token`,
            headers: {
                'content-type': 'application/json',
                'x-auth-client': `${SECRET}`,
                'x-auth-token': `${TOKEN}`
            },
            body: {
                "channel_id": 1,
                "expires_at": 1602288000,
                "allowed_cors_origins": [
                    `${ORIGIN}`,
                ]
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            var TOKEN = body.data.token

            var options = {
                method: 'POST',
                url: 'https://trailtoad.mybigcommerce.com/graphql',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                },
            
                body: {
                    query: `
                      query paginateProducts {
                        site {
                            products (first: 4) {
                                pageInfo {
                                    startCursor
                                    endCursor
                                }
                                edges {
                                    cursor
                                    node {
                                        entityId 
                                        name
                                        description
                                        prices {
                                            price {
                                              value
                                              currencyCode
                                            }
                                          }
                                        brand {
                                            name
                                            defaultImage {
                                              url(width: 200)
                                            }
                                        }
                                        images {
                                            edges {
                                                node {
                                                    url320wide: url(width: 320)
                                                    url640wide: url(width: 640)
                                                    url960wide: url(width: 960)
                                                    url1280wide: url(width: 1280)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    `   
                },
                json: true
            };

            request(options, function (error, response, body) {
               var DATA = body.data.site.products.edges[0].node

               res.json({ data: {
                   name: DATA.name,
                   brand: DATA.brand.name,
                   description: DATA.description,
                   price: DATA.prices.price.value,
                   image: DATA.images.edges[1].node.url1280wide
               }})
            }) 
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router; 