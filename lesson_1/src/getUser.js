'use strict';
const AWS = require('aws-sdk');

module.exports.handler = (event, context, callback) => {
    const dynamoClient = new AWS.DynamoDB.DocumentClient();
    // console.log('Received event:', JSON.stringify(event, null, 2));
    const params = {
      TableName: 'Users',
      Key: {
        mobile: '123456789'
      }
    };
    dynamoClient.get(params, (err, data) => {
      callback(err, data);
    });
};